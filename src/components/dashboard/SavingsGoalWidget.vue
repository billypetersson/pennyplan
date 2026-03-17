<script setup>
import { ref, computed, watch } from 'vue'
import { formatCurrency, formatDateShort } from '@/utils/format'

const props = defineProps({
  goals: { type: Array, required: true }
})

const selectedId = ref(null)

// Auto-select first goal, but keep selection if goals update
watch(() => props.goals, (goals) => {
  if (!selectedId.value && goals.length > 0) {
    selectedId.value = goals[0].id
  }
}, { immediate: true })

const goal = computed(() => props.goals.find(g => g.id === selectedId.value) ?? null)

const percentage = computed(() => {
  if (!goal.value) return 0
  return Math.min(Math.round((goal.value.current_amount / goal.value.target_amount) * 100), 100)
})

const daysRemaining = computed(() => {
  if (!goal.value?.target_date) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(goal.value.target_date)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
})

const remaining = computed(() => {
  if (!goal.value) return 0
  return Math.max(Number(goal.value.target_amount) - Number(goal.value.current_amount), 0)
})
</script>

<template>
  <section>
    <div class="section-header">
      <h2 class="section-heading">Sparmål</h2>

      <!-- Goal selector — only shown when multiple goals -->
      <div v-if="goals.length > 1" class="goal-tabs">
        <button
          v-for="g in goals"
          :key="g.id"
          class="goal-tab"
          :class="{ 'goal-tab--active': selectedId === g.id }"
          @click="selectedId = g.id"
        >
          {{ g.title }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="goals.length === 0" class="goal-empty card">
      <span class="goal-empty__icon">🎯</span>
      <p class="goal-empty__title">Inga sparmål ännu</p>
      <p class="goal-empty__text">Sätt upp ett sparmål för att följa dina framsteg direkt här på översikten.</p>
      <RouterLink to="/sparmal" class="btn btn-primary btn-sm">Skapa sparmål</RouterLink>
    </div>

    <div v-else-if="goal" class="goal-card card">
      <!-- Title + badge -->
      <div class="goal-card__header">
        <span class="goal-card__title">{{ goal.title }}</span>
        <span v-if="goal.current_amount >= goal.target_amount" class="badge badge--success">Uppnått!</span>
        <span
          v-else-if="daysRemaining !== null"
          class="badge"
          :class="{
            'badge--danger': daysRemaining < 0,
            'badge--warning': daysRemaining >= 0 && daysRemaining <= 30
          }"
        >
          <span v-if="daysRemaining < 0">Förfallet</span>
          <span v-else-if="daysRemaining === 0">Sista dag idag</span>
          <span v-else>{{ daysRemaining }} dagar kvar</span>
        </span>
      </div>

      <!-- Amounts -->
      <div class="goal-card__amounts">
        <div class="goal-card__amount-block">
          <span class="goal-card__amount-label">Sparat</span>
          <span class="goal-card__amount-value goal-card__amount-value--current">{{ formatCurrency(goal.current_amount) }}</span>
        </div>
        <div class="goal-card__amount-block goal-card__amount-block--right">
          <span class="goal-card__amount-label">Mål</span>
          <span class="goal-card__amount-value">{{ formatCurrency(goal.target_amount) }}</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="goal-card__progress">
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            :style="{
              width: percentage + '%',
              backgroundColor: goal.current_amount >= goal.target_amount ? 'var(--color-success)' : 'var(--color-primary)'
            }"
            role="progressbar"
            :aria-valuenow="percentage"
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <span class="goal-card__pct">{{ percentage }}%</span>
      </div>

      <!-- Footer -->
      <div class="goal-card__footer">
        <span v-if="remaining > 0" class="goal-card__remaining">{{ formatCurrency(remaining) }} kvar att spara</span>
        <span v-if="goal.target_date" class="goal-card__date">Måldatum: {{ formatDateShort(goal.target_date) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.section-header .section-heading {
  margin-bottom: 0;
}

.goal-tabs {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.goal-tab {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1.5px solid var(--color-border);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.goal-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.goal-tab--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.goal-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 1.5px dashed #c5c8cd;
  background-color: #e8eaed;
  box-shadow: none;
}

.goal-empty__icon {
  font-size: 1.75rem;
}

.goal-empty__title {
  font-size: 0.9375rem;
  font-weight: 600;
}

.goal-empty__text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  max-width: 280px;
}

.goal-card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.goal-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.goal-card__title {
  font-size: 1rem;
  font-weight: 700;
}

.badge--success {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.badge--warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}

.badge--danger {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.goal-card__amounts {
  display: flex;
  justify-content: space-between;
}

.goal-card__amount-block {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.goal-card__amount-block--right {
  text-align: right;
}

.goal-card__amount-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.goal-card__amount-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.goal-card__amount-value--current {
  color: var(--color-primary);
}

.goal-card__progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.goal-card__progress .progress-bar-track {
  flex: 1;
  height: 10px;
}

.goal-card__pct {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  min-width: 36px;
  text-align: right;
}

.goal-card__footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.goal-card__remaining {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.goal-card__date {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
</style>
