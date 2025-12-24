<template>
  <div>
    <h3>Личный кабинет</h3>
    <div v-if="user" class="card p-3">
      <div>Имя: <strong>{{ user.name }}</strong></div>
      <div class="small text-muted">Email: {{ user.email }}</div>
    </div>
    <div v-else class="text-muted">Требуется авторизация</div>
  </div>
</template>


<script setup>
import {computed} from 'vue'
import {useAuth} from '../common/useAuth'

const {user} = useAuth()
const userComputed = computed(() => user.value)
</script>