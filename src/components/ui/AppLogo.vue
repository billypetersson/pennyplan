<script setup>
import { Coins } from 'lucide-vue-next'

const props = defineProps({
  size: {
    type: String,
    default: 'md' // sm | md | lg
  }
})
</script>

<template>
  <div class="app-logo" :class="`app-logo--${size}`">
    <Coins class="app-logo__icon" :size="size === 'sm' ? 18 : size === 'lg' ? 28 : 22" :stroke-width="1.75" aria-hidden="true" />
    <span class="app-logo__name">PennyPlan</span>
  </div>
</template>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.app-logo__icon {
  color: #C9A227;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.app-logo:hover .app-logo__icon {
  animation: coin-bounce 0.5s ease;
}

@keyframes coin-bounce {
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-5px); }
  50%  { transform: translateY(0); }
  75%  { transform: translateY(-3px); }
  100% { transform: translateY(0); }
}

.app-logo__name {
  font-family: 'Caveat', cursive;
  font-weight: 700;
  color: var(--color-primary-dark);
  line-height: 1;
}

.app-logo--sm .app-logo__name { font-size: 1.4rem; }
.app-logo--md .app-logo__name { font-size: 2rem; }
.app-logo--lg .app-logo__name { font-size: 2.5rem; }
</style>
