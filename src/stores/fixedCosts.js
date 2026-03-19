import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useFixedCostsStore = defineStore('fixedCosts', () => {
  const costs = ref([])
  const loading = ref(false)

  const totalMonthly = computed(() => {
    return costs.value.reduce((sum, cost) => {
      if (cost.billing_cycle === 'monthly') return sum + Number(cost.amount)
      if (cost.billing_cycle === 'yearly') return sum + Number(cost.amount) / 12
      if (cost.billing_cycle === 'quarterly') return sum + Number(cost.amount) / 3
      return sum
    }, 0)
  })

  const totalYearly = computed(() => totalMonthly.value * 12)

  async function fetchCosts() {
    loading.value = true
    const { data, error } = await supabase
      .from('fixed_costs')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) costs.value = data ?? []
    loading.value = false
  }

  async function addCost(payload) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Inte inloggad')
    const { data, error } = await supabase
      .from('fixed_costs')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    costs.value.unshift(data)
    return data
  }

  async function updateCost(id, updates) {
    const { data, error } = await supabase
      .from('fixed_costs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const idx = costs.value.findIndex(c => c.id === id)
    if (idx >= 0) costs.value[idx] = data
    return data
  }

  async function deleteCost(id) {
    const { error } = await supabase.from('fixed_costs').delete().eq('id', id)
    if (error) throw error
    costs.value = costs.value.filter(c => c.id !== id)
  }

  return { costs, loading, totalMonthly, totalYearly, fetchCosts, addCost, updateCost, deleteCost }
})
