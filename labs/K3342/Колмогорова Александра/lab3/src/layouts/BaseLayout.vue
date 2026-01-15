<template>
  <div class="app-wrapper d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-grow-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'BaseLayout',
  components: { Navbar, Footer }
}
</script>

<style>
.app-wrapper {
  min-height: 100vh;
}
</style>