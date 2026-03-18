<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { Coins, Globe, Database, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const appVersion = '0.2.0'
const currentYear = new Date().getFullYear()

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}
</script>

<template>
  <AppLayout title="Inställningar">
    <!-- Currency section -->
    <section>
      <h2 class="section-heading">Valuta</h2>
      <div class="card settings-section">
        <div class="settings-row">
          <div class="settings-row__left">
            <Coins class="settings-row__icon" :size="20" :stroke-width="1.75" aria-hidden="true" />
            <div>
              <span class="settings-row__label">Valuta</span>
              <span class="settings-row__value">Svensk krona (SEK)</span>
            </div>
          </div>
          <span class="badge badge-neutral">Fast</span>
        </div>
        <div class="divider" />
        <div class="settings-row">
          <div class="settings-row__left">
            <Globe class="settings-row__icon" :size="20" :stroke-width="1.75" aria-hidden="true" />
            <div>
              <span class="settings-row__label">Språk</span>
              <span class="settings-row__value">Svenska</span>
            </div>
          </div>
          <span class="badge badge-neutral">Fast</span>
        </div>
      </div>
    </section>

    <!-- Data section -->
    <section>
      <h2 class="section-heading">Data</h2>
      <div class="card settings-section">
        <div class="settings-row">
          <div class="settings-row__left">
            <Database class="settings-row__icon" :size="20" :stroke-width="1.75" aria-hidden="true" />
            <div>
              <span class="settings-row__label">Lagring</span>
              <span class="settings-row__value">Supabase (molnet)</span>
            </div>
          </div>
        </div>
        <div class="divider" />
        <p class="settings-note">
          Dina data sparas säkert i molnet via Supabase och är tillgängliga från alla dina enheter.
        </p>
      </div>
    </section>

    <!-- Sign out section -->
    <section>
      <h2 class="section-heading">Konto</h2>
      <div class="card settings-section">
        <div class="settings-row">
          <div class="settings-row__left">
            <LogOut class="settings-row__icon" :size="20" :stroke-width="1.75" aria-hidden="true" />
            <div>
              <span class="settings-row__label">Logga ut</span>
              <span class="settings-row__value">Avslutar din session</span>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" @click="handleSignOut">Logga ut</button>
        </div>
      </div>
    </section>

    <!-- About section -->
    <section>
      <h2 class="section-heading">Om appen</h2>
      <div class="card settings-section">
        <div class="about-header">
          <div class="about-logo" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="10" fill="#4F9B8F"/>
              <text x="20" y="27" font-size="22" text-anchor="middle" fill="white"
                font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                font-weight="700">P</text>
            </svg>
          </div>
          <div>
            <h3 class="about-name">PennyPlan</h3>
            <p class="about-tagline">Enkel och smart budgetering</p>
          </div>
        </div>
        <div class="divider" />
        <div class="settings-row">
          <span class="settings-row__label">Version</span>
          <span class="settings-row__meta">{{ appVersion }} (fas 2)</span>
        </div>
        <div class="divider" />
        <div class="settings-row">
          <span class="settings-row__label">Plattform</span>
          <span class="settings-row__meta">Vue 3 + Vite + Pinia</span>
        </div>
        <div class="divider" />
        <p class="settings-copyright">
          &copy; {{ currentYear }} PennyPlan. Alla rättigheter förbehållna.
        </p>
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
  gap: 0.75rem;
  padding: 0.875rem 1.125rem;
}

.settings-row__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-row__icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.settings-row__label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
}

.settings-row__value {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 1px;
}

.settings-row__meta {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.settings-note {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.55;
  padding: 0 1.125rem 1rem;
}

/* About */
.about-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.125rem;
}

.about-logo svg {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.about-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.about-tagline {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.settings-copyright {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 0.75rem 1.125rem 1rem;
}
</style>
