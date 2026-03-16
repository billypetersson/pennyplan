import { defineStore } from 'pinia'

const STORAGE_KEY = 'pennyplan_transactions'

function getInitialMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch (e) {
    console.error('Kunde inte spara transaktioner:', e)
  }
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: loadFromStorage(),
    loading: false,
    selectedMonth: getInitialMonth()
  }),

  getters: {
    transactionsByMonth: (state) => {
      return state.transactions
        .filter((t) => t.date.startsWith(state.selectedMonth))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    },

    monthlyIncome: (state) => {
      return state.transactions
        .filter((t) => t.date.startsWith(state.selectedMonth) && t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    },

    monthlyExpenses: (state) => {
      return state.transactions
        .filter((t) => t.date.startsWith(state.selectedMonth) && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    },

    remainingBalance(state) {
      return this.monthlyIncome - this.monthlyExpenses
    },

    expensesByCategory(state) {
      const expenseTransactions = state.transactions.filter(
        (t) => t.date.startsWith(state.selectedMonth) && t.type === 'expense'
      )

      const grouped = {}
      for (const t of expenseTransactions) {
        if (!grouped[t.categoryId]) {
          grouped[t.categoryId] = {
            categoryId: t.categoryId,
            amount: 0
          }
        }
        grouped[t.categoryId].amount += Number(t.amount)
      }

      return Object.values(grouped).sort((a, b) => b.amount - a.amount)
    }
  },

  actions: {
    addTransaction(data) {
      const transaction = {
        id: crypto.randomUUID(),
        type: data.type,
        amount: Number(data.amount),
        categoryId: data.categoryId,
        date: data.date,
        note: data.note ?? '',
        createdAt: new Date().toISOString()
      }
      this.transactions.unshift(transaction)
      saveToStorage(this.transactions)
      return transaction
    },

    deleteTransaction(id) {
      const index = this.transactions.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.transactions.splice(index, 1)
        saveToStorage(this.transactions)
      }
    },

    setMonth(month) {
      this.selectedMonth = month
    }
  }
})
