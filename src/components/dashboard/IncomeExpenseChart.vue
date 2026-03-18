<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  transactions: { type: Array, default: () => [] },
  range: { type: String, default: '30' }
})

function bucketByWeeks(transactions, startDate, endDate) {
  const msPerDay = 86400000
  const totalDays = Math.round((endDate - startDate) / msPerDay) + 1
  const numBuckets = Math.min(5, totalDays)
  const bucketSize = totalDays / numBuckets
  const result = []
  for (let b = 0; b < numBuckets; b++) {
    const bStart = new Date(startDate.getTime() + b * bucketSize * msPerDay)
    const bEnd = new Date(startDate.getTime() + (b + 1) * bucketSize * msPerDay - 1)
    const bT = transactions.filter(t => { const d = new Date(t.date); return d >= bStart && d <= bEnd })
    const income = bT.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expense = bT.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    const label = bStart.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
    result.push({ label, income, expense })
  }
  return result
}

const chartData = computed(() => {
  const range = props.range

  if (range === '1') {
    const today = new Date().toISOString().slice(0, 10)
    const dayT = props.transactions.filter(t => t.date === today)
    const income = dayT.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expense = dayT.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return [{ label: 'Idag', income, expense }]
  }

  if (range === 'month') {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    return bucketByWeeks(props.transactions, startDate, endDate)
  }

  const days = Number(range)

  if (days <= 14) {
    const result = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const dateStr = d.toISOString().slice(0, 10)
      const dayT = props.transactions.filter(t => t.date === dateStr)
      const income = dayT.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
      const expense = dayT.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
      const label = days <= 7
        ? d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
        : String(d.getDate())
      result.push({ label, income, expense })
    }
    return result
  }

  // range=30: weekly buckets
  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 29)
  startDate.setHours(0, 0, 0, 0)
  return bucketByWeeks(props.transactions, startDate, endDate)
})

const maxValue = computed(() => {
  const vals = chartData.value.flatMap(d => [d.income, d.expense])
  return Math.max(...vals, 1)
})

const totalIncome = computed(() =>
  props.transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
)
const totalExpenses = computed(() =>
  props.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
)

// SVG layout constants
const SVG_W = 400
const SVG_H = 100
const CHART_H = 88
const PADDING_X = 8

function getPoints(key) {
  const n = chartData.value.length
  if (n === 0) return []
  const totalWidth = SVG_W - PADDING_X * 2
  return chartData.value.map((group, i) => {
    const x = n === 1 ? SVG_W / 2 : PADDING_X + (i / (n - 1)) * totalWidth
    const y = SVG_H - (group[key] / maxValue.value) * CHART_H
    return { x, y }
  })
}

function smoothLine(points) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(i + 2, points.length - 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return d
}

function areaPath(points) {
  if (points.length === 0) return ''
  const line = smoothLine(points)
  const lastX = points[points.length - 1].x
  const firstX = points[0].x
  return `${line} L ${lastX},${SVG_H} L ${firstX},${SVG_H} Z`
}

const incomePoints = computed(() => getPoints('income'))
const expensePoints = computed(() => getPoints('expense'))
const incomeLine = computed(() => smoothLine(incomePoints.value))
const expenseLine = computed(() => smoothLine(expensePoints.value))
const incomeArea = computed(() => areaPath(incomePoints.value))
const expenseArea = computed(() => areaPath(expensePoints.value))
</script>

<template>
  <div class="iec-root">
    <!-- Header row -->
    <div class="iec-header">
      <span class="iec-title">Inkomst &amp; Utgifter</span>
      <div class="iec-legend">
        <span class="legend-item">
          <span class="legend-dot legend-dot--income"></span>
          Inkomst
        </span>
        <span class="legend-item">
          <span class="legend-dot legend-dot--expense"></span>
          Utgifter
        </span>
      </div>
    </div>

    <!-- Stat chips -->
    <div class="iec-stats">
      <span class="stat-chip stat-chip--income">
        {{ formatCurrency(totalIncome) }}
      </span>
      <span class="stat-chip stat-chip--expense">
        {{ formatCurrency(totalExpenses) }}
      </span>
    </div>

    <!-- Chart -->
    <div class="iec-chart-wrap">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        class="iec-svg"
        aria-hidden="true"
      >
        <defs>
<linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#EF4444" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#EF4444" stop-opacity="0.03"/>
          </linearGradient>
        </defs>

        <!-- Gridlines -->
        <line v-for="n in 3" :key="n"
          x1="0" :y1="SVG_H - (CHART_H / 3) * n"
          :x2="SVG_W" :y2="SVG_H - (CHART_H / 3) * n"
          class="gridline"
        />

        <!-- Expense area + line -->
        <path :d="expenseArea" fill="url(#expenseGrad)" />
        <path :d="expenseLine" class="curve curve--expense" />

        <!-- Income dotted line only -->
        <path :d="incomeLine" class="curve curve--income" />
      </svg>

      <!-- X-axis labels -->
      <div class="iec-labels" :style="{ gridTemplateColumns: `repeat(${chartData.length}, 1fr)` }">
        <span v-for="(group, i) in chartData" :key="i" class="iec-label">
          {{ group.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iec-root {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.iec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.iec-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.iec-legend {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot--income { background-color: var(--color-success); }
.legend-dot--expense { background-color: var(--color-danger); }

/* Stat chips */
.iec-stats {
  display: flex;
  gap: 0.5rem;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.stat-chip--income {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.stat-chip--expense {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

/* Chart */
.iec-chart-wrap {
  display: flex;
  flex-direction: column;
  height: 140px;
}

.iec-svg {
  flex: 1;
  overflow: visible;
}

.gridline {
  stroke: var(--color-border);
  stroke-width: 0.5;
}

.curve {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.curve--income {
  stroke: var(--color-success);
  stroke-dasharray: 5 4;
}
.curve--expense { stroke: var(--color-danger); }


/* Labels */
.iec-labels {
  display: grid;
  margin-top: 4px;
}

.iec-label {
  font-size: 0.62rem;
  color: var(--color-text-muted);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
