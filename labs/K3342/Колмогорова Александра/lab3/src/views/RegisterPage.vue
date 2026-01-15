<template>
  <base-layout>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">Sign Up</h4>
            </div>

            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              <form @submit.prevent="submit">
                <h6 class="mb-3">Account</h6>
                <input v-model="form.username" class="form-control mb-2" placeholder="Username" required />
                <input v-model="form.email" type="email" class="form-control mb-2" placeholder="Email" required />
                <input v-model="form.password" type="password" class="form-control mb-2" placeholder="Password" required />
                <input v-model="form.confirmPassword" type="password" class="form-control mb-3" placeholder="Repeat password" required />
                <h6 class="mt-4 mb-3">Profile</h6>
                <input v-model="form.name" class="form-control mb-2" placeholder="Name & Surname" />
                <input v-model="form.bio" class="form-control mb-3" placeholder="About" />
                <button class="btn btn-outline-secondary w-100">Sign up</button>
              </form>

              <div class="mt-3 text-center">
                <router-link to="/login">
                  Already have an account? Log in!
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

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  name: '',
  bio: ''
})

const error = ref(null)

const { register } = useAuth()

const submit = async () => {
  try {
    error.value = null
    await register(form.value)
  } catch (e) {
    error.value = e
  }
}
</script>
