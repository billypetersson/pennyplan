<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import AppLogo from '@/components/ui/AppLogo.vue'
import { LayoutDashboard, ArrowLeftRight, BarChart3, PiggyBank, CreditCard, Settings, LogOut } from 'lucide-vue-next'

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
  { label: 'Översikt',        path: '/',                icon: LayoutDashboard },
  { label: 'Transaktioner',   path: '/transaktioner',   icon: ArrowLeftRight },
  { label: 'Budget',          path: '/budget',          icon: BarChart3 },
  { label: 'Sparmål',         path: '/sparmal',         icon: PiggyBank },
  { label: 'Fasta kostnader', path: '/fasta-kostnader', icon: CreditCard },
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
      <AppLogo size="md" />
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
      <span class="nav-icon" aria-hidden="true"><component :is="item.icon" :size="20" :stroke-width="2" /></span>
      <span class="nav-label">{{ item.label }}</span>
    </RouterLink>

    <!-- Theme toggle (mobile bottom bar only) -->
    <div class="nav-theme-mobile">
      <ThemeToggle />
    </div>

    <!-- Profile + logout (desktop sidebar only) -->
    <div class="nav-profile">
      <div class="nav-profile__avatar" :style="{ backgroundColor: avatarColor }">
        {{ initials }}
      </div>
      <div class="nav-profile__icons">
        <ThemeToggle />
        <RouterLink to="/installningar" class="nav-profile__settings" aria-label="Inställningar" title="Inställningar">
          <Settings :size="16" :stroke-width="2" />
        </RouterLink>
        <button class="nav-profile__logout" @click="handleSignOut" aria-label="Logga ut" title="Logga ut">
          <LogOut :size="16" :stroke-width="2" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ── Mobile: bottom bar ── */
.app-nav {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
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

.nav-theme-mobile {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 6px 8px 10px;
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
    padding: 0;
    overflow-y: auto;
    gap: 2px;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--header-height);
    padding: 0 1.25rem;
    flex-shrink: 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0.75rem;
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
    transition: transform 0.2s ease;
  }

  /* Översikt — gentle pulse scale */
  a.nav-item:nth-of-type(1):hover .nav-icon :deep(svg) {
    animation: icon-pulse 0.35s ease;
  }

  /* Transaktioner — slide left-right */
  a.nav-item:nth-of-type(2):hover .nav-icon :deep(svg) {
    animation: icon-swap 0.4s ease;
  }

  /* Budget — grow up from base */
  a.nav-item:nth-of-type(3):hover .nav-icon :deep(svg) {
    animation: icon-rise 0.35s ease;
  }

  /* Sparmål — gentle sway */
  a.nav-item:nth-of-type(4):hover .nav-icon :deep(svg) {
    animation: icon-sway 0.45s ease;
  }

  /* Fasta kostnader — slide right */
  a.nav-item:nth-of-type(5):hover .nav-icon :deep(svg) {
    animation: icon-slide 0.35s ease;
  }

  @keyframes icon-pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.25); }
    100% { transform: scale(1); }
  }

  @keyframes icon-swap {
    0%   { transform: translateX(0); }
    30%  { transform: translateX(-4px); }
    70%  { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }

  @keyframes icon-rise {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }

  @keyframes icon-sway {
    0%   { transform: rotate(0deg); }
    25%  { transform: rotate(-10deg); }
    75%  { transform: rotate(8deg); }
    100% { transform: rotate(0deg); }
  }

  @keyframes icon-slide {
    0%   { transform: translateX(0); }
    40%  { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }

  .nav-theme-mobile {
    display: none;
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

  .nav-profile__icons {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
  }

  .nav-profile__settings,
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

  .nav-profile__settings svg,
  .nav-profile__logout svg {
    width: 16px;
    height: 16px;
  }

  .nav-profile__settings:hover {
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  .nav-profile__logout:hover {
    background-color: var(--color-danger-light);
    color: var(--color-danger);
  }
}
</style>
