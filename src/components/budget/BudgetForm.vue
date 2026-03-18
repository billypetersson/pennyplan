<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'

const props = defineProps({
  category: { type: Object, required: true },
  existingLimit: { type: Object, default: null },
  month: { type: String, required: true }
})

const emit = defineEmits(['save', 'delete', 'cancel'])

const amount = ref(props.existingLimit?.amount ? String(Math.round(props.existingLimit.amount)) : '')
const error = ref('')

watch(() => props.existingLimit, (v) => {
  amount.value = v?.amount ? String(Math.round(v.amount)) : ''
})

function handleSubmit() {
  if (!amount.value || Number(amount.value) <= 0) {
    error.value = 'Ange ett giltigt belopp'
    return
  }
  emit('save', {
    category_id: props.category.id,
    month: props.month,
    amount: Number(amount.value)
  })
}

function handleDelete() {
  emit('delete', props.existingLimit.id)
}

function handleBackdropClick(e) {
  if (e.target === e.currentTarget) emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <div
      class="overlay"
      @click="handleBackdropClick"
      role="dialog"
      aria-modal="true"
      :aria-label="`Budgetgräns för ${category.name}`"
    >
      <div class="modal">
        <div class="modal__header">
          <div class="modal__header-left">
            <CategoryIcon :category-id="category.id" :size="18" class="modal__category-icon" aria-hidden="true" />
            <h2 class="modal__title">{{ category.name }}</h2>
          </div>
          <button class="modal__close" @click="$emit('cancel')" aria-label="Stäng">
            <X :size="20" :stroke-width="2.5" />
          </button>
        </div>

        <form class="modal__body" @submit.prevent="handleSubmit" novalidate>
          <div class="form-group">
            <label class="form-label" for="budget-amount">Budgetgräns (SEK)</label>
            <div class="amount-input-wrap">
              <input
                id="budget-amount"
                v-model="amount"
                type="number"
                inputmode="decimal"
                min="1"
                step="1"
                placeholder="0"
                class="amount-input"
                :class="{ 'input-error': error }"
                autocomplete="off"
                autofocus
              />
              <span class="amount-input-suffix">kr</span>
            </div>
            <span v-if="error" class="form-error">{{ error }}</span>
          </div>

          <div class="modal__actions">
            <button
              v-if="existingLimit"
              type="button"
              class="btn btn-danger"
              @click="handleDelete"
            >
              Ta bort
            </button>
            <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Avbryt</button>
            <button type="submit" class="btn btn-primary">Spara</button>
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
  animation: slideInFromBottom 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--color-border);
}

.modal__header-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.modal__category-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
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


.modal__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

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

.modal__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.modal__actions .btn {
  flex: 1;
  padding: 0.75rem;
}
</style>
