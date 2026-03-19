<script setup>
import { computed, ref } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { formatDateShort } from '@/utils/format'
import { useCurrency } from '@/composables/useCurrency'
import { ChevronUp, ChevronDown, BarChart3 } from 'lucide-vue-next'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'

const { formatAmount } = useCurrency()

const props = defineProps({
  expensesByCategory: {
    type: Array,
    required: true
  },
  transactions: {
    type: Array,
    default: () => []
  },
  fixedCosts: {
    type: Array,
    default: () => []
  },
  fixedCostsTotal: {
    type: Number,
    default: 0
  }
})

const categoriesStore = useCategoriesStore()
const expanded = ref(new Set())

const CYCLE_LABELS = { monthly: 'mån', quarterly: 'kvartal', yearly: 'år' }

const rows = computed(() => {
  const all = [...props.expensesByCategory]
  if (props.fixedCostsTotal > 0) {
    all.push({ category_id: '__fixed__', amount: props.fixedCostsTotal })
  }
  const max = all.reduce((m, r) => Math.max(m, r.amount), 1)
  return all.map((item) => {
    if (item.category_id === '__fixed__') {
      return { ...item, isFixed: true, percentage: Math.round((item.amount / max) * 100) }
    }
    const category = categoriesStore.getCategoryById(item.category_id)
    const items = props.transactions.filter(t => t.type === 'expense' && t.category_id === item.category_id)
    return { ...item, category, isFixed: false, items, percentage: Math.round((item.amount / max) * 100) }
  })
})

function toggle(id) {
  const s = new Set(expanded.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expanded.value = s
}
</script>

<template>
  <div v-if="rows.length > 0" class="category-overview">
    <div
      v-for="row in rows"
      :key="row.category_id"
      class="category-row"
      @click="toggle(row.category_id)"
    >
      <div class="category-row__header">
        <div class="category-row__left">
          <span class="category-row__icon" aria-hidden="true">
            <CategoryIcon :category-id="row.category_id" :size="15" />
          </span>
          <span class="category-row__name">
            {{ row.isFixed ? 'Fasta kostnader' : (row.category?.name ?? row.category_id) }}
          </span>
          <span class="expand-icon" aria-hidden="true">
            <ChevronUp v-if="expanded.has(row.category_id)" :size="13" :stroke-width="2.5" />
            <ChevronDown v-else :size="13" :stroke-width="2.5" />
          </span>
        </div>
        <span class="category-row__amount">{{ formatAmount(row.amount) }}</span>
      </div>

      <div class="progress-bar-track">
        <div
          class="progress-bar-fill"
          :style="{
            width: row.percentage + '%',
            backgroundColor: row.isFixed ? 'var(--color-warning)' : (row.category?.color ?? 'var(--color-primary)')
          }"
          role="progressbar"
          :aria-valuenow="row.percentage"
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      <!-- Expanded list -->
      <div v-if="expanded.has(row.category_id)" class="fixed-list">
        <!-- Fixed costs -->
        <template v-if="row.isFixed">
          <div v-for="cost in fixedCosts" :key="cost.id" class="fixed-list__item">
            <span class="fixed-list__name">{{ cost.name }}</span>
            <span class="fixed-list__amount">
              {{ formatAmount(cost.amount) }}<span class="fixed-list__cycle"> / {{ CYCLE_LABELS[cost.billing_cycle] }}</span>
            </span>
          </div>
        </template>
        <!-- Regular transactions -->
        <template v-else>
          <div v-for="t in row.items" :key="t.id" class="fixed-list__item">
            <span class="fixed-list__name">{{ t.note || formatDateShort(t.date) }}</span>
            <span class="fixed-list__amount">{{ formatAmount(t.amount) }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <BarChart3 class="empty-state-icon" :size="32" :stroke-width="1.5" aria-hidden="true" />
    <p class="empty-state-title">Inga utgifter ännu</p>
    <p class="empty-state-text">Lägg till transaktioner för att se en kategoriöversikt.</p>
  </div>
</template>

<style scoped>
.category-overview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-row {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  cursor: pointer;
}

.category-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.category-row__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.category-row__icon {
  font-size: 1.125rem;
  line-height: 1;
  flex-shrink: 0;
}

.category-row__name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-icon {
  font-size: 0.625rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.category-row__amount {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  flex-shrink: 0;
}

.fixed-list {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem;
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
}

.fixed-list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.fixed-list__name {
  font-size: 0.875rem;
  color: var(--color-text);
}

.fixed-list__amount {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.fixed-list__cycle {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-text-muted);
}
</style>
