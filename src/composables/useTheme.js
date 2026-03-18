import { ref } from 'vue'

const isDark = ref(false)

export function initTheme() {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  applyTheme(isDark.value)
}

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }
  return { isDark, toggle }
}
