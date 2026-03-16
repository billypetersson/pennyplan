<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import MonthSelector from '@/components/shared/MonthSelector.vue'
import TransactionList from '@/components/transactions/TransactionList.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import { useTransactionsStore } from '@/stores/transactions'

const transactionsStore = useTransactionsStore()
const { selectedMonth } = storeToRefs(transactionsStore)

const showForm = ref(false)

const transactions = computed(() => transactionsStore.transactionsByMonth)

function onMonthChange(month) {
  transactionsStore.setMonth(month)
}

function handleAddTransaction(data) {
  transactionsStore.addTransaction(data)
  showForm.value = false
}

function handleDeleteTransaction(id) {
  transactionsStore.deleteTransaction(id)
}
</script>

<template>
  <AppLayout title="Transaktioner">
    <template #header-right>
      <button
        class="btn btn-primary btn-sm"
        @click="showForm = true"
        aria-label="Lägg till transaktion"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          style="width:16px;height:16px;" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ny
      </button>
    </template>

    <!-- Month selector -->
    <MonthSelector :model-value="selectedMonth" @update:model-value="onMonthChange" />

    <!-- Transaction list -->
    <TransactionList
      :transactions="transactions"
      @delete="handleDeleteTransaction"
    />

    <!-- Add button (floating, for when header button is hidden on very small screens) -->
    <div class="add-btn-container">
      <button class="btn btn-primary add-btn" @click="showForm = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          style="width:18px;height:18px;" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Lägg till transaktion
      </button>
    </div>

    <!-- Transaction form modal -->
    <Transition name="fade">
      <TransactionForm
        v-if="showForm"
        @submit="handleAddTransaction"
        @cancel="showForm = false"
      />
    </Transition>
  </AppLayout>
</template>

<style scoped>
.add-btn-container {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

.add-btn {
  width: 100%;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}
</style>
