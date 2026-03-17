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

const sortKey = ref('name')
const sortDir = ref('asc')

const CYCLE_ORDER = { monthly: 1, quarterly: 2, yearly: 3 }

const costs = computed(() => {
  return [...store.costs].sort((a, b) => {
    let valA, valB
    if (sortKey.value === 'cycle') {
      valA = CYCLE_ORDER[a.billing_cycle] ?? 99
      valB = CYCLE_ORDER[b.billing_cycle] ?? 99
    } else if (sortKey.value === 'due_day') {
      valA = a.due_day ?? 999
      valB = b.due_day ?? 999
    } else if (sortKey.value === 'amount') {
      valA = Number(a.amount)
      valB = Number(b.amount)
    } else {
      valA = (a[sortKey.value] ?? '').toString().toLowerCase()
      valB = (b[sortKey.value] ?? '').toString().toLowerCase()
    }
    if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
})

function sort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

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
    <div v-if="costs.length > 0" class="table-wrap card">
      <table class="costs-table">
        <thead>
          <tr>
            <th class="sortable" @click="sort('name')">
              Namn <span class="sort-icon">{{ sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
            </th>
            <th class="sortable" @click="sort('category')">
              Kategori <span class="sort-icon">{{ sortKey === 'category' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
            </th>
            <th class="col-amount sortable" @click="sort('amount')">
              Belopp <span class="sort-icon">{{ sortKey === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
            </th>
            <th class="sortable" @click="sort('cycle')">
              Intervall <span class="sort-icon">{{ sortKey === 'cycle' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
            </th>
            <th class="col-due sortable" @click="sort('due_day')">
              Förfaller <span class="sort-icon">{{ sortKey === 'due_day' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
            </th>
            <th class="col-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cost in costs" :key="cost.id">
            <td class="col-name">{{ cost.name }}</td>
            <td><span class="badge">{{ CATEGORY_LABELS[cost.category] ?? cost.category }}</span></td>
            <td class="col-amount">{{ formatCurrency(cost.amount) }}</td>
            <td class="col-cycle">{{ CYCLE_LABELS[cost.billing_cycle] }}</td>
            <td class="col-due">{{ cost.due_day ? `dag ${cost.due_day}` : '—' }}</td>
            <td class="col-actions">
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
            </td>
          </tr>
        </tbody>
      </table>
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

.table-wrap {
  padding: 0;
  overflow: hidden;
}

.costs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.costs-table thead tr {
  border-bottom: 1px solid var(--color-border);
}

.costs-table th {
  padding: 0.625rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.costs-table tbody tr {
  border-bottom: 1px solid var(--color-border);
}

.costs-table tbody tr:last-child {
  border-bottom: none;
}

.costs-table tbody tr:nth-child(even) {
  background-color: var(--color-border);
}

.costs-table tbody tr:hover {
  background-color: var(--color-border);
}

.costs-table td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  color: var(--color-text);
}

.sort-icon {
  font-size: 0.7rem;
  opacity: 0.5;
  margin-left: 0.2rem;
}

.col-name {
  font-weight: 600;
}

.col-due {
  color: var(--color-text-muted);
  white-space: nowrap;
}

.col-amount {
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
}

.costs-table th.col-amount {
  text-align: right;
}

.col-cycle {
  color: var(--color-text-muted);
  white-space: nowrap;
}

.col-actions {
  text-align: right;
  white-space: nowrap;
}

.action-btn {
  width: 30px;
  height: 30px;
  display: inline-flex;
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
  background-color: var(--color-border);
  color: var(--color-text);
}

.action-btn--danger:hover {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}
</style>
