<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, ChevronLeft, Sun, Moon, Check, Coins, Wallet, PiggyBank, Target } from 'lucide-vue-next'
import { useSettingsStore, CURRENCIES } from '@/stores/settings'
import { useTransactionsStore } from '@/stores/transactions'
import { useBudgetStore } from '@/stores/budget'
import { useSavingsStore } from '@/stores/savings'
import { todayISO } from '@/utils/format'

const router = useRouter()
const settingsStore = useSettingsStore()
const transactionsStore = useTransactionsStore()
const budgetStore = useBudgetStore()
const savingsStore = useSavingsStore()

const currencySymbol = computed(() => CURRENCIES.find(c => c.code === draftCurrency.value)?.symbol ?? 'kr')

const TOTAL_STEPS = 6
const step = ref(1)
const direction = ref('forward')
const saving = ref(false)

// Step 2
const draftCurrency = ref(settingsStore.currency)
const draftTheme = ref(settingsStore.theme)

function previewTheme(val) {
  draftTheme.value = val
  settingsStore.previewTheme(val)
}

// Step 3
const salaryAmount = ref('')

// Step 4
const BUDGET_CATEGORIES = [
  { id: 'expense-mat',       label: 'Mat & Dryck',  color: '#F59E0B' },
  { id: 'expense-transport', label: 'Transport',     color: '#3B82F6' },
  { id: 'expense-noje',      label: 'Nöje',          color: '#EC4899' },
  { id: 'expense-boende',    label: 'Boende',        color: '#8B5CF6' },
]
const budgetAmounts = ref({ 'expense-mat': '', 'expense-transport': '', 'expense-noje': '', 'expense-boende': '' })

// Step 5
const goalTitle = ref('')
const goalAmount = ref('')

// Summary for step 6
const summary = ref({ currency: '', salary: null, budgets: [], goal: null })

function navigate(n) {
  direction.value = n > 0 ? 'forward' : 'back'
  step.value += n
}

async function handleStep2() {
  saving.value = true
  await settingsStore.saveSettings(draftCurrency.value, draftTheme.value)
  saving.value = false
  navigate(1)
}

function handleStep3() { navigate(1) }
function handleStep4() { navigate(1) }

function handleStep5() {
  summary.value = {
    currency: CURRENCIES.find(c => c.code === draftCurrency.value)?.label ?? draftCurrency.value,
    salary: salaryAmount.value && Number(salaryAmount.value) > 0 ? Number(salaryAmount.value) : null,
    budgets: BUDGET_CATEGORIES.filter(c => budgetAmounts.value[c.id] && Number(budgetAmounts.value[c.id]) > 0),
    goal: goalTitle.value.trim() && goalAmount.value ? goalTitle.value.trim() : null,
  }
  navigate(1)
}

async function handleComplete() {
  saving.value = true

  // Save settings
  await settingsStore.saveSettings(draftCurrency.value, draftTheme.value)

  // Save salary — delete existing this-month salary first to avoid duplicates
  if (salaryAmount.value && Number(salaryAmount.value) > 0) {
    const month = new Date().toISOString().slice(0, 7)
    await transactionsStore.fetchTransactions()
    const existing = transactionsStore.transactions.find(
      t => t.type === 'income' && t.category_id === 'income-lon' && t.date.startsWith(month)
    )
    if (existing) await transactionsStore.deleteTransaction(existing.id)
    await transactionsStore.addTransaction({
      type: 'income',
      amount: Number(salaryAmount.value),
      category_id: 'income-lon',
      date: todayISO(),
      note: 'Lön',
    })
  }

  // Save budget limits
  const month = new Date().toISOString().slice(0, 7)
  for (const [category_id, amount] of Object.entries(budgetAmounts.value)) {
    if (amount && Number(amount) > 0) {
      await budgetStore.upsertLimit({ category_id, month, amount: Number(amount) })
    }
  }

  // Save savings goal
  if (goalTitle.value.trim() && goalAmount.value && Number(goalAmount.value) > 0) {
    await savingsStore.addGoal({ title: goalTitle.value.trim(), target_amount: Number(goalAmount.value) })
  }

  await settingsStore.completeOnboarding()
  router.push('/')
}
</script>

