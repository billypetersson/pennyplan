<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <span class="logo-icon">💰</span>
        <h1>PennyPlan</h1>
        <p>Din enkla budgetapp</p>
      </div>

      <div class="auth-tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Logga in</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Skapa konto</button>
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label>E-postadress</label>
          <input v-model="email" type="email" placeholder="din@email.se" required />
        </div>
        <div class="form-group">
          <label>Lösenord</label>
          <input v-model="password" type="password" placeholder="Minst 6 tecken" required minlength="6" />
        </div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Laddar...' : mode === 'login' ? 'Logga in' : 'Skapa konto' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref('login')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await authStore.signIn(email.value, password.value)
    } else {
      await authStore.signUp(email.value, password.value)
    }
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Något gick fel, försök igen.'
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
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 2.5rem;
}

.auth-logo h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0.25rem 0 0;
}

.auth-logo p {
  color: var(--color-text-muted);
  margin: 0.25rem 0 0;
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

.btn-full {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
}
</style>
