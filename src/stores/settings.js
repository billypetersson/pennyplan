import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { applyTheme } from '@/composables/useTheme'

export const CURRENCIES = [
  { code: 'SEK', label: 'Svensk krona (SEK)', symbol: 'kr' },
  { code: 'EUR', label: 'Euro (EUR)', symbol: '€' },
]

export const useSettingsStore = defineStore('settings', () => {
  const currency = ref('SEK')
  const theme = ref(localStorage.getItem('theme') ?? 'light')

  async function fetchSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (user.user_metadata?.currency) {
      currency.value = user.user_metadata.currency
    }
    if (user.user_metadata?.theme) {
      theme.value = user.user_metadata.theme
      applyTheme(user.user_metadata.theme === 'dark')
    }
  }

  async function setCurrency(value) {
    const { error } = await supabase.auth.updateUser({ data: { currency: value } })
    if (error) throw error
    currency.value = value
  }

  async function setTheme(value) {
    const { error } = await supabase.auth.updateUser({ data: { theme: value } })
    if (error) throw error
    theme.value = value
    applyTheme(value === 'dark')
  }

  // Preview theme visually without persisting to Supabase
  function previewTheme(value) {
    theme.value = value
    applyTheme(value === 'dark')
  }

  async function saveSettings(newCurrency, newTheme) {
    const { error } = await supabase.auth.updateUser({
      data: { currency: newCurrency, theme: newTheme }
    })
    if (error) throw error
    currency.value = newCurrency
    theme.value = newTheme
    applyTheme(newTheme === 'dark')
  }

  async function completeOnboarding() {
    const { error } = await supabase.auth.updateUser({ data: { onboarding_complete: true } })
    if (error) throw error
  }

  async function resetOnboarding() {
    const { error } = await supabase.auth.updateUser({ data: { onboarding_complete: false } })
    if (error) throw error
  }

  return { currency, theme, fetchSettings, setCurrency, setTheme, previewTheme, saveSettings, completeOnboarding, resetOnboarding }
})
