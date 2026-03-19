<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import { CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const formError = ref('')
const success = ref(false)

async function submit() {
  formError.value = ''
  if (!password.value) return (formError.value = 'Ange ett nytt lösenord.')
  if (password.value.length < 8) return (formError.value = 'Lösenordet måste vara minst 8 tecken.')
  if (password.value !== passwordConfirm.value) return (formError.value = 'Lösenorden matchar inte.')

  loading.value = true
  try {
    await authStore.updatePassword(password.value)
    success.value = true
    setTimeout(() => router.push('/installningar'), 2000)
  } catch {
    formError.value = 'Något gick fel, försök igen.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout title="Byt lösenord">
    <template #header-right>
      <button class="btn btn-ghost btn-sm" @click="router.push('/installningar')">Tillbaka</button>
    </template>

    <div class="card change-pw-card">
      <!-- Success -->
      <div v-if="success" class="success-block">
        <CheckCircle2 class="success-icon" :size="44" :stroke-width="1.5" aria-hidden="true" />
        <p class="success-title">Lösenord uppdaterat!</p>
        <p class="success-sub">Du skickas tillbaka till inställningar...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" novalidate>
        <div class="form-group">
          <label class="form-label" for="new-pw">Nytt lösenord</label>
          <input
            id="new-pw"
            v-model="password"
            type="password"
            placeholder="Minst 8 tecken"
            autocomplete="new-password"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="confirm-pw">Bekräfta lösenord</label>
          <input
            id="confirm-pw"
            v-model="passwordConfirm"
            type="password"
            placeholder="Upprepa lösenordet"
            autocomplete="new-password"
          />
        </div>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Sparar...' : 'Spara nytt lösenord' }}
        </button>
      </form>
    </div>
  </AppLayout>
</template>

<style scoped>
.change-pw-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1.25rem;
}

.form-error {
  font-size: 0.875rem;
  color: var(--color-danger);
  margin-top: -0.25rem;
}

.btn-full {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
}

.success-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
}

.success-icon {
  color: var(--color-success);
}

.success-title {
  font-size: 1.0625rem;
  font-weight: 700;
}

.success-sub {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
