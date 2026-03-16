<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout title="Budget">
    <div class="placeholder-page">
      <div class="placeholder-icon" aria-hidden="true">📊</div>
      <h2 class="placeholder-title">Budget</h2>
      <p class="placeholder-subtitle">Kommer i fas 2</p>
      <div class="card placeholder-card">
        <p class="placeholder-description">
          I nästa fas kommer du kunna sätta upp månatliga budgetgränser per kategori
          och följa hur din faktiska spending förhåller sig till budgeten i realtid.
        </p>
        <ul class="placeholder-features">
          <li>
            <span aria-hidden="true">✓</span>
            Sätt budgetgränser per kategori
          </li>
          <li>
            <span aria-hidden="true">✓</span>
            Visuella framstegsindikatorer
          </li>
          <li>
            <span aria-hidden="true">✓</span>
            Varningar när du närmar dig gränsen
          </li>
          <li>
            <span aria-hidden="true">✓</span>
            Månadsvis jämförelse
          </li>
        </ul>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1.5rem;
  gap: 0.5rem;
}

.placeholder-icon {
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.placeholder-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.placeholder-subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.placeholder-card {
  width: 100%;
}

.placeholder-description {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.placeholder-features {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.placeholder-features li {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  color: var(--color-text);
}

.placeholder-features li span {
  color: var(--color-primary);
  font-weight: 700;
  flex-shrink: 0;
}
</style>
