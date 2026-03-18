<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  goal: { type: Object, default: null }
})

const emit = defineEmits(['save', 'cancel'])

const title = ref(props.goal?.title ?? '')
const targetAmount = ref(props.goal?.target_amount ? String(Math.round(props.goal.target_amount)) : '')
const targetDate = ref(props.goal?.target_date ?? '')
const errors = ref({})

const isEditMode = computed(() => !!props.goal)

function validate() {
  const e = {}
  if (!title.value.trim()) e.title = 'Ange ett namn för målet'
  if (!targetAmount.value || Number(targetAmount.value) <= 0) e.targetAmount = 'Ange ett målbelopp'
  errors.value = e
  return Object.keys(e).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('save', {
    title: title.value.trim(),
    target_amount: Number(targetAmount.value),
    target_date: targetDate.value || null
  })
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
      aria-label="Sparmål"
    >
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">{{ isEditMode ? 'Redigera sparmål' : 'Nytt sparmål' }}</h2>
          <button class="modal__close" @click="$emit('cancel')" aria-label="Stäng">
            <X :size="20" :stroke-width="2.5" />
          </button>
        </div>

        <form class="modal__body" @submit.prevent="handleSubmit" novalidate>
          <div class="form-group">
            <label class="form-label" for="goal-title">Namn</label>
            <input
              id="goal-title"
              v-model="title"
              type="text"
              placeholder="T.ex. Semester, ny dator, buffert..."
              maxlength="60"
              :class="{ 'input-error': errors.title }"
              autocomplete="off"
            />
            <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="goal-amount">Målbelopp (SEK)</label>
            <div class="amount-input-wrap">
              <input
                id="goal-amount"
                v-model="targetAmount"
                type="number"
                inputmode="decimal"
                min="1"
                step="1"
                placeholder="0"
                class="amount-input"
                :class="{ 'input-error': errors.targetAmount }"
                autocomplete="off"
              />
              <span class="amount-input-suffix">kr</span>
            </div>
            <span v-if="errors.targetAmount" class="form-error">{{ errors.targetAmount }}</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="goal-date">
              Måldatum <span class="form-optional">(valfritt)</span>
            </label>
            <input
              id="goal-date"
              v-model="targetDate"
              type="date"
            />
          </div>

          <div class="modal__actions">
            <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Avbryt</button>
            <button type="submit" class="btn btn-primary">
              {{ isEditMode ? 'Spara' : 'Skapa' }}
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
