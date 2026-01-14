<template>
  <div class="app-wrapper d-flex flex-column min-vh-100">
    <main class="flex-grow-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Footer from './components/Footer.vue'

export default {
  components: {
    Footer
  }
}
</script>

<style>
.app-wrapper {
  min-height: 100vh;
}
</style>