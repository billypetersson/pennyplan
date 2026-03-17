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
    <BottomNav />

    <div class="app-content">
      <header class="app-header">
        <h1 v-if="title" class="app-header__title">{{ title }}</h1>
        <slot name="header-right" />
      </header>

      <main class="app-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
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
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.app-main {
  flex: 1;
  padding: 1rem 1rem calc(var(--nav-height) + 1rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Desktop layout ── */
@media (min-width: 768px) {
  .app-layout {
    flex-direction: row;
  }

  .app-content {
    margin-left: var(--sidebar-width);
    max-width: calc(100vw - var(--sidebar-width));
  }

  .app-header {
    padding: 0 2rem;
  }

  .app-main {
    padding: 2rem;
    max-width: 960px;
    width: 100%;
  }
}
</style>
