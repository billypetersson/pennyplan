import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useBudgetStore = defineStore('budget', () => {
  const limits = ref([])
  const loading = ref(false)

  async function fetchLimits(month) {
    loading.value = true
    const { data, error } = await supabase
      .from('budget_limits')
      .select('*')
      .eq('month', month)
    if (!error) limits.value = data ?? []
    loading.value = false
  }

  async function upsertLimit(payload) {
    // payload: { category_id, month, amount }
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('budget_limits')
      .upsert({ ...payload, user_id: user.id }, { onConflict: 'user_id,category_id,month' })
      .select()
      .single()
    if (error) throw error
    const idx = limits.value.findIndex(
      l => l.category_id === data.category_id && l.month === data.month
    )
    if (idx >= 0) limits.value[idx] = data
    else limits.value.push(data)
    return data
  }

  async function deleteLimit(id) {
    const { error } = await supabase.from('budget_limits').delete().eq('id', id)
    if (error) throw error
    limits.value = limits.value.filter(l => l.id !== id)
  }

  function getLimitForCategory(categoryId) {
    return limits.value.find(l => l.category_id === categoryId) ?? null
  }

  return { limits, loading, fetchLimits, upsertLimit, deleteLimit, getLimitForCategory }
})
