import { defineStore } from 'pinia'

// Phase 1: Auth placeholder — no login required yet.
// Phase 2 will integrate Supabase Auth.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null
  },

  actions: {
    // Placeholder for Phase 2
    async signIn(email, password) {
      console.warn('signIn inte implementerat ännu')
    },

    async signOut() {
      this.user = null
    }
  }
})
