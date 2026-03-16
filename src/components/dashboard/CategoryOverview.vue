<script setup>
import { computed } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  expensesByCategory: {
    type: Array,
    required: true
    // [{ category_id, amount }]
  }
})

const categoriesStore = useCategoriesStore()

const rows = computed(() => {
  const max = props.expensesByCategory[0]?.amount ?? 1
  return props.expensesByCategory.map((item) => {
    const category = categoriesStore.getCategoryById(item.category_id)
    return {
      ...item,
      category,
      percentage: Math.round((item.amount / max) * 100)
    }
  })
})
</script>

<template>
  <div v-if="rows.length > 0" class="category-overview">
    <div
      v-for="row in rows"
      :key="row.category_id"
      class="category-row"
    >
      <div class="category-row__header">
        <div class="category-row__left">
          <span class="category-row__icon" aria-hidden="true">
            {{ row.category?.icon ?? '📦' }}
          </span>
          <span class="category-row__name">{{ row.category?.name ?? row.category_id }}</span>
        </div>
        <span class="category-row__amount">{{ formatCurrency(row.amount) }}</span>
      </div>

      <div class="progress-bar-track">
        <div
          class="progress-bar-fill"
          :style="{
            width: row.percentage + '%',
            backgroundColor: row.category?.color ?? 'var(--color-primary)'
          }"
          role="progressbar"
          :aria-valuenow="row.percentage"
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <span class="empty-state-icon">📊</span>
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

.category-row__amount {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