<template>
  <div class="onboarding">
    <div class="onboarding__card">

      <!-- Progress dots -->
      <div class="progress">
        <span
          v-for="i in TOTAL_STEPS"
          :key="i"
          class="progress__dot"
          :class="{ 'progress__dot--active': i === step, 'progress__dot--done': i < step }"
        />
      </div>

      <!-- Step 1: Welcome -->
      <Transition :name="direction === 'forward' ? 'slide-forward' : 'slide-back'" mode="out-in">
        <div v-if="step === 1" key="1" class="step">
          <div class="step__icon step__icon--primary">
            <Coins :size="32" :stroke-width="1.75" />
          </div>
          <h1 class="step__title">Välkommen till PennyPlan</h1>
          <p class="step__desc">Vi hjälper dig hålla koll på inkomster, utgifter och sparmål. 
          <br/><br/>Låt oss sätta upp din profil på en minut!</p>
          <button class="btn btn-primary step__cta" @click="navigate(1)">
            Kom igång <ChevronRight :size="18" :stroke-width="2.5" />
          </button>
        </div>

        <!-- Step 2: Currency & Theme -->
        <div v-else-if="step === 2" key="2" class="step">
          <div class="step__icon step__icon--amber">
            <Wallet :size="28" :stroke-width="1.75" />
          </div>
          <h2 class="step__title">Grundinställningar</h2>
          <p class="step__desc">Välj valuta och hur appen ska se ut.</p>

          <div class="form-group">
            <label class="form-label">Valuta</label>
            <select v-model="draftCurrency" class="form-select">
              <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">{{ c.label }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Tema</label>
            <div class="theme-row">
              <button
                type="button"
                class="theme-option"
                :class="{ 'theme-option--active': draftTheme === 'light' }"
                @click="previewTheme('light')"
              >
                <Sun :size="18" :stroke-width="2" />
                Ljust
              </button>
              <button
                type="button"
                class="theme-option"
                :class="{ 'theme-option--active': draftTheme === 'dark' }"
                @click="previewTheme('dark')"
              >
                <Moon :size="18" :stroke-width="2" />
                Mörkt
              </button>
            </div>
          </div>

          <div class="step__actions">
            <button class="btn btn-ghost" @click="navigate(-1)"><ChevronLeft :size="16" /> Tillbaka</button>
            <button class="btn btn-primary" @click="handleStep2" :disabled="saving">
              {{ saving ? 'Sparar...' : 'Nästa' }} <ChevronRight :size="16" />
            </button>
          </div>
        </div>

        <!-- Step 3: Salary -->
        <div v-else-if="step === 3" key="3" class="step">
          <div class="step__icon step__icon--green">
            <Coins :size="28" :stroke-width="1.75" />
          </div>
          <h2 class="step__title">Din månadslön</h2>
          <p class="step__desc">Lägg till din lön för den här månaden så att saldot stämmer från start.</p>

          <div class="form-group">
            <label class="form-label">Belopp</label>
            <div class="amount-wrap">
              <input
                v-model="salaryAmount"
                type="number"
                inputmode="decimal"
                min="0"
                placeholder="0"
                class="amount-input"
              />
              <span class="amount-suffix">{{ currencySymbol }}</span>
            </div>
          </div>

          <div class="step__actions">
            <button class="btn btn-ghost" @click="navigate(-1)"><ChevronLeft :size="16" /> Tillbaka</button>
            <div class="step__actions-right">
              <button class="btn btn-ghost" @click="navigate(1)">Hoppa över</button>
              <button class="btn btn-primary" @click="handleStep3" :disabled="saving">
                {{ saving ? 'Sparar...' : 'Nästa' }} <ChevronRight :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Step 4: Budget -->
        <div v-else-if="step === 4" key="4" class="step">
          <div class="step__icon step__icon--purple">
            <PiggyBank :size="28" :stroke-width="1.75" />
          </div>
          <h2 class="step__title">Sätt en budget</h2>
          <p class="step__desc">Ange månatliga budgetramar för de vanligaste kategorierna.</p>

          <div class="budget-list">
            <div v-for="cat in BUDGET_CATEGORIES" :key="cat.id" class="budget-row">
              <div class="budget-row__label">
                <span class="budget-dot" :style="{ background: cat.color }" />
                {{ cat.label }}
              </div>
              <div class="amount-wrap amount-wrap--sm">
                <input
                  v-model="budgetAmounts[cat.id]"
                  type="number"
                  inputmode="decimal"
                  min="0"
                  placeholder="0"
                  class="amount-input"
                />
                <span class="amount-suffix">{{ currencySymbol }}</span>
              </div>
            </div>
          </div>

          <div class="step__actions">
            <button class="btn btn-ghost" @click="navigate(-1)"><ChevronLeft :size="16" /> Tillbaka</button>
            <div class="step__actions-right">
              <button class="btn btn-ghost" @click="navigate(1)">Hoppa över</button>
              <button class="btn btn-primary" @click="handleStep4" :disabled="saving">
                {{ saving ? 'Sparar...' : 'Nästa' }} <ChevronRight :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Step 5: Savings goal -->
        <div v-else-if="step === 5" key="5" class="step">
          <div class="step__icon step__icon--teal">
            <Target :size="28" :stroke-width="1.75" />
          </div>
          <h2 class="step__title">Sparmål</h2>
          <p class="step__desc">Sparar du till något? Skapa ett mål och följ dina framsteg.</p>

          <div class="form-group">
            <label class="form-label">Vad sparar du till?</label>
            <input v-model="goalTitle" type="text" placeholder="T.ex. Semester, Ny bil..." maxlength="60" />
          </div>
          <div class="form-group">
            <label class="form-label">Målbelopp</label>
            <div class="amount-wrap">
              <input
                v-model="goalAmount"
                type="number"
                inputmode="decimal"
                min="0"
                placeholder="0"
                class="amount-input"
              />
              <span class="amount-suffix">{{ currencySymbol }}</span>
            </div>
          </div>

          <div class="step__actions">
            <button class="btn btn-ghost" @click="navigate(-1)"><ChevronLeft :size="16" /> Tillbaka</button>
            <div class="step__actions-right">
              <button class="btn btn-ghost" @click="handleStep5">Hoppa över</button>
              <button class="btn btn-primary" @click="handleStep5" :disabled="saving">
                {{ saving ? 'Sparar...' : 'Nästa' }} <ChevronRight :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Step 6: Done -->
        <div v-else-if="step === 6" key="6" class="step step--done">
          <div class="done-check">
            <Check :size="32" :stroke-width="2.5" />
          </div>
          <h2 class="step__title">Allt klart!</h2>
          <p class="step__desc">Här är vad vi satte upp åt dig:</p>

          <ul class="summary-list">
            <li class="summary-item">
              <span class="summary-item__dot" style="background: #F59E0B" />
              Valuta: {{ summary.currency }}
            </li>
            <li v-if="summary.salary" class="summary-item">
              <span class="summary-item__dot" style="background: #10B981" />
              Lön: {{ summary.salary.toLocaleString('sv-SE') }} {{ currencySymbol }}
            </li>
            <li v-for="cat in summary.budgets" :key="cat.id" class="summary-item">
              <span class="summary-item__dot" :style="{ background: cat.color }" />
              Budget för {{ cat.label }}: {{ Number(budgetAmounts[cat.id]).toLocaleString('sv-SE') }} {{ currencySymbol }}
            </li>
            <li v-if="summary.goal" class="summary-item">
              <span class="summary-item__dot" style="background: #4F9B8F" />
              Sparmål: {{ summary.goal }}
            </li>
          </ul>

          <button class="btn btn-primary step__cta" @click="handleComplete" :disabled="saving">
            {{ saving ? 'Laddar...' : 'Gå till översikten' }} <ChevronRight :size="18" :stroke-width="2.5" />
          </button>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
