<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { useCurrency } from '@/composables/useCurrency'

const { currencySymbol } = useCurrency()

const props = defineProps({
  goal: { type: Object, required: true }
})

const emit = defineEmits(['save', 'cancel'])

const amount = ref('')
const error = ref('')

function handleSubmit() {
  if (!amount.value || Number(amount.value) <= 0) {
    error.value = 'Ange ett giltigt belopp'
    return
  }
  emit('save', Number(amount.value))
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
      aria-label="Lägg till pengar"
    >
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">Lägg till pengar</h2>
          <button class="modal__close" @click="$emit('cancel')" aria-label="Stäng">
            <X :size="20" :stroke-width="2.5" />
          </button>
        </div>

        <form class="modal__body" @submit.prevent="handleSubmit" novalidate>
          <p class="modal__goal-name">{{ goal.title }}</p>

          <div class="form-group">
            <label class="form-label" for="funds-amount">Belopp ({{ currencySymbol }})</label>
            <div class="amount-input-wrap">
              <input
                id="funds-amount"
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
              <span class="amount-input-suffix">{{ currencySymbol }}</span>
            </div>
            <span v-if="error" class="form-error">{{ error }}</span>
          </div>

          <div class="modal__actions">
            <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Avbryt</button>
            <button type="submit" class="btn btn-primary">Lägg till</button>
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

.modal__goal-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1rem;
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
