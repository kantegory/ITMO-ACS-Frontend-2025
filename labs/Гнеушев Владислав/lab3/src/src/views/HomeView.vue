<template>
  <main id="mainContent" class="hero-section" role="main" tabindex="-1" aria-labelledby="homeHeading">
    <div class="container">
      <h1 id="homeHeading">Добро пожаловать в Good fitness</h1>
      <p>Платформа для тренировок и полезных статей о здоровье и фитнесе</p>
      <div class="mt-4">
        <router-link to="/workouts" class="btn btn-light btn-lg me-3">Тренировки</router-link>
        <router-link to="/blog" class="btn btn-outline-light btn-lg">Блог</router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  min-height: 700px;
}
</style>
