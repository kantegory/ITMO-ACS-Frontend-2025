<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">

      <router-link
        class="navbar-brand"
        to="/">
        Let's cook
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
         <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">

        <ul class="navbar-nav">
          <li class="nav-item">
            <span
              v-if="isIndexPage || isLoginPage || isRegisterPage"
              class="nav-link disabled" 
              style="cursor: not-allowed" 
              opacity: 0.7;>
              Home
            </span>

            <router-link v-else               
              to="/main"
              class="nav-link"
              active-class="active">
              Home
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <li v-if="isLoginPage" class="nav-item">
            <router-link
              to="/register"
              class="nav-link">
              Sign Up
            </router-link>
          </li>

          <li v-if="!isAuth && isRegisterPage" class="nav-item">
            <router-link
              to="/login"
              class="nav-link">
              Login
            </router-link>
          </li>

          <li v-if="isIndexPage" class="nav-item">
            <router-link
              to="/login"
              class="nav-link">
              Login
            </router-link>
          </li>

          <li v-if="isAuth & !isAccountPage" class="nav-item">
            <router-link
              to="/account"
              class="nav-link"
              active-class="active">
              Account
            </router-link>
          </li>

          <li v-if="isMainPage || isRecipePage" class="nav-item">
            <router-link
              to="/account"
              class="nav-link"
              active-class="active">
              Account
            </router-link>
          </li>

          <li v-if="isAccountPage" class="nav-item">
            <a
              class="nav-link"
              href="#"
              @click.prevent="logout">
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useAuth from '@/composables/useAuth'

const route = useRoute()
const { logout, isAuth } = useAuth()

const isLoginPage = computed(() => route.name === 'login')
const isRegisterPage = computed(() => route.name === 'register')
const isIndexPage = computed(() => route.name === 'index')
const isAccountPage = computed(() => route.name === 'account')
const isMainPage = computed(() => route.name === 'main')
const isRecipePage = computed(() => route.path.startsWith('/recipe/'))
</script>

