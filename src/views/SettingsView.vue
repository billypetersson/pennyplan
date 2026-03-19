<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore, CURRENCIES } from '@/stores/settings'
import { Globe, LogOut, Coins, Sun, Moon, KeyRound, Check, Trash2, RotateCcw } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

// Local draft state — changes are previewed but not saved until button is clicked
const draftCurrency = ref(settingsStore.currency)
const draftTheme = ref(settingsStore.theme)

// Keep draft in sync if store updates externally (e.g. fetchSettings resolves)
watch(() => settingsStore.currency, v => { draftCurrency.value = v })
watch(() => settingsStore.theme,    v => { draftTheme.value = v })

const saving = ref(false)
const saved = ref(false)

function toggleTheme() {
  draftTheme.value = draftTheme.value === 'dark' ? 'light' : 'dark'
  settingsStore.previewTheme(draftTheme.value)
}

async function handleSave() {
  saving.value = true
  try {
    await settingsStore.saveSettings(draftCurrency.value, draftTheme.value)
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  } finally {
    saving.value = false
  }
}

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}

async function handleRestartOnboarding() {
  await settingsStore.resetOnboarding()
  router.push('/onboarding')
}

const confirmingDelete = ref(false)
const deleting = ref(false)
const deleteError = ref('')

async function handleDeleteAccount() {
  deleting.value = true
  deleteError.value = ''
  try {
    await authStore.deleteAccount()
    router.push('/login')
  } catch {
    deleteError.value = 'Något gick fel. Försök igen.'
    deleting.value = false
  }
}
</script>

