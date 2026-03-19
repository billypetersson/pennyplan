<script setup>
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SavingsGoalForm from '@/components/savings/SavingsGoalForm.vue'
import AddFundsModal from '@/components/savings/AddFundsModal.vue'
import { useSavingsStore } from '@/stores/savings'
import { formatDateShort } from '@/utils/format'
import { useCurrency } from '@/composables/useCurrency'
import { Pencil, Target } from 'lucide-vue-next'

const { formatAmount } = useCurrency()
const savingsStore = useSavingsStore()

const showGoalForm = ref(false)
const editGoal = ref(null)
const addFundsGoal = ref(null)

onMounted(() => savingsStore.fetchGoals())

const goals = computed(() => savingsStore.goals)

function daysRemaining(targetDate) {
  if (!targetDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

function openAddGoal() {
  editGoal.value = null
  showGoalForm.value = true
}

function openEditGoal(goal) {
  editGoal.value = goal
  showGoalForm.value = true
}

function closeGoalForm() {
  showGoalForm.value = false
  editGoal.value = null
}

async function handleGoalSave(payload) {
  if (editGoal.value) {
    await savingsStore.updateGoal(editGoal.value.id, payload)
  } else {
    await savingsStore.addGoal(payload)
  }
  closeGoalForm()
}

async function handleDelete(id) {
  await savingsStore.deleteGoal(id)
}

function openAddFunds(goal) {
  addFundsGoal.value = goal
}

function closeAddFunds() {
  addFundsGoal.value = null
}

async function handleAddFunds(amount) {
  const goal = addFundsGoal.value
  const newAmount = Math.min(Number(goal.current_amount) + amount, Number(goal.target_amount))
  await savingsStore.updateGoal(goal.id, { current_amount: newAmount })
  closeAddFunds()
}
</script>

<template>
  <AppLayout title="Sparmål">
    <template #header-right>
      <button class="btn btn-primary btn-sm" @click="openAddGoal">+ Nytt mål</button>
    </template>

    <!-- Goals list -->
    <div v-if="goals.length > 0" class="goals-list">
      <div v-for="goal in goals" :key="goal.id" class="goal-card card">
        <!-- Header -->
        <div class="goal-card__header">
          <div class="goal-card__title-wrap">
            <h3 class="goal-card__title">{{ goal.title }}</h3>
            <span
              v-if="goal.target_date && daysRemaining(goal.target_date) !== null"
              class="goal-card__date-badge"
              :class="{
                'goal-card__date-badge--overdue': daysRemaining(goal.target_date) < 0,
                'goal-card__date-badge--soon':
                  daysRemaining(goal.target_date) >= 0 && daysRemaining(goal.target_date) <= 30
              }"
            >
              <span v-if="daysRemaining(goal.target_date) < 0">Förfallet</span>
              <span v-else-if="daysRemaining(goal.target_date) === 0">Sista dag idag</span>
              <span v-else>{{ daysRemaining(goal.target_date) }} dagar kvar</span>
            </span>
          </div>
          <button
            class="goal-card__edit-btn"
            @click="openEditGoal(goal)"
            aria-label="Redigera mål"
          >
            <Pencil :size="14" :stroke-width="2" />
          </button>
        </div>

        <!-- Amounts -->
        <div class="goal-card__amounts">
          <span class="goal-card__current">{{ formatAmount(goal.current_amount) }}</span>
          <span class="goal-card__separator">av</span>
          <span class="goal-card__target">{{ formatAmount(goal.target_amount) }}</span>
        </div>

        <!-- Progress bar -->
        <div class="goal-card__progress">
          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              :style="{
                width: Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100) + '%',
                backgroundColor: goal.current_amount >= goal.target_amount
                  ? 'var(--color-success)'
                  : 'var(--color-primary)'
              }"
              role="progressbar"
              :aria-valuenow="Math.round((goal.current_amount / goal.target_amount) * 100)"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <span class="goal-card__percentage">
            {{ Math.round((goal.current_amount / goal.target_amount) * 100) }}%
          </span>
        </div>

        <!-- Completed -->
        <div v-if="goal.current_amount >= goal.target_amount" class="goal-card__completed">
          Målet uppnått!
        </div>
        <div v-else-if="goal.target_date" class="goal-card__target-date">
          Måldatum: {{ formatDateShort(goal.target_date) }}
        </div>

        <!-- Actions -->
        <div class="goal-card__actions">
          <button
            v-if="goal.current_amount < goal.target_amount"
            class="btn btn-primary btn-full"
            @click="openAddFunds(goal)"
          >
            + Lägg till pengar
          </button>
          <button
            class="btn btn-ghost btn-sm"
            @click="handleDelete(goal.id)"
            aria-label="Ta bort mål"
          >
            Ta bort
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <Target class="empty-state-icon" :size="32" :stroke-width="1.5" aria-hidden="true" />
      <p class="empty-state-title">Inga sparmål ännu</p>
      <p class="empty-state-text">
        Sätt upp ett mål och följ dina framsteg — semester, buffert eller något du drömmer om.
      </p>
      <button class="btn btn-primary" @click="openAddGoal">Skapa ditt första mål</button>
    </div>

    <!-- Modals -->
    <SavingsGoalForm
      v-if="showGoalForm"
      :goal="editGoal"
      @save="handleGoalSave"
      @cancel="closeGoalForm"
    />
    <AddFundsModal
      v-if="addFundsGoal"
      :goal="addFundsGoal"
      @save="handleAddFunds"
      @cancel="closeAddFunds"
    />
  </AppLayout>
</template>

<style scoped>
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.goal-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.goal-card__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.goal-card__title {
  font-size: 1.0625rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goal-card__date-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  width: fit-content;
}

.goal-card__date-badge--soon {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}

.goal-card__date-badge--overdue {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.goal-card__edit-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.15s, color 0.15s;
}

.goal-card__edit-btn:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.goal-card__edit-btn svg {
  width: 16px;
  height: 16px;
}

.goal-card__amounts {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.goal-card__current {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-primary);
}

.goal-card__separator {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.goal-card__target {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.goal-card__progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.goal-card__progress .progress-bar-track {
  flex: 1;
  height: 8px;
}

.goal-card__percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  min-width: 36px;
  text-align: right;
}

.goal-card__completed {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-success);
}

.goal-card__target-date {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.goal-card__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}
</style>
