import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
    { path: '/auth/confirm', component: () => import('@/views/ConfirmView.vue'), meta: { public: true } },
    { path: '/auth/reset-password', component: () => import('@/views/ResetPasswordView.vue'), meta: { public: true } },
    { path: '/', component: DashboardView },
    { path: '/transaktioner', component: () => import('@/views/TransactionsView.vue') },
    { path: '/budget', component: () => import('@/views/BudgetView.vue') },
    { path: '/sparmal', component: () => import('@/views/SavingsView.vue') },
    { path: '/fasta-kostnader', component: () => import('@/views/FixedCostsView.vue') },
    { path: '/installningar', component: () => import('@/views/SettingsView.vue') },
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.public) return

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const isLoggedIn = !!session

    if (!isLoggedIn) return '/login'
    if (to.path === '/login' && isLoggedIn) return '/'
  } catch {
    return '/login'
  }
})

export default router
