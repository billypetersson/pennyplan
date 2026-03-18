<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import MonthSelector from '@/components/shared/MonthSelector.vue'
import TransactionList from '@/components/transactions/TransactionList.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import ReceiptScanner from '@/components/transactions/ReceiptScanner.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { formatCurrency, formatMonthLabel } from '@/utils/format'
import { Plus, ScanLine, Banknote, CheckCircle2 } from 'lucide-vue-next'

const SALARY_KEY = 'pennyplan_salary_amount'

const transactionsStore = useTransactionsStore()
const { selectedMonth, transactions: allTransactions } = storeToRefs(transactionsStore)

const showForm = ref(false)
const showScanner = ref(false)
const prefill = ref({})

const transactions = computed(() => transactionsStore.transactionsByMonth)

// Check if salary is already registered for the selected month
const salaryThisMonth = computed(() =>
  transactions.value.find(t => t.type === 'income' && t.category_id === 'income-lon') ?? null
)

onMounted(() => {
  transactionsStore.fetchTransactions()
})

function onMonthChange(month) {
  transactionsStore.setMonth(month)
}

async function handleAddTransaction(data) {
  await transactionsStore.addTransaction(data)
  if (data.type === 'income' && data.category_id === 'income-lon' && data.amount > 0) {
    localStorage.setItem(SALARY_KEY, String(data.amount))
  }
  showForm.value = false
  prefill.value = {}
}

function openSalaryForm() {
  // Prefill with last known salary amount
  const saved = localStorage.getItem(SALARY_KEY)
  // Try to find last salary from any previous month
  const lastSalary = !saved
    ? allTransactions.value.find(t => t.type === 'income' && t.category_id === 'income-lon')
    : null
  const amount = saved ? Number(saved) : (lastSalary ? lastSalary.amount : undefined)

  prefill.value = {
    type: 'income',
    category_id: 'income-lon',
    ...(amount ? { amount } : {})
  }
  showForm.value = true
}

function handleDeleteTransaction(id) {
  transactionsStore.deleteTransaction(id)
}

function openForm() {
  prefill.value = {}
  showForm.value = true
}

function handleScanned(data) {
  prefill.value = data
  showScanner.value = false
  showForm.value = true
}
</script>

<template>
  <AppLayout title="Transaktioner">
    <template #header-right>
      <div class="header-actions">
        <button class="btn btn-ghost btn-sm" @click="showScanner = true" aria-label="Skanna kvitto" title="Skanna kvitto">
          <ScanLine :size="16" :stroke-width="2" aria-hidden="true" />
          Skanna
        </button>
        <button class="btn btn-primary btn-sm" @click="openForm" aria-label="Lägg till transaktion">
          <Plus :size="16" :stroke-width="2.5" aria-hidden="true" />
          Ny
        </button>
      </div>
    </template>

    <MonthSelector
      :model-value="selectedMonth"
      @update:model-value="onMonthChange"
    />

    <!-- Salary status card — once per month -->
    <div class="salary-card" :class="salaryThisMonth ? 'salary-card--done' : 'salary-card--missing'">
      <template v-if="salaryThisMonth">
        <CheckCircle2 :size="18" :stroke-width="2" class="salary-card__icon" aria-hidden="true" />
        <span class="salary-card__label">Lön registrerad</span>
        <span class="salary-card__amount">{{ formatCurrency(salaryThisMonth.amount) }}</span>
      </template>
      <template v-else>
        <Banknote :size="18" :stroke-width="2" class="salary-card__icon" aria-hidden="true" />
        <span class="salary-card__label">Ingen lön för {{ formatMonthLabel(selectedMonth) }}</span>
        <button class="btn btn-salary btn-sm salary-card__btn" @click="openSalaryForm">
          Lägg till lön
        </button>
      </template>
    </div>

    <TransactionList
      :transactions="transactions"
      @delete="handleDeleteTransaction"
    />

    <div class="add-btn-container">
      <button class="btn btn-ghost add-btn" @click="showScanner = true">
        <ScanLine :size="18" :stroke-width="2" aria-hidden="true" />
        Skanna kvitto
      </button>
      <button class="btn btn-primary add-btn" @click="openForm">
        <Plus :size="18" :stroke-width="2.5" aria-hidden="true" />
        Lägg till transaktion
      </button>
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
  gap: 0.5rem;
  align-items: center;
}

/* Salary card */
.salary-card {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.salary-card--missing {
  background-color: var(--color-success-light);
  border: 1.5px dashed var(--color-success);
  color: var(--color-success);
}

.salary-card--done {
  background-color: var(--color-success-light);
  border: 1.5px solid var(--color-success);
  color: var(--color-success);
}

.salary-card__icon {
  flex-shrink: 0;
}

.salary-card__label {
  flex: 1;
  font-weight: 500;
}

.salary-card__amount {
  font-weight: 700;
}

.salary-card__btn {
  flex-shrink: 0;
  margin-left: auto;
}

/* Salary button */
.btn-salary {
  background-color: var(--color-success);
  color: #fff;
  font-weight: 600;
}

.btn-salary:hover {
  background-color: #059669;
}

/* Bottom add buttons */
.add-btn-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
}

.add-btn {
  width: 100%;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}
</style>