.onboarding {
  min-height: 100dvh;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.onboarding__card {
  background-color: var(--color-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 420px;
  padding: 2rem 1.75rem 1.75rem;
  overflow: hidden;
}

/* Progress dots */
.progress {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 2rem;
}

.progress__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-border);
  transition: background-color 0.2s, width 0.2s;
}

.progress__dot--active {
  background-color: var(--color-primary);
  width: 24px;
  border-radius: 4px;
}

.progress__dot--done {
  background-color: var(--color-primary);
  opacity: 0.4;
}

/* Step layout */
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.step__icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.step__icon--primary { background-color: rgba(79,155,143,0.12); color: var(--color-primary); }
.step__icon--amber   { background-color: #FEF3C7; color: #D97706; }
.step__icon--green   { background-color: #D1FAE5; color: #059669; }
.step__icon--purple  { background-color: #F5F3FF; color: #7C3AED; }
.step__icon--teal    { background-color: rgba(79,155,143,0.12); color: var(--color-primary); }

[data-theme="dark"] .step__icon--amber  { background-color: rgba(217,119,6,0.18);  color: #FCD34D; }
[data-theme="dark"] .step__icon--green  { background-color: rgba(5,150,105,0.18);  color: #34D399; }
[data-theme="dark"] .step__icon--purple { background-color: rgba(124,58,237,0.18); color: #C4B5FD; }

.step__title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.step__desc {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.55;
  max-width: 320px;
}

.step__cta {
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  gap: 0.375rem;
}

.step__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
  gap: 0.5rem;
}

.step__actions-right {
  display: flex;
  gap: 0.5rem;
}

/* Form elements */
.form-group {
  width: 100%;
  text-align: left;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 0.375rem;
}

.form-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background-color: var(--color-card);
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79,155,143,0.15);
}

/* Theme selector */
.theme-row {
  display: flex;
  gap: 0.5rem;
}

.theme-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background-color: transparent;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background-color 0.15s;
}

.theme-option--active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: rgba(79,155,143,0.08);
}

/* Amount input */
.amount-wrap {
  position: relative;
}

.amount-wrap--sm {
  width: 120px;
}

.amount-input {
  font-size: 1rem;
  font-weight: 500;
  padding-right: 2.5rem;
  width: 100%;
}

.amount-suffix {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

/* Budget list */
.budget-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.budget-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.budget-row__label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
}

.budget-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Done screen */
.done-check {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: rgba(79,155,143,0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  color: var(--color-text);
  background-color: var(--color-bg);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
}

.summary-item__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Transitions */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.slide-forward-enter-from { opacity: 0; transform: translateX(40px); }
.slide-forward-leave-to   { opacity: 0; transform: translateX(-40px); }
.slide-back-enter-from    { opacity: 0; transform: translateX(-40px); }
.slide-back-leave-to      { opacity: 0; transform: translateX(40px); }
</style>
