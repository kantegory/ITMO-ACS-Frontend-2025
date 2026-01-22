<template>
  <AppHeader />
  <main class="container-fluid my-5">
    <RouterView />
  </main>
</template>

<script setup>
import AppHeader from "./components/AppHeader.vue";
import { RouterView } from "vue-router";
</script>
