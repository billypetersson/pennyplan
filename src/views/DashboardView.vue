<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import MonthSelector from '@/components/shared/MonthSelector.vue'
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import CategoryOverview from '@/components/dashboard/CategoryOverview.vue'
import { useTransactionsStore } from '@/stores/transactions'

const transactionsStore = useTransactionsStore()
const { selectedMonth } = storeToRefs(transactionsStore)

const income = computed(() => transactionsStore.monthlyIncome)
const expenses = computed(() => transactionsStore.monthlyExpenses)
const balance = computed(() => transactionsStore.remainingBalance)
const expensesByCategory = computed(() => transactionsStore.expensesByCategory)
const hasTransactions = computed(() => transactionsStore.transactionsByMonth.length > 0)

function onMonthChange(month) {
  transactionsStore.setMonth(month)
}
</script>

<template>
  <AppLayout title="PennyPlan">
    <!-- Month selector -->
    <MonthSelector :model-value="selectedMonth" @update:model-value="onMonthChange" />

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
        Gå till Transaktioner och lägg till din första inkomst eller utgift.
      </p>
    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard-empty {
  padding: 2rem 1rem;
  background-color: var(--color-card);
  border-radius: var(--radius-lg);
  border: 1.5px dashed var(--color-border);
}
</style>
