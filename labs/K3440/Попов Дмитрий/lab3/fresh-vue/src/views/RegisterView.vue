<template>
  <div class="card p-4" style="max-width:480px">
    <h3>Регистрация</h3>
    <form @submit.prevent="onSubmit">
      <input v-model="name" class="form-control mb-2" placeholder="Имя">
      <input v-model="email" class="form-control mb-2" placeholder="Email">
      <input v-model="password" type="password" class="form-control mb-2" placeholder="Пароль">
      <input v-model="password2" type="password" class="form-control mb-3" placeholder="Повторите пароль">
      <button class="btn btn-primary w-100">Создать</button>
    </form>
  </div>
</template>


<script setup>
import {ref} from 'vue'
import {useAuth} from '../common/useAuth'
import {useRouter} from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const {register} = useAuth()
const router = useRouter()

async function onSubmit() {
  if (password.value !== password2.value) {
    alert('Пароли не совпадают');
    return
  }
  try {
    await register(name.value, email.value, password.value);
    router.push('/dashboard')
  } catch (e) {
    alert(e.message)
  }
}
</script>