<script setup>
import { computed } from 'vue'
import TransactionItem from './TransactionItem.vue'
import { formatDateLong } from '@/utils/format'
import { ClipboardList } from 'lucide-vue-next'

const props = defineProps({
  transactions: { type: Array, required: true }
})

const emit = defineEmits(['delete'])

const groupedByDate = computed(() => {
  const groups = {}
  for (const t of props.transactions) {
    const dateKey = t.date.slice(0, 10)
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(t)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, transactions]) => ({ date, transactions }))
})
</script>

<template>
  <div v-if="groupedByDate.length > 0" class="transaction-list card">
    <template v-for="(group, gi) in groupedByDate" :key="group.date">
      <!-- Date label -->
      <div class="date-label" :class="{ 'date-label--first': gi === 0 }">
        {{ formatDateLong(group.date) }}
      </div>

      <!-- Items -->
      <TransactionItem
        v-for="transaction in group.transactions"
        :key="transaction.id"
        :transaction="transaction"
        @delete="$emit('delete', $event)"
      />
    </template>
  </div>

  <div v-else class="empty-state">
    <ClipboardList class="empty-state-icon" :size="32" :stroke-width="1.5" aria-hidden="true" />
    <p class="empty-state-title">Inga transaktioner</p>
    <p class="empty-state-text">Det finns inga transaktioner för den valda månaden.</p>
  </div>
</template>

<style scoped>
.transaction-list {
  padding: 0;
}

.date-label {
  padding: 0.625rem 1rem 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
  margin-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.date-label--first {
  margin-top: 0;
  border-top: none;
}
</style>
