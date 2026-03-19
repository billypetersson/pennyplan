<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import MonthSelector from '@/components/shared/MonthSelector.vue'
import BudgetForm from '@/components/budget/BudgetForm.vue'
import { useBudgetStore } from '@/stores/budget'
import { useTransactionsStore } from '@/stores/transactions'
import { useCategoriesStore } from '@/stores/categories'
import { useCurrency } from '@/composables/useCurrency'
import { BarChart3, ChevronRight } from 'lucide-vue-next'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'

const { formatAmount } = useCurrency()
const budgetStore = useBudgetStore()
const transactionsStore = useTransactionsStore()
const categoriesStore = useCategoriesStore()

const { selectedMonth } = storeToRefs(transactionsStore)
const activeCategoryForForm = ref(null)

onMounted(async () => {
  await Promise.all([
    transactionsStore.fetchTransactions(),
    budgetStore.fetchLimits(selectedMonth.value)
  ])
})

watch(selectedMonth, (month) => {
  budgetStore.fetchLimits(month)
})

function onMonthChange(month) {
  transactionsStore.setMonth(month)
}

// Rows: expense categories that have spending or a budget this month
const rows = computed(() => {
  const expCat = categoriesStore.expenseCategories
  return expCat.map(cat => {
    const spent = transactionsStore.expensesByCategory.find(e => e.category_id === cat.id)?.amount ?? 0
    const limit = budgetStore.getLimitForCategory(cat.id)
    const percentage = limit ? Math.round((spent / limit.amount) * 100) : null
    const status = !limit
      ? 'none'
      : spent > limit.amount
        ? 'over'
        : spent / limit.amount >= 0.8
          ? 'warning'
          : 'ok'
    return { category: cat, spent, limit, percentage, status }
  }).filter(r => r.spent > 0 || r.limit)
})

// Categories without a budget limit set
const unbudgetedCategories = computed(() =>
  categoriesStore.expenseCategories.filter(cat => !budgetStore.getLimitForCategory(cat.id))
)

const totalBudgeted = computed(() =>
  budgetStore.limits.reduce((sum, l) => sum + Number(l.amount), 0)
)

const totalSpent = computed(() => transactionsStore.monthlyExpenses)

function openBudgetForm(category) {
  activeCategoryForForm.value = category
}

function closeForm() {
  activeCategoryForForm.value = null
}

async function handleSave(payload) {
  await budgetStore.upsertLimit(payload)
  closeForm()
}

async function handleDelete(limitId) {
  await budgetStore.deleteLimit(limitId)
  closeForm()
}
</script>

