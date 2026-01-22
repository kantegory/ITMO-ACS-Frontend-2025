<template>
  <div :class="{ 'home-page': isHomePage }">
    <AppNavbar />
    <router-view />
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';
import { useTheme } from './composables/useTheme';

useTheme();

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
</script>
