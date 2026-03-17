<script setup>
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import FixedCostForm from '@/components/fixedcosts/FixedCostForm.vue'
import { useFixedCostsStore } from '@/stores/fixedCosts'
import { formatCurrency } from '@/utils/format'

const store = useFixedCostsStore()

const showForm = ref(false)
const editCost = ref(null)

onMounted(() => store.fetchCosts())

const costs = computed(() => store.costs)

const CATEGORY_LABELS = {
  subscription: 'Prenumeration',
  insurance: 'Försäkring',
  rent: 'Hyra/Boende',
  loan: 'Lån',
  utility: 'El/Vatten/Värme',
  other: 'Övrigt',
}

const CYCLE_LABELS = {
  monthly: 'mån',
  quarterly: 'kvartal',
  yearly: 'år',
}

function openAdd() {
  editCost.value = null
  showForm.value = true
}

function openEdit(cost) {
  editCost.value = cost
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editCost.value = null
}

async function handleSave(payload) {
  if (editCost.value) {
    await store.updateCost(editCost.value.id, payload)
  } else {
    await store.addCost(payload)
  }
  closeForm()
}

async function handleDelete(id) {
  await store.deleteCost(id)
}
</script>

<template>
  <AppLayout title="Fasta kostnader">
    <button class="btn btn-primary btn-full" @click="openAdd">+ Lägg till kostnad</button>

    <!-- Summary -->
    <div v-if="costs.length > 0" class="summary-row">
      <div class="summary-card card">
        <span class="summary-label">Per månad</span>
        <span class="summary-amount">{{ formatCurrency(store.totalMonthly) }}</span>
      </div>
      <div class="summary-card card">
        <span class="summary-label">Per år</span>
        <span class="summary-amount">{{ formatCurrency(store.totalYearly) }}</span>
      </div>
    </div>

    <!-- Cost list -->
    <div v-if="costs.length > 0" class="costs-list">
      <div v-for="cost in costs" :key="cost.id" class="cost-item card">
        <div class="cost-item__info">
          <span class="cost-item__name">{{ cost.name }}</span>
          <div class="cost-item__meta">
            <span class="badge">{{ CATEGORY_LABELS[cost.category] ?? cost.category }}</span>
            <span v-if="cost.due_day" class="cost-item__due">dag {{ cost.due_day }}</span>
          </div>
        </div>
        <div class="cost-item__right">
          <span class="cost-item__amount">{{ formatCurrency(cost.amount) }}<span class="cost-item__cycle"> / {{ CYCLE_LABELS[cost.billing_cycle] }}</span></span>
          <div class="cost-item__actions">
            <button class="action-btn" @click="openEdit(cost)" aria-label="Redigera">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="action-btn action-btn--danger" @click="handleDelete(cost.id)" aria-label="Ta bort">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <span class="empty-state-icon">📋</span>
      <p class="empty-state-title">Inga fasta kostnader ännu</p>
      <p class="empty-state-text">
        Lägg till återkommande kostnader som försäkringar, prenumerationer och hyra för att hålla koll på din ekonomi.
      </p>
      <button class="btn btn-primary" @click="openAdd">Lägg till kostnad</button>
    </div>

    <!-- Form modal -->
    <FixedCostForm
      v-if="showForm"
      :cost="editCost"
      @save="handleSave"
      @cancel="closeForm"
    />
  </AppLayout>
</template>

<style scoped>
.summary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
}

.summary-label {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.summary-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.costs-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cost-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
}

.cost-item__info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.cost-item__name {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cost-item__meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.cost-item__due {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.cost-item__right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.cost-item__amount {
  font-size: 0.9375rem;
  font-weight: 700;
  white-space: nowrap;
}

.cost-item__cycle {
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--color-text-muted);
}

.cost-item__actions {
  display: flex;
  gap: 0.125rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.action-btn svg {
  width: 15px;
  height: 15px;
}

.action-btn:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.action-btn--danger:hover {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}
</style>
