<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' }, // YYYY-MM-DD
  placeholder: { type: String, default: 'Välj datum' },
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref(null)

const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const d = new Date(val + 'T00:00:00')
      viewYear.value = d.getFullYear()
      viewMonth.value = d.getMonth()
    }
  },
  { immediate: true }
)

const selectedDate = computed(() => {
  if (!props.modelValue) return null
  return new Date(props.modelValue + 'T00:00:00')
})

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const headerLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('sv-SE', {
    month: 'long',
    year: 'numeric',
  })
)

const DAY_NAMES = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']

const calendarDays = computed(() => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Week starts Monday: Sun getDay()=0 → index 6, Mon=1 → index 0
  let startOffset = (firstDay.getDay() + 6) % 7

  const days = []

  for (let i = 0; i < startOffset; i++) {
    days.push({ date: new Date(year, month, i - startOffset + 1), current: false })
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), current: true })
  }
  const fill = 42 - days.length
  for (let i = 1; i <= fill; i++) {
    days.push({ date: new Date(year, month + 1, i), current: false })
  }

  return days
})

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

function selectDay(day) {
  const d = day.date
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  emit('update:modelValue', iso)
  isOpen.value = false
}

function isSelected(day) {
  return selectedDate.value?.toDateString() === day.date.toDateString()
}

function isToday(day) {
  return new Date().toDateString() === day.date.toDateString()
}

function handleOutsideClick(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<template>
  <div class="dp" ref="containerRef">
    <button
      type="button"
      class="dp__input"
      :class="{ 'dp__input--placeholder': !displayValue }"
      :id="id"
      @click="isOpen = !isOpen"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span>{{ displayValue || placeholder }}</span>
      <CalendarDays class="dp__icon" :size="16" :stroke-width="2" aria-hidden="true" />
    </button>

    <Transition name="dp-pop">
      <div v-if="isOpen" class="dp__popup" role="dialog" aria-label="Välj datum">
        <!-- Month navigation -->
        <div class="dp__header">
          <button type="button" class="dp__nav-btn" @click="prevMonth" aria-label="Föregående månad">
            <ChevronLeft :size="16" :stroke-width="2.5" />
          </button>
          <span class="dp__month-label">{{ headerLabel }}</span>
          <button type="button" class="dp__nav-btn" @click="nextMonth" aria-label="Nästa månad">
            <ChevronRight :size="16" :stroke-width="2.5" />
          </button>
        </div>

        <!-- Day names -->
        <div class="dp__grid">
          <span v-for="name in DAY_NAMES" :key="name" class="dp__day-name">{{ name }}</span>

          <!-- Days -->
          <button
            v-for="(day, i) in calendarDays"
            :key="i"
            type="button"
            class="dp__day"
            :class="{
              'dp__day--other': !day.current,
              'dp__day--today': isToday(day),
              'dp__day--selected': isSelected(day),
            }"
            @click="selectDay(day)"
            :aria-pressed="isSelected(day)"
            :aria-label="day.date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })"
          >
            {{ day.date.getDate() }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dp {
  position: relative;
  width: 100%;
}

/* Trigger button styled as an input */
.dp__input {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background-color: var(--color-card);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.dp__input:focus,
.dp__input[aria-expanded="true"] {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 155, 143, 0.15);
  outline: none;
}

.dp__input--placeholder span {
  color: var(--color-text-muted);
}

.dp__icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* Popup */
.dp__popup {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 200;
  background-color: var(--color-card);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 0.75rem;
  width: 280px;
}

/* Header */
.dp__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;
}

.dp__month-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  text-transform: capitalize;
}

.dp__nav-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.dp__nav-btn:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* Grid */
.dp__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.dp__day-name {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: center;
  padding: 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dp__day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text);
  transition: background-color 0.1s, color 0.1s;
}

.dp__day:hover {
  background-color: var(--color-bg);
}

.dp__day--other {
  color: var(--color-text-muted);
  opacity: 0.45;
}

.dp__day--today {
  font-weight: 700;
  color: var(--color-primary);
}

.dp__day--selected {
  background-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.dp__day--selected:hover {
  background-color: var(--color-primary-dark);
}

/* Transition */
.dp-pop-enter-active,
.dp-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dp-pop-enter-from,
.dp-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
