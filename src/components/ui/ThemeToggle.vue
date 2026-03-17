<script setup>
import { useTheme } from '@/composables/useTheme'
const { isDark, toggle } = useTheme()
</script>

<template>
  <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'" :title="isDark ? 'Ljust läge' : 'Mörkt läge'">
    <!-- Sun icon -->
    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <!-- Moon icon -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.15s, color 0.15s;
}

.theme-toggle svg {
  width: 16px;
  height: 16px;
}

.theme-toggle:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}
</style>
