import { useSettingsStore } from '@/stores/settings'
import { formatCurrency } from '@/utils/format'

export function useCurrency() {
  const settingsStore = useSettingsStore()

  function formatAmount(amount) {
    return formatCurrency(amount, settingsStore.currency)
  }

  return { formatAmount }
}
