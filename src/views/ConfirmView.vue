<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { Coins, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const status = ref('loading') // loading | success | error
const errorMessage = ref('')
const showWelcome = ref(false)

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    if (data.session) {
      status.value = 'success'
      showWelcome.value = true
      setTimeout(() => router.push('/'), 3500)
    } else {
      const params = new URLSearchParams(window.location.search)
      const tokenHash = params.get('token_hash')
      const type = params.get('type')

      if (tokenHash && type) {
        const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        if (verifyError) throw verifyError
        status.value = 'success'
        showWelcome.value = true
        setTimeout(() => router.push('/'), 3500)
      } else {
        throw new Error('Ogiltig bekräftelselänk.')
      }
    }
  } catch (e) {
    status.value = 'error'
    errorMessage.value = e.message || 'Något gick fel. Försök igen.'
  }
})
</script>

<template>
  <div class="confirm-page">
    <!-- Loading / Error state -->
    <div v-if="status !== 'success'" class="confirm-card">
      <Coins class="brand-icon" :size="36" :stroke-width="1.5" aria-hidden="true" />
      <p class="brand-name">PennyPlan</p>

      <div v-if="status === 'loading'" class="status-block">
        <Loader2 class="spin" :size="40" :stroke-width="1.5" aria-hidden="true" />
        <p class="status-text">Bekräftar ditt konto...</p>
      </div>

      <div v-else class="status-block">
        <XCircle class="icon-error" :size="48" :stroke-width="1.5" aria-hidden="true" />
        <h2 class="status-title">Något gick fel</h2>
        <p class="status-text">{{ errorMessage }}</p>
        <a href="/login" class="btn btn-primary">Tillbaka till inloggning</a>
      </div>
    </div>

    <!-- Welcome overlay -->
    <Transition name="welcome">
      <div v-if="showWelcome" class="welcome-overlay">
        <div class="welcome-card">
          <div class="welcome-glow" />
          <div class="welcome-icon-wrap">
            <CheckCircle2 class="welcome-check" :size="52" :stroke-width="1.5" aria-hidden="true" />
          </div>
          <div class="welcome-logo">
            <Coins class="welcome-coins" :size="28" :stroke-width="1.5" aria-hidden="true" />
            <span>PennyPlan</span>
          </div>
          <h1 class="welcome-title">Välkommen!</h1>
          <p class="welcome-sub">Din e-post är bekräftad. Du är nu redo att börja budgetera.</p>
          <div class="welcome-divider" />
          <p class="welcome-hint">
            <Sparkles :size="13" :stroke-width="2" aria-hidden="true" />
            Loggar in dig automatiskt...
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.confirm-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 1rem;
}

.confirm-card {
  background: var(--color-card);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
}

.brand-icon { color: var(--color-primary); }

.brand-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.spin {
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Welcome overlay */
.welcome-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 100;
  padding: 1rem;
}

.welcome-card {
  position: relative;
  background: var(--color-card);
  border-radius: 24px;
  padding: 2.75rem 2.5rem 2.25rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px var(--color-border);
  overflow: hidden;
}

.welcome-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(79, 155, 143, 0.18) 0%, transparent 70%);
  pointer-events: none;
}

.welcome-icon-wrap {
  margin-bottom: 0.5rem;
}

.welcome-check {
  color: var(--color-success);
  filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.4));
}

.welcome-logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.welcome-coins { color: var(--color-primary); }

.welcome-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin: 0.25rem 0 0;
}

.welcome-sub {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 300px;
  margin-top: 0.25rem;
}

.welcome-divider {
  width: 40px;
  height: 2px;
  background: var(--color-border);
  border-radius: 999px;
  margin: 0.75rem 0 0.25rem;
}

.welcome-hint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

/* Transition */
.welcome-enter-active {
  animation: welcomeIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.welcome-leave-active {
  animation: welcomeOut 0.3s ease-in both;
}

@keyframes welcomeIn {
  from {
    opacity: 0;
    transform: scale(0.88) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes welcomeOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
}
</style>
