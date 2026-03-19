import { ref } from 'vue'

const isDark = ref(false)

export function applyTheme(dark) {
  isDark.value = dark
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

export function initTheme() {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

export function useTheme() {
  function toggle() {
    applyTheme(!isDark.value)
  }
  return { isDark, toggle }
}
