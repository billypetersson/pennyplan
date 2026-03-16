import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/transaktioner',
    name: 'transactions',
    component: () => import('@/views/TransactionsView.vue')
  },
  {
    path: '/budget',
    name: 'budget',
    component: () => import('@/views/BudgetView.vue')
  },
  {
    path: '/sparmal',
    name: 'savings',
    component: () => import('@/views/SavingsView.vue')
  },
  {
    path: '/installningar',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
