<template>
  <div class="container mt-5">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleRegister" class="mt-3">
      <div class="mb-3">
        <label for="name" class="form-label">Имя</label>
        <input v-model="name" type="text" id="name" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input v-model="email" type="email" id="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input v-model="password" type="password" id="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { useUser } from '../composables/useUser'

const name = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()
const { login } = useUser()

const handleRegister = async () => {
  try {
    // Проверяем, есть ли уже пользователь
    const res = await api.loginUser(email.value, password.value)
    if (res.data.length > 0) {
      alert('Пользователь с таким email уже зарегистрирован')
      return
    }

    // Создаем нового пользователя
    const newUser = { name: name.value, email: email.value, password: password.value }
    await api.registerUser(newUser)

    // Сразу логиним пользователя
    login(newUser)

    router.push('/') // редирект на главную
  } catch (err) {
    console.error(err)
    alert('Ошибка при регистрации')
  }
}
</script>
