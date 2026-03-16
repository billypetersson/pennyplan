import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSavingsStore = defineStore('savings', () => {
  const goals = ref([])
  const loading = ref(false)

  async function fetchGoals() {
    loading.value = true
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) goals.value = data ?? []
    loading.value = false
  }

  async function addGoal(payload) {
    // payload: { title, target_amount, target_date? }
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ ...payload, user_id: user.id, current_amount: 0 })
      .select()
      .single()
    if (error) throw error
    goals.value.unshift(data)
    return data
  }

  async function updateGoal(id, updates) {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const idx = goals.value.findIndex(g => g.id === id)
    if (idx >= 0) goals.value[idx] = data
    return data
  }

  async function deleteGoal(id) {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)
    if (error) throw error
    goals.value = goals.value.filter(g => g.id !== id)
  }

  return { goals, loading, fetchGoals, addGoal, updateGoal, deleteGoal }
})
