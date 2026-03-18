import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [
      // Income categories
      {
        id: 'income-lon',
        name: 'Lön',
        type: 'income',
        icon: null,
        color: '#10B981'
      },
      {
        id: 'income-frilans',
        name: 'Frilans',
        type: 'income',
        icon: null,
        color: '#3B82F6'
      },
      {
        id: 'income-hyra',
        name: 'Hyresinkomst',
        type: 'income',
        icon: null,
        color: '#8B5CF6'
      },
      {
        id: 'income-ovrigt',
        name: 'Övrigt',
        type: 'income',
        icon: null,
        color: '#6B7280'
      },

      // Expense categories
      {
        id: 'expense-mat',
        name: 'Mat & Dryck',
        type: 'expense',
        icon: null,
        color: '#F59E0B'
      },
      {
        id: 'expense-transport',
        name: 'Transport',
        type: 'expense',
        icon: null,
        color: '#3B82F6'
      },
      {
        id: 'expense-boende',
        name: 'Boende',
        type: 'expense',
        icon: null,
        color: '#8B5CF6'
      },
      {
        id: 'expense-noje',
        name: 'Nöje',
        type: 'expense',
        icon: null,
        color: '#EC4899'
      },
      {
        id: 'expense-halsa',
        name: 'Hälsa',
        type: 'expense',
        icon: null,
        color: '#EF4444'
      },
      {
        id: 'expense-klader',
        name: 'Kläder',
        type: 'expense',
        icon: null,
        color: '#F97316'
      },
      {
        id: 'expense-sparande',
        name: 'Sparande',
        type: 'expense',
        icon: null,
        color: '#4F9B8F'
      },
      {
        id: 'expense-ovrigt',
        name: 'Övrigt',
        type: 'expense',
        icon: null,
        color: '#6B7280'
      }
    ]
  }),

  getters: {
    incomeCategories: (state) =>
      state.categories.filter((c) => c.type === 'income'),

    expenseCategories: (state) =>
      state.categories.filter((c) => c.type === 'expense'),

    getCategoryById: (state) => (id) =>
      state.categories.find((c) => c.id === id) ?? null,

    getCategoriesByType: (state) => (type) =>
      state.categories.filter((c) => c.type === type)
  }
})
