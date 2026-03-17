<script setup>
import { ref, computed, watch } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { todayISO } from '@/utils/format'

const props = defineProps({
  prefill: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const categoriesStore = useCategoriesStore()

// Form state
const type = ref('expense')
const amount = ref(props.prefill.amount ?? '')
const categoryId = ref('')
const date = ref(props.prefill.date ?? todayISO())
const note = ref(props.prefill.note ?? '')
const errors = ref({})

// Categories filtered by selected type
const filteredCategories = computed(() =>
  categoriesStore.getCategoriesByType(type.value)
)

// Reset category when type changes
watch(type, () => {
  categoryId.value = ''
})

function validate() {
  const e = {}
  if (!amount.value || Number(amount.value) <= 0) {
    e.amount = 'Ange ett giltigt belopp'
  }
  if (!categoryId.value) {
    e.category_id = 'Välj en kategori'
  }
  if (!date.value) {
    e.date = 'Ange ett datum'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

function handleSubmit() {
  if (!validate()) return

  emit('submit', {
    type: type.value,
    amount: Number(amount.value),
    category_id: categoryId.value,
    date: date.value,
    note: note.value.trim()
  })
}

function handleCancel() {
  emit('cancel')
}

function handleBackdropClick(e) {
  if (e.target === e.currentTarget) {
    handleCancel()
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click="handleBackdropClick" role="dialog" aria-modal="true" aria-label="Lägg till transaktion">
      <div class="modal">
        <!-- Header -->
        <div class="modal__header">
          <h2 class="modal__title">Lägg till transaktion</h2>
          <button class="modal__close" @click="handleCancel" aria-label="Stäng">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <form class="modal__body" @submit.prevent="handleSubmit" novalidate>

          <!-- Type toggle -->
          <div class="form-group">
            <div class="type-toggle" role="group" aria-label="Transaktionstyp">
              <button
                type="button"
                class="type-toggle__btn"
                :class="{ 'type-toggle__btn--active type-toggle__btn--expense': type === 'expense' }"
                @click="type = 'expense'"
              >
                <span aria-hidden="true">↓</span> Utgift
              </button>
              <button
                type="button"
                class="type-toggle__btn"
                :class="{ 'type-toggle__btn--active type-toggle__btn--income': type === 'income' }"
                @click="type = 'income'"
              >
                <span aria-hidden="true">↑</span> Inkomst
              </button>
            </div>
          </div>

          <!-- Amount -->
          <div class="form-group">
            <label class="form-label" for="amount">Belopp (SEK)</label>
            <div class="amount-input-wrap">
              <input
                id="amount"
                v-model="amount"
                type="number"
                inputmode="decimal"
                min="0"
                step="1"
                placeholder="0"
                class="amount-input"
                :class="{ 'input-error': errors.amount }"
                autocomplete="off"
              />
              <span class="amount-input-suffix">kr</span>
            </div>
            <span v-if="errors.amount" class="form-error">{{ errors.amount }}</span>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label" for="category">Kategori</label>
            <div class="select-wrap">
              <select
                id="category"
                v-model="categoryId"
                :class="{ 'input-error': errors.category_id }"
              >
                <option value="" disabled>Välj kategori...</option>
                <option
                  v-for="cat in filteredCategories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
              <span class="select-arrow" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </div>
            <span v-if="errors.category_id" class="form-error">{{ errors.category_id }}</span>
          </div>

          <!-- Date -->
          <div class="form-group">
            <label class="form-label" for="date">Datum</label>
            <input
              id="date"
              v-model="date"
              type="date"
              :class="{ 'input-error': errors.date }"
            />
            <span v-if="errors.date" class="form-error">{{ errors.date }}</span>
          </div>

          <!-- Note -->
          <div class="form-group">
            <label class="form-label" for="note">
              Anteckning <span class="form-optional">(valfritt)</span>
            </label>
            <input
              id="note"
              v-model="note"
              type="text"
              placeholder="T.ex. ICA, Spotify..."
              maxlength="100"
            />
          </div>

          <!-- Actions -->
          <div class="modal__actions">
            <button type="button" class="btn btn-ghost" @click="handleCancel">Avbryt</button>
            <button
              type="submit"
              class="btn btn-primary"
              :class="type === 'income' ? 'btn-income' : ''"
            >
              Lägg till
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  background-color: var(--color-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%;
  max-width: 480px;
  max-height: 92vh;
  overflow-y: auto;
  animation: slideInFromBottom 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background-color: var(--color-card);
  z-index: 1;
}

.modal__title {
  font-size: 1.0625rem;
  font-weight: 700;
}

.modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.modal__close:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.modal__close svg {
  width: 18px;
  height: 18px;
}

.modal__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Type toggle */
.type-toggle {
  display: flex;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  overflow: hidden;
}

.type-toggle__btn {
  flex: 1;
  padding: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 500;
  background-color: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.type-toggle__btn + .type-toggle__btn {
  border-left: 1.5px solid var(--color-border);
}

.type-toggle__btn--active.type-toggle__btn--expense {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  font-weight: 600;
}

.type-toggle__btn--active.type-toggle__btn--income {
  background-color: var(--color-success-light);
  color: var(--color-success);
  font-weight: 600;
}

/* Amount input */
.amount-input-wrap {
  position: relative;
}

.amount-input {
  font-size: 1.125rem;
  font-weight: 600;
  padding-right: 2.5rem;
}

.amount-input-suffix {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  pointer-events: none;
}

/* Select */
.select-wrap {
  position: relative;
}

.select-wrap select {
  padding-right: 2.5rem;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
}

.select-arrow svg {
  width: 16px;
  height: 16px;
}

/* Error states */
.input-error {
  border-color: var(--color-danger);
}

.input-error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
}

.form-error {
  font-size: 0.8125rem;
  color: var(--color-danger);
  margin-top: 0.25rem;
}

.form-optional {
  font-weight: 400;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

/* Actions */
.modal__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.modal__actions .btn {
  flex: 1;
  padding: 0.75rem;
}

.btn-income {
  background-color: var(--color-success);
}

.btn-income:hover {
  background-color: #059669;
}
</style>
