<script setup>
import { ref } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const categoriesStore = useCategoriesStore()
const showDeleteConfirm = ref(false)

const category = categoriesStore.getCategoryById(props.transaction.category_id)

function handleDelete() {
  emit('delete', props.transaction.id)
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="transaction-item" :class="{ 'transaction-item--confirming': showDeleteConfirm }">
    <div v-if="!showDeleteConfirm" class="transaction-item__main">
      <!-- Icon with tooltip -->
      <div class="transaction-item__cat">
        <div
          class="transaction-item__icon"
          :style="{ backgroundColor: (category?.color ?? '#6B7280') + '20' }"
          :data-tooltip="category?.name ?? transaction.category_id"
          aria-hidden="true"
        >
          <span>{{ category?.icon ?? '📦' }}</span>
        </div>
      </div>

      <!-- Note -->
      <div class="transaction-item__info">
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
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.15s;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item--confirming {
  background-color: var(--color-danger-light);
}

.transaction-item__main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.transaction-item__cat {
  flex-shrink: 0;
  position: relative;
}

.transaction-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: default;
}

.transaction-item__icon span {
  display: block;
  line-height: 1;
  position: relative;
  top: 1px;
}

.transaction-item__icon::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-text);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 10;
}

.transaction-item__icon:hover::after {
  opacity: 1;
}

.transaction-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.transaction-item__note {
  font-size: 0.875rem;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-item__right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
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
