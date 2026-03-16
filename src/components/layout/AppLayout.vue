<script setup>
import BottomNav from './BottomNav.vue'

defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="app-layout">
    <header v-if="title" class="app-header">
      <h1 class="app-header__title">{{ title }}</h1>
      <slot name="header-right" />
    </header>

    <main class="app-main">
      <slot />
    </main>

    <BottomNav />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  height: var(--header-height);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 1rem;
}

.app-header__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.app-main {
  flex: 1;
  padding: 1rem 1rem calc(var(--nav-height) + 1rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
