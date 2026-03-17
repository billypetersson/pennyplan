<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import MonthSelector from '@/components/shared/MonthSelector.vue'
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import CategoryOverview from '@/components/dashboard/CategoryOverview.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import ReceiptScanner from '@/components/transactions/ReceiptScanner.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const transactionsStore = useTransactionsStore()
const authStore = useAuthStore()
const { selectedMonth } = storeToRefs(transactionsStore)

const showForm = ref(false)
const showScanner = ref(false)
const prefill = ref({})

const income = computed(() => transactionsStore.monthlyIncome)
const expenses = computed(() => transactionsStore.monthlyExpenses)
const balance = computed(() => transactionsStore.remainingBalance)
const expensesByCategory = computed(() => transactionsStore.expensesByCategory)
const hasTransactions = computed(() => transactionsStore.transactionsByMonth.length > 0)

onMounted(() => {
  transactionsStore.fetchTransactions()
})

function onMonthChange(month) {
  transactionsStore.setMonth(month)
}

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
</script>

<template>
  <AppLayout title="PennyPlan">
    <template #header-right>
      <button class="btn btn-ghost btn-sm" @click="handleSignOut">Logga ut</button>
    </template>

    <!-- Action buttons -->
    <div class="action-btn-container">
      <button class="btn btn-primary action-btn" @click="openForm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          style="width:18px;height:18px;" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Lägg till transaktion
      </button>
      <button class="btn action-btn action-btn-outline" @click="showScanner = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          style="width:18px;height:18px;" aria-hidden="true">
          <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
          <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
          <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
          <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
          <line x1="7" y1="12" x2="17" y2="12"/>
        </svg>
        Skanna kvitto
      </button>
    </div>

    <!-- Month selector -->
    <MonthSelector
      :model-value="selectedMonth"
      @update:model-value="onMonthChange"
    />

    <!-- Summary cards -->
    <SummaryCards
      :income="income"
      :expenses="expenses"
      :balance="balance"
    />

    <!-- Category breakdown -->
    <section>
      <h2 class="section-heading">Utgifter per kategori</h2>
      <div class="card">
        <CategoryOverview :expenses-by-category="expensesByCategory" />
      </div>
    </section>

    <!-- Empty state for the whole month -->
    <div v-if="!hasTransactions" class="empty-state dashboard-empty">
      <span class="empty-state-icon">💡</span>
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
