<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  income: {
    type: Number,
    required: true
  },
  expenses: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
})

const balanceIsNegative = computed(() => props.balance < 0)
</script>

<template>
  <div class="summary-cards">
    <!-- Income -->
    <div class="summary-card summary-card--income">
      <span class="summary-card__label">Inkomster</span>
      <span class="summary-card__amount">{{ formatCurrency(income) }}</span>
      <TrendingUp class="summary-card__icon" :size="18" :stroke-width="2" aria-hidden="true" />
    </div>

    <!-- Expenses -->
    <div class="summary-card summary-card--expense">
      <span class="summary-card__label">Utgifter</span>
      <span class="summary-card__amount">{{ formatCurrency(expenses) }}</span>
      <TrendingDown class="summary-card__icon" :size="18" :stroke-width="2" aria-hidden="true" />
    </div>

    <!-- Balance — full width -->
    <div
      class="summary-card summary-card--balance"
      :class="{ 'summary-card--negative': balanceIsNegative }"
    >
      <span class="summary-card__label">Kvar att spendera</span>
      <span class="summary-card__amount">{{ formatCurrency(balance) }}</span>
      <AlertTriangle v-if="balanceIsNegative" class="summary-card__icon" :size="18" :stroke-width="2" aria-hidden="true" />
      <CheckCircle2 v-else class="summary-card__icon" :size="18" :stroke-width="2" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.summary-card {
  background-color: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 1rem 1.125rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  overflow: hidden;
}

.summary-card--balance {
  grid-column: 1 / -1;
}

.summary-card__label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.summary-card__amount {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.summary-card__icon {
  position: absolute;
  top: 0.875rem;
  right: 1rem;
  font-size: 1rem;
  opacity: 0.5;
}

/* Income card */
.summary-card--income .summary-card__amount {
  color: var(--color-success);
}

.summary-card--income {
  border-left: 3px solid var(--color-success);
}

/* Expense card */
.summary-card--expense .summary-card__amount {
  color: var(--color-danger);
}

.summary-card--expense {
  border-left: 3px solid var(--color-danger);
}

/* Balance card */
.summary-card--balance .summary-card__amount {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.summary-card--balance {
  border-left: 3px solid var(--color-primary);
}

.summary-card--negative .summary-card__amount {
  color: var(--color-danger);
}

.summary-card--negative {
  border-left: 3px solid var(--color-danger);
  background-color: var(--color-danger-light);
}
</style>
