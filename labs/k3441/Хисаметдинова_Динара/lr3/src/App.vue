<template>
  <div id="app">
    <AppNavbar />
    <RouterView />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style>

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar-logo {
  fill: white;
  transition: fill 0.3s ease;
}

[data-theme="light"] .navbar-logo {
  fill: black;
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) .navbar-logo {
    fill: black;
  }
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

.btn {
  padding: .75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: .375rem;
  text-decoration: none;
  display: inline-block;
  font-weight: 600;
  cursor: pointer;
  background: none;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.card {
  background: var(--card-bg);
  border-radius: .5rem;
  box-shadow: 0 .125rem .25rem var(--shadow-color);
  margin-bottom: 1.5rem;
  overflow: hidden;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.text-center {
  text-align: center;
}

.text-primary {
  color: #007bff !important;
}

.text-muted {
  color: #6c757d !important;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-5 {
  margin-bottom: 3rem;
}

.py-5 {
  padding: 3rem 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col-md-3 {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 15px;
  box-sizing: border-box;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 15px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .col-md-6, .col-md-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>