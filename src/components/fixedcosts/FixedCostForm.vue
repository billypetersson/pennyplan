<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  cost: { type: Object, default: null }
})

const emit = defineEmits(['save', 'cancel'])

const CATEGORIES = [
  { value: 'subscription', label: 'Prenumeration' },
  { value: 'insurance', label: 'Försäkring' },
  { value: 'rent', label: 'Hyra/Boende' },
  { value: 'loan', label: 'Lån' },
  { value: 'utility', label: 'El/Vatten/Värme' },
  { value: 'other', label: 'Övrigt' },
]

const CYCLES = [
  { value: 'monthly', label: 'Månadsvis' },
  { value: 'quarterly', label: 'Kvartalsvis' },
  { value: 'yearly', label: 'Årsvis' },
]

const name = ref('')
const amount = ref('')
const billing_cycle = ref('monthly')
const category = ref('subscription')
const due_day = ref('')

watch(() => props.cost, (c) => {
  if (c) {
    name.value = c.name
    amount.value = c.amount
    billing_cycle.value = c.billing_cycle
    category.value = c.category
    due_day.value = c.due_day ?? ''
  }
}, { immediate: true })

function submit() {
  if (!name.value.trim() || !amount.value) return
  emit('save', {
    name: name.value.trim(),
    amount: Number(amount.value),
    billing_cycle: billing_cycle.value,
    category: category.value,
    due_day: due_day.value ? Number(due_day.value) : null,
  })
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal-card card">
      <h2 class="modal-title">{{ cost ? 'Redigera kostnad' : 'Ny fast kostnad' }}</h2>

      <form class="form" @submit.prevent="submit">
        <div class="form-group">
          <label class="form-label">Namn</label>
          <input
            v-model="name"
            class="form-input"
            type="text"
            placeholder="t.ex. Netflix, Hemförsäkring"
            required
            autofocus
          />
        </div>

        <div class="form-group">
          <label class="form-label">Belopp (kr)</label>
          <input
            v-model="amount"
            class="form-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Kategori</label>
            <select v-model="category" class="form-input">
              <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Intervall</label>
            <select v-model="billing_cycle" class="form-input">
              <option v-for="c in CYCLES" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Förfallodatum (dag i månaden, valfritt)</label>
          <input
            v-model="due_day"
            class="form-input"
            type="number"
            min="1"
            max="31"
            placeholder="t.ex. 25"
          />
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Avbryt</button>
          <button type="submit" class="btn btn-primary">Spara</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

@media (min-width: 480px) {
  .modal-backdrop {
    align-items: center;
  }
}

.modal-card {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.form-input {
  padding: 0.625rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  background-color: var(--color-card);
  color: var(--color-text);
  width: 100%;
  transition: border-color 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
</style>
