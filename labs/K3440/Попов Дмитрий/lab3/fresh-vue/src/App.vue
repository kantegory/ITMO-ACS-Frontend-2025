<template>
  <div class="layout">
    <AppNavbar/>
    <main class="content">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './components/Navbar.vue'
</script>

<style>
.layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 24px;
  margin-left: 280px;
}
</style>