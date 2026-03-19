import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatSEK(amount) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' }).format(new Date(dateStr))
}

function monthLabel(month) {
  const [year, m] = month.split('-')
  return new Intl.DateTimeFormat('sv-SE', { month: 'long', year: 'numeric' })
    .format(new Date(Number(year), Number(m) - 1, 1))
}

const PRIMARY = [79, 155, 143]    // #4F9B8F
const MUTED   = [107, 114, 128]   // #6B7280
const BORDER  = [229, 231, 235]   // #E5E7EB
const BLACK   = [26, 26, 46]      // #1A1A2E
const SUCCESS = [16, 185, 129]    // #10B981
const DANGER  = [239, 68, 68]     // #EF4444
const WARNING = [245, 158, 11]    // #F59E0B

export function exportMonthPdf({ month, transactions, fixedCosts, fixedCostsTotal, categories }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = 0

  // ── Header bar ──────────────────────────────────────────────────────────────
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, W, 22, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text('PennyPlan', margin, 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const label = monthLabel(month)
  doc.text(label.charAt(0).toUpperCase() + label.slice(1), W - margin, 14, { align: 'right' })

  y = 32

  // ── Summary cards ────────────────────────────────────────────────────────────
  const byMonth = transactions.filter(t => t.date.startsWith(month))
  const income   = byMonth.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expenses = byMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance  = income - expenses

  const cardW = (W - margin * 2 - 8) / 3
  const cards = [
    { label: 'Inkomster',        value: formatSEK(income),   color: SUCCESS },
    { label: 'Utgifter',         value: formatSEK(expenses), color: DANGER  },
    { label: 'Kvar att spendera', value: formatSEK(balance), color: balance >= 0 ? PRIMARY : DANGER },
  ]

  cards.forEach((card, i) => {
    const x = margin + i * (cardW + 4)
    doc.setDrawColor(...BORDER)
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(x, y, cardW, 18, 2, 2, 'FD')
    doc.setFillColor(...card.color)
    doc.rect(x, y, 2.5, 18, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...MUTED)
    doc.text(card.label.toUpperCase(), x + 6, y + 6)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...BLACK)
    doc.text(card.value, x + 6, y + 13)
  })

  y += 26

  // ── Category breakdown ───────────────────────────────────────────────────────
  const expMap = {}
  byMonth.filter(t => t.type === 'expense').forEach(t => {
    expMap[t.category_id] = (expMap[t.category_id] ?? 0) + Number(t.amount)
  })
  const catRows = Object.entries(expMap)
    .map(([id, amt]) => {
      const cat = categories.find(c => c.id === id)
      return [cat?.name ?? id, formatSEK(amt)]
    })
    .sort((a, b) => b[1].localeCompare(a[1]))

  if (fixedCostsTotal > 0) {
    catRows.push(['Fasta kostnader', formatSEK(fixedCostsTotal)])
  }

  if (catRows.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...PRIMARY)
    doc.text('UTGIFTER PER KATEGORI', margin, y)
    y += 4

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Kategori', 'Belopp']],
      body: catRows,
      styles: { fontSize: 9, cellPadding: 3, textColor: BLACK },
      headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold', fontSize: 8 },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      tableLineColor: BORDER,
      tableLineWidth: 0.2,
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // ── Fixed costs breakdown ────────────────────────────────────────────────────
  if (fixedCosts.length > 0) {
    const CYCLE = { monthly: 'mån', bimonthly: 'varannan mån', quarterly: 'kvartal', yearly: 'år' }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...WARNING)
    doc.text('FASTA KOSTNADER', margin, y)
    y += 4

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Namn', 'Intervall', 'Belopp']],
      body: fixedCosts.map(c => [c.name, CYCLE[c.billing_cycle] ?? c.billing_cycle, formatSEK(c.amount)]),
      styles: { fontSize: 9, cellPadding: 3, textColor: BLACK },
      headStyles: { fillColor: WARNING, textColor: 255, fontStyle: 'bold', fontSize: 8 },
      columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      tableLineColor: BORDER,
      tableLineWidth: 0.2,
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // ── Transactions ─────────────────────────────────────────────────────────────
  if (byMonth.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...PRIMARY)
    doc.text('TRANSAKTIONER', margin, y)
    y += 4

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Datum', 'Kategori', 'Notering', 'Belopp']],
      body: byMonth.map(t => {
        const cat = categories.find(c => c.id === t.category_id)
        return [
          formatDate(t.date),
          cat?.name ?? t.category_id,
          t.note ?? '',
          (t.type === 'income' ? '+' : '−') + formatSEK(t.amount),
        ]
      }),
      styles: { fontSize: 8.5, cellPadding: 2.5, textColor: BLACK },
      headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold', fontSize: 8 },
      columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      tableLineColor: BORDER,
      tableLineWidth: 0.2,
      didParseCell(data) {
        if (data.column.index === 3 && data.section === 'body') {
          const val = data.cell.raw
          data.cell.styles.textColor = val.startsWith('+') ? SUCCESS : DANGER
        }
      }
    })
  }

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(...MUTED)
    doc.text(
      `Exporterad från PennyPlan  •  Sida ${i} av ${pageCount}`,
      W / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    )
  }

  const safeName = monthLabel(month).replace(/\s/g, '_')
  doc.save(`pennyplan_${safeName}.pdf`)
}
