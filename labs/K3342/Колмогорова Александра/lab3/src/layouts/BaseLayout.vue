<template>
  <div>
    <Navbar />

    <main class="container my-4">
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