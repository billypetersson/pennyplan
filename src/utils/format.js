/**
 * Format a number as SEK currency (Swedish locale, no decimals).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format a date string (YYYY-MM-DD or ISO) as a long Swedish date.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateLong(date) {
  const s = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long' }).format(new Date(date))
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Format a date string as a short Swedish date (e.g. "16 mars").
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateShort(date) {
  const s = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(new Date(date))
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Get the display label for a YYYY-MM month string in Swedish.
 * E.g. "2025-03" → "mars 2025"
 * @param {string} month YYYY-MM
 * @returns {string}
 */
export function formatMonthLabel(month) {
  const [year, m] = month.split('-')
  const date = new Date(Number(year), Number(m) - 1, 1)
  const s = new Intl.DateTimeFormat('sv-SE', { month: 'long', year: 'numeric' }).format(date)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Returns the previous month as YYYY-MM.
 * @param {string} month YYYY-MM
 * @returns {string}
 */
export function prevMonth(month) {
  const [year, m] = month.split('-').map(Number)
  const date = new Date(year, m - 2, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Returns the next month as YYYY-MM.
 * @param {string} month YYYY-MM
 * @returns {string}
 */
export function nextMonth(month) {
  const [year, m] = month.split('-').map(Number)
  const date = new Date(year, m, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Returns today's date as YYYY-MM-DD.
 * @returns {string}
 */
export function todayISO() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
