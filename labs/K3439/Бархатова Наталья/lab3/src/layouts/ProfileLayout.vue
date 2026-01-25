<template>
  <AppHeaderWithProfile />
  <main>
    <slot />
  </main>
  <AppFooter />
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue'
import AppHeaderWithProfile from "@/components/AppHeaderWithProfile.vue";
</script>
