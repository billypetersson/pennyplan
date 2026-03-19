<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore, CURRENCIES } from '@/stores/settings'
import { Globe, LogOut, Coins, Sun, Moon, KeyRound } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}

async function handleCurrencyChange(e) {
  await settingsStore.setCurrency(e.target.value)
}

async function handleThemeToggle() {
  const next = settingsStore.theme === 'dark' ? 'light' : 'dark'
  await settingsStore.setTheme(next)
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
          <select :value="settingsStore.currency" @change="handleCurrencyChange" class="inline-select">
            <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">{{ c.label }}</option>
          </select>
        </div>

        <div class="divider" />

        <!-- Theme -->
        <div class="settings-row">
          <div class="settings-row__left">
            <span class="settings-icon settings-icon--indigo">
              <component :is="settingsStore.theme === 'dark' ? Moon : Sun" :size="17" :stroke-width="2" aria-hidden="true" />
            </span>
            <div>
              <span class="settings-row__label">Tema</span>
              <span class="settings-row__value">{{ settingsStore.theme === 'dark' ? 'Mörkt läge' : 'Ljust läge' }}</span>
            </div>
          </div>
          <button
            class="theme-toggle"
            :class="{ 'theme-toggle--on': settingsStore.theme === 'dark' }"
            @click="handleThemeToggle"
            :aria-label="settingsStore.theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge'"
          >
            <span class="theme-toggle__knob" />
          </button>
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
          <span class="badge badge-neutral">Fast</span>
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
          <RouterLink to="/installningar/byt-losenord" class="btn btn-ghost btn-sm">Byt lösenord</RouterLink>
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
          <button class="btn btn-ghost btn-sm" @click="handleSignOut">Logga ut</button>
        </div>

      </div>
    </section>

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
  padding: 0.875rem 1.125rem;
  min-height: 60px;
}

.settings-row__left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
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
