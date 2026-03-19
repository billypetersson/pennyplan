import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { prevMonth, nextMonth } from '@/utils/format'

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(false)
  const selectedMonth = ref(currentMonth())

  const transactionsByMonth = computed(() =>
    transactions.value.filter(t => t.date.startsWith(selectedMonth.value))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  const monthlyIncome = computed(() =>
    transactionsByMonth.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const monthlyExpenses = computed(() =>
    transactionsByMonth.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  const remainingBalance = computed(() => monthlyIncome.value - monthlyExpenses.value)

  const expensesByCategory = computed(() => {
    const map = {}
    transactionsByMonth.value
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!map[t.category_id]) map[t.category_id] = 0
        map[t.category_id] += Number(t.amount)
      })
    return Object.entries(map).map(([category_id, amount]) => ({ category_id, amount }))
      .sort((a, b) => b.amount - a.amount)
  })

  async function fetchTransactions() {
    loading.value = true
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    if (!error) transactions.value = data
    loading.value = false
  }

  async function addTransaction(payload) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Inte inloggad')
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    transactions.value.unshift(data)
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  function setMonth(month) {
    selectedMonth.value = month
  }

  function goToPrevMonth() {
    selectedMonth.value = prevMonth(selectedMonth.value)
  }

  function goToNextMonth() {
    selectedMonth.value = nextMonth(selectedMonth.value)
  }

  return {
    transactions, loading, selectedMonth,
    transactionsByMonth, monthlyIncome, monthlyExpenses, remainingBalance, expensesByCategory,
    fetchTransactions, addTransaction, deleteTransaction, setMonth, goToPrevMonth, goToNextMonth
  }
})
