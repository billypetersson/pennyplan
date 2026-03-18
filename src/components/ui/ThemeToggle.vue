<script setup>
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'
const { isDark, toggle } = useTheme()
</script>

<template>
  <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'" :title="isDark ? 'Ljust läge' : 'Mörkt läge'">
    <Sun v-if="isDark" :size="16" :stroke-width="2" />
    <Moon v-else :size="16" :stroke-width="2" />
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

.theme-toggle:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}
</style>
