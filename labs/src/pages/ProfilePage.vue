<template>
  <div>
    <h1>Профиль</h1>

    <div class="mb-3">
      <label class="form-label">Имя пользователя</label>
      <input
        v-model="name"
        type="text"
        class="form-control"
        placeholder="Введите имя"
      />
    </div>

    <button class="btn btn-primary" @click="saveUser">
      Сохранить
    </button>

    <p v-if="name" class="mt-3">
      Привет, {{ name }}
    </p>
  </div>
</template>

<script setup>
import { useUser } from '@/composables/useUser'

const { name, saveUser } = useUser()
</script>
