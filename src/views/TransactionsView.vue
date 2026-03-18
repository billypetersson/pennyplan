<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import MonthSelector from '@/components/shared/MonthSelector.vue'
import TransactionList from '@/components/transactions/TransactionList.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import ReceiptScanner from '@/components/transactions/ReceiptScanner.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { Plus, ScanLine, Banknote } from 'lucide-vue-next'

const SALARY_KEY = 'pennyplan_salary_amount'

const transactionsStore = useTransactionsStore()
const { selectedMonth } = storeToRefs(transactionsStore)

const showForm = ref(false)
const showScanner = ref(false)
const prefill = ref({})

const transactions = computed(() => transactionsStore.transactionsByMonth)

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
  const saved = localStorage.getItem(SALARY_KEY)
  prefill.value = {
    type: 'income',
    category_id: 'income-lon',
    ...(saved ? { amount: Number(saved) } : {})
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
        <button class="btn btn-salary btn-sm" @click="openSalaryForm" aria-label="Registrera lön" title="Registrera månadslön">
          <Banknote :size="16" :stroke-width="2" aria-hidden="true" />
          Lön
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

    <TransactionList
      :transactions="transactions"
      @delete="handleDeleteTransaction"
    />

    <div class="add-btn-container">
      <button class="btn btn-ghost add-btn" @click="showScanner = true">
        <ScanLine :size="18" :stroke-width="2" aria-hidden="true" />
        Skanna kvitto
      </button>
      <button class="btn btn-salary add-btn" @click="openSalaryForm">
        <Banknote :size="18" :stroke-width="2" aria-hidden="true" />
        Registrera månadslön
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

.btn-salary {
  background-color: var(--color-success-light);
  color: var(--color-success);
  border: 1.5px solid var(--color-success);
  font-weight: 600;
}

.btn-salary:hover {
  background-color: var(--color-success);
  color: #fff;
}
</style>
