<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  radius: { type: String, default: 'var(--radius-sm)' },
})
</script>

<template>
  <div class="skeleton" :style="{ width, height, borderRadius: radius }" />
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    color-mix(in srgb, var(--color-border) 60%, var(--color-card)) 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
  flex-shrink: 0;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
