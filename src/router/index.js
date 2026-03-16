import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
    { path: '/', component: DashboardView },
    { path: '/transaktioner', component: () => import('@/views/TransactionsView.vue') },
    { path: '/budget', component: () => import('@/views/BudgetView.vue') },
    { path: '/sparmal', component: () => import('@/views/SavingsView.vue') },
    { path: '/installningar', component: () => import('@/views/SettingsView.vue') },
  ]
})

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  if (!to.meta.public && !isLoggedIn) return '/login'
  if (to.path === '/login' && isLoggedIn) return '/'
})

export default router
