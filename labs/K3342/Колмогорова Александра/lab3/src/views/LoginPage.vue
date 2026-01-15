<template>
  <base-layout>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">Log in</h4>
            </div>

            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              <form @submit.prevent="submit">
                <input v-model="email" type="email" class="form-control mb-2" placeholder="Email" />
                <input v-model="password" type="password" class="form-control mb-3" placeholder="Password" />
                <button class="btn btn-outline-secondary w-100">Log in</button>
              </form>

              <div class="mt-3 text-center">
                <router-link to="/register">
                  Still no account? Sign up!
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'
import BaseLayout from '@/layouts/BaseLayout.vue'

const email = ref('')
const password = ref('')
const error = ref(null)

const { login } = useAuth()

const submit = async () => {
  try {
    error.value = null
    await login({
      email: email.value,
      password: password.value
    })
  } catch (e) {
    error.value = e || 'Login failed'
  }
}
</script>