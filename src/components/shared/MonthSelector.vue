<script setup>
import { formatMonthLabel, prevMonth, nextMonth } from '@/utils/format'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

function goToPrev() {
  emit('update:modelValue', prevMonth(props.modelValue))
}

function goToNext() {
  emit('update:modelValue', nextMonth(props.modelValue))
}
</script>

<template>
  <div class="month-selector">
    <button class="month-btn" @click="goToPrev" aria-label="Föregående månad">
      <ChevronLeft :size="16" :stroke-width="2.5" />
    </button>
    <span class="month-label">{{ formatMonthLabel(modelValue) }}</span>
    <button class="month-btn" @click="goToNext" aria-label="Nästa månad">
      <ChevronRight :size="16" :stroke-width="2.5" />
    </button>
  </div>
</template>

<style scoped>
.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.month-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  min-width: 140px;
  text-align: center;
  text-transform: capitalize;
  letter-spacing: -0.01em;
}

.month-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--color-text-muted);
  background-color: var(--color-card);
  border: 1.5px solid var(--color-border);
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
  cursor: pointer;
  flex-shrink: 0;
}

.month-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}
</style>
