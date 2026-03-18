<script setup>
const props = defineProps({
  modelValue: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue'])

const ranges = [
  { value: '1',     label: 'Idag' },
  { value: '7',     label: 'Senaste veckan' },
  { value: '14',    label: 'Senaste 14 dagar' },
  { value: '30',    label: 'Senaste 30 dagar' },
  { value: 'month', label: 'Denna månad' },
]
</script>

<template>
  <select
    class="range-select"
    :value="modelValue"
    @change="emit('update:modelValue', $event.target.value)"
  >
    <option v-for="r in ranges" :key="r.value" :value="r.value">{{ r.label }}</option>
  </select>
</template>

<style scoped>
.range-select {
  width: fit-content;
  padding: 0.3rem 1.75rem 0.3rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  background-color: var(--color-card);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.625rem center;
  transition: border-color 0.15s;
  line-height: 1.5;
}

.range-select:focus,
.range-select:hover {
  outline: none;
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
