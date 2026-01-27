<template>
  <div class="card p-4" style="max-width:480px">
    <h3>Вход</h3>
    <form @submit.prevent="onSubmit">
      <input v-model="email" class="form-control mb-2" placeholder="Email">
      <input v-model="password" type="password" class="form-control mb-3" placeholder="Пароль">
      <button class="btn btn-primary w-100">Войти</button>
    </form>
  </div>
</template>


<script setup>
import {ref} from 'vue'
import {useAuth} from '../common/useAuth'
import {useRouter} from 'vue-router'

const email = ref('')
const password = ref('')
const {login} = useAuth()
const router = useRouter()

async function onSubmit() {
  try {
    await login(email.value, password.value);
    router.push('/dashboard')
  } catch (e) {
    alert(e.message)
  }
}
</script>