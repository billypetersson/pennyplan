<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const initials = computed(() => {
  const email = authStore.user?.email ?? ''
  return email.slice(0, 2).toUpperCase()
})

const avatarColor = computed(() => {
  const email = authStore.user?.email ?? ''
  const colors = ['#4F9B8F', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444']
  let hash = 0
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
})

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}

const navItems = [
  {
    label: 'Översikt',
    path: '/',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>`
  },
  {
    label: 'Transaktioner',
    path: '/transaktioner',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <polyline points="19 12 12 19 5 12"/>
    </svg>`
  },
  {
    label: 'Budget',
    path: '/budget',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>`
  },
  {
    label: 'Sparmål',
    path: '/sparmal',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 3"/>
    </svg>`
  },
  {
    label: 'Fasta kostnader',
    path: '/fasta-kostnader',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>`
  },
  {
    label: 'Inställningar',
    path: '/installningar',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`
  }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="app-nav" role="navigation" aria-label="Huvudnavigation">
    <div class="nav-logo" aria-hidden="true">
      <span class="nav-logo__mark">P</span>
      <span class="nav-logo__name">PennyPlan</span>
    </div>

    <RouterLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ 'nav-item--active': isActive(item.path) }"
      :aria-label="item.label"
      :aria-current="isActive(item.path) ? 'page' : undefined"
    >
      <span class="nav-icon" v-html="item.icon" aria-hidden="true" />
      <span class="nav-label">{{ item.label }}</span>
    </RouterLink>

    <!-- Profile + logout (desktop sidebar only) -->
    <div class="nav-profile">
      <div class="nav-profile__avatar" :style="{ backgroundColor: avatarColor }">
        {{ initials }}
      </div>
      <span class="nav-profile__email">{{ authStore.user?.email }}</span>
      <button class="nav-profile__logout" @click="handleSignOut" aria-label="Logga ut" title="Logga ut">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* ── Mobile: bottom bar ── */
.app-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background-color: var(--color-card);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  z-index: 50;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
}

.nav-logo {
  display: none;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  padding: 6px 4px 10px;
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 28px;
  height: 3px;
  background-color: var(--color-primary);
  border-radius: 0 0 4px 4px;
  transition: transform 0.2s ease;
}

.nav-item--active {
  color: var(--color-primary);
}

.nav-item--active::before {
  transform: translateX(-50%) scaleX(1);
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.nav-label {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.nav-profile {
  display: none;
}

/* ── Desktop: left sidebar ── */
@media (min-width: 768px) {
  .app-nav {
    top: 0;
    right: auto;
    bottom: 0;
    width: var(--sidebar-width);
    height: 100vh;
    flex-direction: column;
    align-items: stretch;
    border-top: none;
    border-right: 1px solid var(--color-border);
    box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
    padding: 1.5rem 0 0;
    overflow-y: auto;
    gap: 2px;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0 1.25rem 1.75rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0.75rem;
  }

  .nav-logo__mark {
    width: 30px;
    height: 30px;
    background-color: var(--color-primary);
    color: #fff;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9375rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .nav-logo__name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.02em;
  }

  .nav-item {
    flex: unset;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6875rem 1.25rem;
    border-radius: 0;
    margin: 0 0.75rem;
    border-radius: var(--radius-sm);
  }

  .nav-item::before {
    display: none;
  }

  .nav-item--active {
    background-color: rgba(79, 155, 143, 0.1);
    color: var(--color-primary);
  }

  .nav-item:not(.nav-item--active):hover {
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  .nav-label {
    font-size: 0.9375rem;
    font-weight: 500;
    letter-spacing: 0;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }

  .nav-icon :deep(svg) {
    width: 20px;
    height: 20px;
  }

  .nav-profile {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: auto;
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--color-border);
  }

  .nav-profile__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .nav-profile__email {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nav-profile__logout {
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

  .nav-profile__logout svg {
    width: 16px;
    height: 16px;
  }

  .nav-profile__logout:hover {
    background-color: var(--color-danger-light);
    color: var(--color-danger);
  }
}
</style>
