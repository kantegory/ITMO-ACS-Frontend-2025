<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">

      <router-link
        class="navbar-brand"
        to="/"
        @click="logout"
      >
        Let's cook
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">

        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              to="/main"
              class="nav-link"
              active-class="active"
            >
              Home
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link
              to="/account"
              class="nav-link"
              active-class="active"
            >
              Account
            </router-link>
          </li>
        </ul>

      </div>
    </div>
  </nav>
</template>

<script>
import useAuth from '@/composables/useAuth'

export default {
    name: 'Navbar',

    setup() {
        const { logout } = useAuth()
        return { logout }
    }
}
</script>
