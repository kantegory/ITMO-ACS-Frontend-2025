<script setup></script>

<template>
  <div>
    <nav class="navbar navbar-light bg-light p-3">
      <div class="container">
        <router-link class="navbar-brand" to="/">RestaurantBooking</router-link>
        <div class="d-flex gap-2">
          <router-link class="btn btn-outline-primary" to="/login">Вход</router-link>
          <router-link class="btn btn-primary" to="/register">Регистрация</router-link>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>
