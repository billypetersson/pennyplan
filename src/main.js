import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useSettingsStore } from './stores/settings'
import { initTheme } from './composables/useTheme'
import './assets/main.css'

initTheme()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
authStore.init().then(() => {
  settingsStore.fetchSettings()
  app.mount('#app')
})
