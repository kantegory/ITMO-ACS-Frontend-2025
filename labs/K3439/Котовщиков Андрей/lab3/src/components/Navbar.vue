<script>
export default {
  name: "Navbar",

  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "sign-in" });
    },
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'restaurant-list' }">Рестораны</router-link>
      <div class="navbar-nav">
        <router-link class="nav-link" :to="{ name: 'profile' }">Профиль</router-link>
        <a class="nav-link" href="#" @click.prevent="logout">Выйти</a>
      </div>
    </div>
  </nav>
</template>