<template>
  <AppLayout title="Inställningar">

    <!-- Personal settings -->
    <section>
      <h2 class="section-heading">Personliga inställningar</h2>
      <div class="card settings-section">

        <!-- Currency -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--amber">
              <Coins :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Valuta</span>
              <span class="settings-row__value">Välj din valuta</span>
            </div>
          </div>
          <div class="settings-row__right">
            <select v-model="draftCurrency" class="inline-select">
              <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">{{ c.label }}</option>
            </select>
          </div>
        </div>

        <div class="divider" />

        <!-- Theme -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--indigo">
              <component :is="draftTheme === 'dark' ? Moon : Sun" :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Tema</span>
              <span class="settings-row__value">{{ draftTheme === 'dark' ? 'Mörkt läge' : 'Ljust läge' }}</span>
            </div>
          </div>
          <div class="settings-row__right">
            <button
              class="theme-toggle"
              :class="{ 'theme-toggle--on': draftTheme === 'dark' }"
              @click="toggleTheme"
              :aria-label="draftTheme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge'"
            >
              <span class="theme-toggle__knob" />
            </button>
          </div>
        </div>

        <div class="divider" />

        <!-- Language -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--teal">
              <Globe :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Språk</span>
              <span class="settings-row__value">Svenska</span>
            </div>
          </div>
          <div class="settings-row__right">
            <span class="badge badge-neutral">Fast</span>
          </div>
        </div>

        <div class="divider" />

        <!-- Save button -->
        <div class="save-row">
          <button class="btn btn-primary save-btn" @click="handleSave" :disabled="saving">
            <template v-if="saved">
              <Check :size="15" :stroke-width="2.5" /> Sparat
            </template>
            <template v-else>
              {{ saving ? 'Sparar...' : 'Spara inställningar' }}
            </template>
          </button>
        </div>

      </div>
    </section>

    <!-- Account -->
    <section>
      <h2 class="section-heading">Konto</h2>
      <div class="card settings-section">

        <!-- Change password -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--purple">
              <KeyRound :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Lösenord</span>
              <span class="settings-row__value">Ändra ditt lösenord</span>
            </div>
          </div>
          <div class="settings-row__right">
            <RouterLink to="/installningar/byt-losenord" class="btn btn-ghost btn-sm">Byt lösenord</RouterLink>
          </div>
        </div>

        <div class="divider" />

        <!-- Restart onboarding -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--teal">
              <RotateCcw :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Introduktion</span>
              <span class="settings-row__value">Kör igenom introduktionen igen</span>
            </div>
          </div>
          <div class="settings-row__right">
            <button class="btn btn-ghost btn-sm" @click="handleRestartOnboarding">Starta om</button>
          </div>
        </div>

        <div class="divider" />

        <!-- Sign out -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--danger">
              <LogOut :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Logga ut</span>
              <span class="settings-row__value">Avslutar din session</span>
            </div>
          </div>
          <div class="settings-row__right">
            <button class="btn btn-ghost btn-sm" @click="handleSignOut">Logga ut</button>
          </div>
        </div>

        <div class="divider" />

        <!-- Delete account -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--danger">
              <Trash2 :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Radera konto</span>
              <span class="settings-row__value">Tar bort alla dina data permanent</span>
            </div>
          </div>
          <div class="settings-row__right">
            <button class="btn btn-sm btn-delete btn-delete--hover-text" @click="confirmingDelete = true">
              <span class="btn-delete__default">Radera</span>
              <span class="btn-delete__hover">SÄKERT?!</span>
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="confirmingDelete" class="delete-overlay" @click.self="confirmingDelete = false">
          <div class="delete-modal">
            <div class="delete-modal__icon">
              <Trash2 :size="28" :stroke-width="1.75" />
            </div>
            <h2 class="delete-modal__title">Radera konto?</h2>
            <p class="delete-modal__text">
              Alla dina transaktioner, budgetar och sparmål raderas permanent. Det går inte att ångra.
            </p>
            <p v-if="deleteError" class="delete-modal__error">{{ deleteError }}</p>
            <div class="delete-modal__actions">
              <button class="btn btn-ghost" @click="confirmingDelete = false" :disabled="deleting">Avbryt</button>
              <button class="btn btn-danger" @click="handleDeleteAccount" :disabled="deleting">
                {{ deleting ? 'Raderar...' : 'Ja, radera mitt konto' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </AppLayout>
</template>

<style scoped>
.settings-section {
  padding: 0;
  overflow: hidden;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.625rem 1.125rem;
  min-height: 52px;
}

.settings-row:first-child {
  padding-top: 1.25rem;
}

.settings-row:last-child,
.settings-section > .settings-row:last-of-type {
  padding-bottom: 1.25rem;
}

.settings-row__left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
}

.settings-row__right {
  min-width: 140px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
}

/* Icon container */
.settings-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.settings-icon--amber  { background-color: #FEF3C7; color: #D97706; }
.settings-icon--indigo { background-color: #EEF2FF; color: #6366F1; }
.settings-icon--teal   { background-color: rgba(79,155,143,0.12); color: var(--color-primary); }
.settings-icon--purple { background-color: #F5F3FF; color: #7C3AED; }
.settings-icon--danger { background-color: var(--color-danger-light); color: var(--color-danger); }

[data-theme="dark"] .settings-icon--amber  { background-color: rgba(217,119,6,0.18);  color: #FCD34D; }
[data-theme="dark"] .settings-icon--indigo { background-color: rgba(99,102,241,0.18); color: #A5B4FC; }
[data-theme="dark"] .settings-icon--purple { background-color: rgba(124,58,237,0.18); color: #C4B5FD; }

.settings-row__label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.3;
}

.settings-row__value {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

/* Inline select — matches btn-ghost btn-sm visually */
.inline-select {
  width: auto;
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  flex-shrink: 0;
}

.inline-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79,155,143,0.15);
}

/* Delete button */
.btn-delete {
  background-color: transparent;
  color: var(--color-danger);
  border: 1.5px solid var(--color-danger);
  white-space: nowrap;
}

.btn-delete:hover {
  background-color: var(--color-danger);
  color: #fff;
}

.btn-delete--hover-text {
  position: relative;
  overflow: hidden;
}

.btn-delete__default,
.btn-delete__hover {
  display: block;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn-delete__hover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(6px);
  font-weight: 700;
  letter-spacing: 0.03em;
}

.btn-delete--hover-text:hover .btn-delete__default {
  opacity: 0;
  transform: translateY(-6px);
}

.btn-delete--hover-text:hover .btn-delete__hover {
  opacity: 1;
  transform: translateY(0);
}

/* Delete confirmation modal */
.delete-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.delete-modal {
  background-color: var(--color-card);
  border-radius: var(--radius-xl);
  padding: 2rem 1.5rem 1.5rem;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-lg);
}

.delete-modal__icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.delete-modal__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.delete-modal__text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.delete-modal__error {
  font-size: 0.875rem;
  color: var(--color-danger);
  font-weight: 500;
}

.delete-modal__actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
}

.delete-modal__actions .btn {
  flex: 1;
  padding: 0.75rem;
}

/* Save row */
.save-row {
  padding: 0.875rem 1.125rem 1.25rem;
}

.save-btn {
  width: 100%;
  gap: 0.375rem;
}

/* Theme toggle */
.theme-toggle {
  width: 44px;
  height: 26px;
  border-radius: 999px;
  background-color: var(--color-border);
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;
  border: none;
}

.theme-toggle--on {
  background-color: var(--color-primary);
}

.theme-toggle__knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  transition: transform 0.2s;
}

.theme-toggle--on .theme-toggle__knob {
  transform: translateX(18px);
}
</style>
