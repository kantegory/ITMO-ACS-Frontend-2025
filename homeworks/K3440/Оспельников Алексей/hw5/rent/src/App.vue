<template>
  <div id="app" class="app-container">
    <Navbar />
    <main class="flex-grow-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  components: { Navbar, Footer }
};
</script>

<style>
/* Корневой контейнер занимает весь экран и распределяет элементы */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* минимум высота 100% окна */
}

main {
  flex-grow: 1; /* main растягивается, чтобы footer оказался внизу */
}
</style>
