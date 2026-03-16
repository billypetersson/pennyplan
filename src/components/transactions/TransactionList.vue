<script setup>
import { computed } from 'vue'
import TransactionItem from './TransactionItem.vue'
import { formatDateLong } from '@/utils/format'

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['delete'])

// Group transactions by date (YYYY-MM-DD)
const groupedByDate = computed(() => {
  const groups = {}
  for (const t of props.transactions) {
    const dateKey = t.date.slice(0, 10) // YYYY-MM-DD
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(t)
  }

  // Sort dates descending
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, transactions]) => ({ date, transactions }))
})

function handleDelete(id) {
  emit('delete', id)
}
</script>

<template>
  <div v-if="groupedByDate.length > 0" class="transaction-list">
    <div
      v-for="group in groupedByDate"
      :key="group.date"
      class="transaction-group"
    >
      <div class="transaction-group__header">
        <h3 class="transaction-group__date">{{ formatDateLong(group.date) }}</h3>
      </div>

      <div class="card transaction-group__items">
        <TransactionItem
          v-for="transaction in group.transactions"
          :key="transaction.id"
          :transaction="transaction"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <span class="empty-state-icon">📋</span>
    <p class="empty-state-title">Inga transaktioner</p>
    <p class="empty-state-text">Det finns inga transaktioner för den valda månaden.</p>
  </div>
</template>

<style scoped>
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.transaction-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-group__header {
  padding: 0 0.125rem;
}

.transaction-group__date {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.transaction-group__items {
  padding: 0 0.75rem;
}
</style>
