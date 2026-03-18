<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import CategoryOverview from '@/components/dashboard/CategoryOverview.vue'
import RangeSelector from '@/components/dashboard/RangeSelector.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import ReceiptScanner from '@/components/transactions/ReceiptScanner.vue'
import SavingsGoalWidget from '@/components/dashboard/SavingsGoalWidget.vue'
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart.vue'
import { Plus, ScanLine, Lightbulb } from 'lucide-vue-next'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useFixedCostsStore } from '@/stores/fixedCosts'
import { useCategoriesStore } from '@/stores/categories'
import { useSavingsStore } from '@/stores/savings'
import { exportMonthPdf } from '@/utils/exportPdf'

const router = useRouter()
const transactionsStore = useTransactionsStore()
const authStore = useAuthStore()
const fixedCostsStore = useFixedCostsStore()
const categoriesStore = useCategoriesStore()
const savingsStore = useSavingsStore()

const showForm = ref(false)
const showScanner = ref(false)
const prefill = ref({})
const selectedRange = ref('30')

const filteredTransactions = computed(() => {
  if (selectedRange.value === 'month') {
    const now = new Date()
    const cutoff = new Date(now.getFullYear(), now.getMonth(), 1)
    return transactionsStore.transactions.filter(t => new Date(t.date) >= cutoff)
  }
  const days = Number(selectedRange.value)
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() - (days - 1))
  return transactionsStore.transactions.filter(t => new Date(t.date) >= cutoff)
})

const income = computed(() =>
  filteredTransactions.value.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
)
const expenses = computed(() =>
  filteredTransactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
)
const balance = computed(() => income.value - expenses.value)

const expensesByCategory = computed(() => {
  const map = {}
  filteredTransactions.value.filter(t => t.type === 'expense').forEach(t => {
    map[t.category_id] = (map[t.category_id] ?? 0) + Number(t.amount)
  })
  return Object.entries(map)
    .map(([category_id, amount]) => ({ category_id, amount }))
    .sort((a, b) => b.amount - a.amount)
})

const hasTransactions = computed(() => filteredTransactions.value.length > 0)

onMounted(() => {
  transactionsStore.fetchTransactions()
  fixedCostsStore.fetchCosts()
  savingsStore.fetchGoals()
})

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}

function openForm() {
  prefill.value = {}
  showForm.value = true
}

async function handleAddTransaction(data) {
  await transactionsStore.addTransaction(data)
  showForm.value = false
  prefill.value = {}
}

function handleScanned(data) {
  prefill.value = data
  showScanner.value = false
  showForm.value = true
}

function exportPdf() {
  exportMonthPdf({
    month: new Date().toISOString().slice(0, 7),
    transactions: filteredTransactions.value,
    fixedCosts: fixedCostsStore.costs,
    fixedCostsTotal: fixedCostsStore.totalMonthly,
    categories: categoriesStore.categories,
  })
}
</script>

<template>
  <AppLayout title="Översikt">
    <template #header-right>
      <div class="header-actions">
        <RangeSelector v-model="selectedRange" />
        <button class="header-btn" @click="exportPdf">Exportera</button>
      </div>
    </template>

    <!-- Action buttons -->
    <div class="action-btn-container">
      <button class="btn btn-primary action-btn" @click="openForm">
        <Plus :size="18" :stroke-width="2.5" aria-hidden="true" />
        Lägg till transaktion
      </button>
      <button class="btn action-btn action-btn-outline" @click="showScanner = true">
        <ScanLine :size="18" :stroke-width="2" aria-hidden="true" />
        Skanna kvitto
      </button>
    </div>



    <!-- Summary cards -->
    <SummaryCards
      :income="income"
      :expenses="expenses"
      :balance="balance"
    />

    <!-- Category breakdown -->
    <section>
      <h2 class="section-heading">Utgifter</h2>
      <div class="card">
        <CategoryOverview
          :expenses-by-category="expensesByCategory"
          :transactions="filteredTransactions"
          :fixed-costs="fixedCostsStore.costs"
          :fixed-costs-total="fixedCostsStore.totalMonthly"
        />
      </div>
    </section>

    <!-- Income vs Expense chart -->
    <section>
      <div class="card">
        <IncomeExpenseChart
          :transactions="filteredTransactions"
          :range="selectedRange"
        />
      </div>
    </section>

    <!-- Savings goals -->
    <SavingsGoalWidget :goals="savingsStore.goals" />

    <!-- Empty state for the whole month -->
    <div v-if="!hasTransactions" class="empty-state dashboard-empty">
      <Lightbulb class="empty-state-icon" :size="32" :stroke-width="1.5" aria-hidden="true" />
      <p class="empty-state-title">Kom igång med PennyPlan</p>
      <p class="empty-state-text">
        Lägg till din första inkomst eller utgift med knapparna ovan.
      </p>
    </div>

    <Transition name="fade">
      <ReceiptScanner
        v-if="showScanner"
        @scanned="handleScanned"
        @cancel="showScanner = false"
      />
    </Transition>

    <Transition name="fade">
      <TransactionForm
        v-if="showForm"
        :prefill="prefill"
        @submit="handleAddTransaction"
        @cancel="showForm = false; prefill = {}"
      />
    </Transition>

  </AppLayout>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-btn {
  padding: 0.3rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-text);
  background-color: var(--color-card);
  cursor: pointer;
  transition: border-color 0.15s;
  white-space: nowrap;
}

.header-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn-container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}

.action-btn-outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.action-btn-outline:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.dashboard-empty {
  padding: 2rem 1rem;
  background-color: var(--color-card);
  border-radius: var(--radius-lg);
  border: 1.5px dashed var(--color-border);
}
</style>
