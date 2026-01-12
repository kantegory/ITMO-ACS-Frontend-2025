<template>
  <NavBar />
  <RouterView />
  <ThemeToggle />
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import ThemeToggle from '@/components/ThemeToggle.vue';
</script>