<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-vue-next'
import AppLogo from '@/components/ui/AppLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const status = ref('loading') // loading | ready | success | error
const errorMessage = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const formError = ref('')

onMounted(() => {
  // Listen for the PASSWORD_RECOVERY event — Supabase fires this when the
  // recovery token in the URL hash has been exchanged for a session.
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      status.value = 'ready'
    }
  })

  // Fallback: if a session already exists (e.g. page reload), go straight to ready
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && status.value === 'loading') {
      status.value = 'ready'
    }
  })

  // Timeout — if nothing fired after 5s the link is invalid/expired
  setTimeout(() => {
    if (status.value === 'loading') {
      status.value = 'error'
      errorMessage.value = 'Ogiltig eller utgången återställningslänk. Begär en ny.'
      subscription.unsubscribe()
    }
  }, 5000)
})

async function submit() {
  formError.value = ''
  if (!password.value) return (formError.value = 'Ange ett nytt lösenord.')
  if (password.value.length < 8) return (formError.value = 'Lösenordet måste vara minst 8 tecken.')
  if (password.value !== passwordConfirm.value) return (formError.value = 'Lösenorden matchar inte.')

  loading.value = true
  try {
    await authStore.updatePassword(password.value)
    status.value = 'success'
    setTimeout(() => router.push('/'), 2500)
  } catch {
    formError.value = 'Något gick fel, försök igen.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="reset-page">
    <div class="reset-card">
      <div class="reset-logo">
        <AppLogo size="lg" />
      </div>

      <!-- Loading -->
      <div v-if="status === 'loading'" class="status-block">
        <Loader2 class="spin" :size="40" :stroke-width="1.5" aria-hidden="true" />
        <p class="status-text">Verifierar länk...</p>
      </div>

      <!-- Error -->
      <div v-else-if="status === 'error'" class="status-block">
        <XCircle class="icon-error" :size="48" :stroke-width="1.5" aria-hidden="true" />
        <h2 class="status-title">Ogiltig länk</h2>
        <p class="status-text">{{ errorMessage }}</p>
        <a href="/login" class="btn btn-primary">Tillbaka till inloggning</a>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="status-block">
        <CheckCircle2 class="icon-success" :size="48" :stroke-width="1.5" aria-hidden="true" />
        <h2 class="status-title">Lösenord uppdaterat!</h2>
        <p class="status-text">Du loggas in automatiskt...</p>
      </div>

      <!-- Form -->
      <template v-else>
        <h2 class="form-title">Välj nytt lösenord</h2>
        <form @submit.prevent="submit" novalidate>
          <div class="form-group">
            <label>Nytt lösenord</label>
            <input v-model="password" type="password" placeholder="Minst 8 tecken" />
          </div>
          <div class="form-group">
            <label>Bekräfta lösenord</label>
            <input v-model="passwordConfirm" type="password" placeholder="Upprepa lösenordet" />
          </div>
          <p v-if="formError" class="form-error">{{ formError }}</p>
          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            {{ loading ? 'Sparar...' : 'Spara nytt lösenord' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<style scoped>
.reset-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 1rem;
}

.reset-card {
  background: var(--color-card);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.reset-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1.5rem;
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
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
}

.form-error {
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.btn-full {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.status-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.status-text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.icon-error { color: var(--color-danger); }
.icon-success { color: var(--color-success); }

.spin {
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