<template>
  <AppLayout title="Budget">
    <!-- Month selector -->
    <MonthSelector
      :model-value="selectedMonth"
      @update:model-value="onMonthChange"
    />

    <!-- Summary card (only when budgets exist) -->
    <div v-if="totalBudgeted > 0" class="budget-summary card">
      <div class="budget-summary__row">
        <span class="budget-summary__label">Totalt budgeterat</span>
        <span class="budget-summary__value">{{ formatAmount(totalBudgeted) }}</span>
      </div>
      <div class="budget-summary__row">
        <span class="budget-summary__label">Totalt spenderat</span>
        <span
          class="budget-summary__value"
          :class="totalSpent > totalBudgeted ? 'amount-expense' : ''"
        >{{ formatAmount(totalSpent) }}</span>
      </div>
      <div class="divider" />
      <div class="budget-summary__row">
        <span class="budget-summary__label">Kvar av budget</span>
        <span
          class="budget-summary__value budget-summary__remaining"
          :class="totalBudgeted - totalSpent < 0 ? 'amount-expense' : 'amount-income'"
        >{{ formatAmount(totalBudgeted - totalSpent) }}</span>
      </div>
    </div>

    <!-- Categories with spending or budget -->
    <section v-if="rows.length > 0">
      <h2 class="section-heading">Kategorier</h2>
      <div class="card category-list">
        <div
          v-for="(row, i) in rows"
          :key="row.category.id"
          class="budget-row"
          :class="{ 'budget-row--last': i === rows.length - 1 }"
          @click="openBudgetForm(row.category)"
          role="button"
          tabindex="0"
          @keydown.enter="openBudgetForm(row.category)"
        >
          <div class="budget-row__header">
            <div class="budget-row__left">
              <CategoryIcon :category-id="row.category.id" :size="16" class="budget-row__icon" aria-hidden="true" />
              <span class="budget-row__name">{{ row.category.name }}</span>
            </div>
            <div class="budget-row__right">
              <span v-if="row.limit">
                <span :class="row.status === 'over' ? 'amount-expense' : ''">
                  {{ formatAmount(row.spent) }}
                </span>
                <span class="budget-row__separator">/</span>
                <span class="budget-row__limit">{{ formatAmount(row.limit.amount) }}</span>
              </span>
              <span v-else class="budget-row__no-budget">
                {{ formatAmount(row.spent) }}
              </span>
              <ChevronRight :size="14" :stroke-width="2" class="budget-row__chevron" aria-hidden="true" />
            </div>
          </div>

          <!-- Progress bar (when budget is set) -->
          <div v-if="row.limit">
            <div class="budget-row__meta">
              <span
                class="budget-row__percentage"
                :class="{
                  'budget-row__percentage--warning': row.status === 'warning',
                  'budget-row__percentage--over': row.status === 'over'
                }"
              >{{ row.percentage }}%</span>
              <span v-if="row.status === 'warning'" class="budget-row__badge budget-row__badge--warning">
                Nära gränsen
              </span>
              <span v-else-if="row.status === 'over'" class="budget-row__badge budget-row__badge--over">
                Överskriden
              </span>
            </div>
            <div class="progress-bar-track">
              <div
                class="progress-bar-fill"
                :style="{
                  width: Math.min(row.percentage, 100) + '%',
                  backgroundColor: row.status === 'over'
                    ? 'var(--color-danger)'
                    : row.status === 'warning'
                      ? 'var(--color-warning)'
                      : row.category.color
                }"
                role="progressbar"
                :aria-valuenow="row.percentage"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          <div v-else class="budget-row__add-hint">
            Tryck för att sätta budgetgräns
          </div>
        </div>
      </div>
    </section>

    <!-- Unbudgeted categories (when there are already some budgeted rows) -->
    <section v-if="unbudgetedCategories.length > 0 && rows.length > 0">
      <h2 class="section-heading">Lägg till budgetgränser</h2>
      <div class="card category-list">
        <div
          v-for="(cat, i) in unbudgetedCategories"
          :key="cat.id"
          class="unbudgeted-row"
          :class="{ 'unbudgeted-row--last': i === unbudgetedCategories.length - 1 }"
          @click="openBudgetForm(cat)"
          role="button"
          tabindex="0"
          @keydown.enter="openBudgetForm(cat)"
        >
          <div class="unbudgeted-row__left">
            <CategoryIcon :category-id="cat.id" :size="16" class="unbudgeted-row__icon" aria-hidden="true" />
            <span class="unbudgeted-row__name">{{ cat.name }}</span>
          </div>
          <button class="btn btn-sm btn-ghost" tabindex="-1">+ Sätt budget</button>
        </div>
      </div>
    </section>

    <!-- Empty state: no budgets and no spending -->
    <div v-if="rows.length === 0" class="empty-state">
      <BarChart3 class="empty-state-icon" :size="32" :stroke-width="1.5" aria-hidden="true" />
      <p class="empty-state-title">Inga budgetar ännu</p>
      <p class="empty-state-text">
        Sätt budgetgränser per kategori för att följa dina utgifter i realtid.
      </p>
      <div class="card category-list empty-start-list">
        <div
          v-for="(cat, i) in categoriesStore.expenseCategories"
          :key="cat.id"
          class="unbudgeted-row"
          :class="{ 'unbudgeted-row--last': i === categoriesStore.expenseCategories.length - 1 }"
          @click="openBudgetForm(cat)"
          role="button"
          tabindex="0"
          @keydown.enter="openBudgetForm(cat)"
        >
          <div class="unbudgeted-row__left">
            <CategoryIcon :category-id="cat.id" :size="16" class="unbudgeted-row__icon" aria-hidden="true" />
            <span class="unbudgeted-row__name">{{ cat.name }}</span>
          </div>
          <button class="btn btn-sm btn-ghost" tabindex="-1">+ Sätt budget</button>
        </div>
      </div>
    </div>

    <!-- Budget form modal -->
    <BudgetForm
      v-if="activeCategoryForForm"
      :category="activeCategoryForForm"
      :existing-limit="budgetStore.getLimitForCategory(activeCategoryForForm.id)"
      :month="selectedMonth"
      @save="handleSave"
      @delete="handleDelete"
      @cancel="closeForm"
    />
  </AppLayout>
</template>

<style scoped>
.budget-summary {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.budget-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-summary__label {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.budget-summary__value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
}

.budget-summary__remaining {
  font-size: 1.0625rem;
}

.category-list {
  padding: 0;
  overflow: hidden;
}

.budget-row {
  padding: 0.875rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.12s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.budget-row--last {
  border-bottom: none;
}

.budget-row:hover,
.budget-row:focus-visible {
  background-color: var(--color-bg);
  outline: none;
}

.budget-row:active {
  background-color: var(--color-border);
}

.budget-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.budget-row__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.budget-row__icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.budget-row__name {
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.budget-row__right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.budget-row__separator {
  font-weight: 400;
  color: var(--color-text-muted);
  margin: 0 0.125rem;
}

.budget-row__limit {
  color: var(--color-text-muted);
  font-weight: 500;
}

.budget-row__no-budget {
  color: var(--color-text);
}

.budget-row__chevron {
  color: var(--color-text-muted);
  font-size: 1.25rem;
  margin-left: 0.25rem;
}

.budget-row__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.budget-row__percentage {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.budget-row__percentage--warning {
  color: var(--color-warning);
}

.budget-row__percentage--over {
  color: var(--color-danger);
}

.budget-row__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.budget-row__badge--warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}

.budget-row__badge--over {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.budget-row__add-hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.unbudgeted-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.12s;
}

.unbudgeted-row--last {
  border-bottom: none;
}

.unbudgeted-row:hover {
  background-color: var(--color-bg);
}

.unbudgeted-row__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.unbudgeted-row__icon {
  font-size: 1.125rem;
}

.unbudgeted-row__name {
  font-size: 0.9375rem;
  font-weight: 500;
}

.empty-start-list {
  width: 100%;
  margin-top: 1.5rem;
}
</style>
