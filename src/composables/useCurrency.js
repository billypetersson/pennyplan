import { computed } from 'vue'
import { useSettingsStore, CURRENCIES } from '@/stores/settings'
import { formatCurrency } from '@/utils/format'

export function useCurrency() {
  const settingsStore = useSettingsStore()

  function formatAmount(amount) {
    return formatCurrency(amount, settingsStore.currency)
  }

  const currencySymbol = computed(() =>
    CURRENCIES.find(c => c.code === settingsStore.currency)?.symbol ?? 'kr'
  )

  return { formatAmount, currencySymbol }
}
