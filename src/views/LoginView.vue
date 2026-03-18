<template>
  <div class="auth-page">
    <!-- Email confirmation pending state -->
    <div v-if="registeredEmail" class="auth-card confirm-card">
      <MailCheck class="confirm-icon" :size="48" :stroke-width="1.5" aria-hidden="true" />
      <h2 class="confirm-title">Bekräfta din e-post</h2>
      <p class="confirm-text">
        Vi har skickat ett bekräftelsemail till <strong>{{ registeredEmail }}</strong>.
        Klicka på länken i mailet för att aktivera ditt konto.
      </p>
      <p class="confirm-hint">Inget mail? Kontrollera skräpposten.</p>
      <button class="btn btn-ghost btn-sm" @click="registeredEmail = ''; mode = 'login'">
        Tillbaka till inloggning
      </button>
    </div>

    <!-- Reset email sent state -->
    <div v-else-if="resetSent" class="auth-card confirm-card">
      <MailCheck class="confirm-icon" :size="48" :stroke-width="1.5" aria-hidden="true" />
      <h2 class="confirm-title">Kolla din e-post</h2>
      <p class="confirm-text">
        Vi har skickat en återställningslänk till <strong>{{ email }}</strong>.
        Klicka på länken för att välja ett nytt lösenord.
      </p>
      <p class="confirm-hint">Inget mail? Kontrollera skräpposten.</p>
      <button class="btn btn-ghost btn-sm" @click="resetSent = false; mode = 'login'">
        Tillbaka till inloggning
      </button>
    </div>

    <div v-else class="auth-card">
      <div class="auth-logo">
        <AppLogo size="lg" />
        <p>Din enkla budgetapp</p>
      </div>

      <!-- Tabs — hidden in forgot mode -->
      <div v-if="mode !== 'forgot'" class="auth-tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'; error = ''">Logga in</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'; error = ''">Skapa konto</button>
      </div>

      <!-- Forgot password heading -->
      <div v-if="mode === 'forgot'" class="forgot-header">
        <h2 class="forgot-title">Glömt lösenord?</h2>
        <p class="forgot-sub">Ange din e-postadress så skickar vi en återställningslänk.</p>
      </div>

      <form @submit.prevent="submit" novalidate>
        <div class="form-group">
          <label>E-postadress</label>
          <input v-model="email" type="email" placeholder="din@email.se" />
        </div>
        <div v-if="mode !== 'forgot'" class="form-group">
          <label>Lösenord</label>
          <input v-model="password" type="password" placeholder="Minst 8 tecken" />
          <button
            v-if="mode === 'login'"
            type="button"
            class="forgot-link"
            @click="mode = 'forgot'; error = ''; noAccount = false"
          >Glömt lösenord?</button>
        </div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <div v-if="noAccount" class="no-account-callout">
          <div class="no-account-callout__top">
            <UserX :size="18" :stroke-width="1.75" class="no-account-callout__icon" aria-hidden="true" />
            <span class="no-account-callout__title">Fel e-postadress eller lösenord</span>
          </div>
          <p class="no-account-callout__text">Kontrollera dina uppgifter och försök igen. Har du inget konto än?</p>
          <button type="button" class="no-account-callout__btn" @click="mode = 'register'; noAccount = false">
            <UserPlus :size="14" :stroke-width="2" aria-hidden="true" />
            Skapa konto
          </button>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Laddar...' : mode === 'login' ? 'Logga in' : mode === 'register' ? 'Skapa konto' : 'Skicka återställningslänk' }}
        </button>

        <button
          v-if="mode === 'forgot'"
          type="button"
          class="back-link"
          @click="mode = 'login'; error = ''"
        >← Tillbaka till inloggning</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MailCheck, UserX, UserPlus } from 'lucide-vue-next'
import AppLogo from '@/components/ui/AppLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref('login')
const email = ref('')
const password = ref('')
const error = ref('')
const noAccount = ref(false)
const loading = ref(false)
const registeredEmail = ref('')
const resetSent = ref(false)

async function submit() {
  error.value = ''
  noAccount.value = false

  if (!email.value) return (error.value = 'Ange din e-postadress.')

  if (mode.value === 'forgot') {
    loading.value = true
    try {
      await authStore.sendPasswordReset(email.value)
      resetSent.value = true
    } catch {
      error.value = 'Något gick fel, försök igen.'
    } finally {
      loading.value = false
    }
    return
  }

  if (!password.value) return (error.value = 'Ange ditt lösenord.')
  if (mode.value === 'register' && password.value.length < 8)
    return (error.value = 'Lösenordet måste vara minst 8 tecken.')

  loading.value = true
  try {
    if (mode.value === 'login') {
      await authStore.signIn(email.value, password.value)
      router.push('/')
    } else {
      const needsConfirmation = await authStore.signUp(email.value, password.value)
      if (needsConfirmation) {
        registeredEmail.value = email.value
      } else {
        router.push('/')
      }
    }
  } catch (e) {
    const msg = e.message || ''
    if (mode.value === 'login' && (msg.toLowerCase().includes('invalid login credentials') || msg.toLowerCase().includes('invalid credentials'))) {
      noAccount.value = true
    } else {
      error.value = msg || 'Något gick fel, försök igen.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 1rem;
}

.auth-card {
  background: var(--color-card);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.auth-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 2rem;
}

.auth-logo p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.auth-tabs {
  display: flex;
  background: var(--color-bg);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 1.5rem;
}

.auth-tabs button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  transition: all 0.2s;
}

.auth-tabs button.active {
  background: var(--color-card);
  color: var(--color-text);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-text);
  line-height: 1;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
}

.auth-error {
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.no-account-callout {
  background: var(--color-danger-light);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.no-account-callout__top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.no-account-callout__icon {
  color: var(--color-danger);
  flex-shrink: 0;
}

.no-account-callout__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-danger);
}

.no-account-callout__text {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.no-account-callout__btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.25rem;
  padding: 0.4rem 0.875rem;
  border-radius: 999px;
  border: none;
  background: var(--color-danger);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.no-account-callout__btn:hover {
  opacity: 0.88;
}

.btn-full {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
}


.forgot-link {
  display: block;
  margin-top: 0.4rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  cursor: pointer;
  font-weight: 500;
  text-align: right;
}

.forgot-link:hover {
  color: var(--color-primary);
}

.forgot-header {
  margin-bottom: 1.5rem;
}

.forgot-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.375rem;
}

.forgot-sub {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.back-link {
  display: block;
  width: 100%;
  margin-top: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  cursor: pointer;
  text-align: center;
}

.back-link:hover {
  color: var(--color-text);
}

.confirm-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 2.5rem 2rem;
}

.confirm-icon {
  color: var(--color-primary);
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.confirm-text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 300px;
}

.confirm-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
