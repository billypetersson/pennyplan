<script setup>
import {
  Briefcase, Laptop, Home, Inbox, ShoppingCart, Car,
  Building2, Sparkles, Heart, Shirt, PiggyBank, Package, Receipt
} from 'lucide-vue-next'

const props = defineProps({
  categoryId: { type: String, default: null },
  size: { type: Number, default: 16 },
  strokeWidth: { type: Number, default: 2 }
})

const ICON_MAP = {
  'income-lon':       Briefcase,
  'income-frilans':   Laptop,
  'income-hyra':      Home,
  'income-ovrigt':    Inbox,
  'expense-mat':      ShoppingCart,
  'expense-transport':Car,
  'expense-boende':   Building2,
  'expense-noje':     Sparkles,
  'expense-halsa':    Heart,
  'expense-klader':   Shirt,
  'expense-sparande': PiggyBank,
  'expense-ovrigt':   Package,
  '__fixed__':        Receipt,
}

const icon = props.categoryId ? (ICON_MAP[props.categoryId] ?? Package) : Package
</script>

<template>
  <component :is="icon" :size="size" :stroke-width="strokeWidth" />
</template>
