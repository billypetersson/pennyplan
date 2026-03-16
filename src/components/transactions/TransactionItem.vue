<script setup>
import { ref } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { formatCurrency, formatDateShort } from '@/utils/format'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const categoriesStore = useCategoriesStore()
const showDeleteConfirm = ref(false)

const category = categoriesStore.getCategoryById(props.transaction.categoryId)

function handleDelete() {
  emit('delete', props.transaction.id)
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="transaction-item" :class="{ 'transaction-item--confirming': showDeleteConfirm }">
    <div v-if="!showDeleteConfirm" class="transaction-item__main">
      <!-- Icon -->
      <div
        class="transaction-item__icon"
        :style="{ backgroundColor: (category?.color ?? '#6B7280') + '20' }"
        aria-hidden="true"
      >
        <span>{{ category?.icon ?? '📦' }}</span>
      </div>

      <!-- Info -->
      <div class="transaction-item__info">
        <span class="transaction-item__category">{{ category?.name ?? transaction.categoryId }}</span>
        <span v-if="transaction.note" class="transaction-item__note">{{ transaction.note }}</span>
      </div>

      <!-- Amount + delete -->
      <div class="transaction-item__right">
        <span
          class="transaction-item__amount"
          :class="transaction.type === 'income' ? 'amount-income' : 'amount-expense'"
        >
          {{ transaction.type === 'income' ? '+' : '−' }}{{ formatCurrency(transaction.amount) }}
        </span>
        <button
          class="transaction-item__delete-btn"
          @click="showDeleteConfirm = true"
          aria-label="Ta bort transaktion"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Delete confirmation -->
    <div v-else class="transaction-item__confirm">
      <span class="transaction-item__confirm-text">Ta bort transaktionen?</span>
      <div class="transaction-item__confirm-actions">
        <button class="btn btn-sm btn-ghost" @click="showDeleteConfirm = false">Avbryt</button>
        <button class="btn btn-sm btn-danger" @click="handleDelete">Ta bort</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.15s;
}

.transaction-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.transaction-item:first-child {
  padding-top: 0;
}

.transaction-item--confirming {
  background-color: var(--color-danger-light);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  margin: 0 -0.75rem;
}

.transaction-item__main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.transaction-item__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.transaction-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.transaction-item__category {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-item__note {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-item__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.transaction-item__amount {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
}

.transaction-item__delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
  opacity: 0.5;
}

.transaction-item:hover .transaction-item__delete-btn {
  opacity: 1;
}

.transaction-item__delete-btn:hover {
  color: var(--color-danger);
  background-color: var(--color-danger-light);
}

.transaction-item__delete-btn svg {
  width: 14px;
  height: 14px;
}

/* Confirm state */
.transaction-item__confirm {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.transaction-item__confirm-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-danger);
}

.transaction-item__confirm-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
