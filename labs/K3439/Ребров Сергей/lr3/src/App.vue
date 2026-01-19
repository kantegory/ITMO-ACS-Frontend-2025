<template>
  <div id="app">
    <Header v-if="showHeader" />

    <main class="container">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

const showHeader = computed(() => {
  return !['Home', 'Login', 'Register'].includes(route.name)
})
</script>

<style>
.container {
  padding: 1rem;
  max-width: 1100px;
  margin: 0 auto;
}
</style>