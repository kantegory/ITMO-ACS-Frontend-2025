<template>
  <div class="vacancy-container">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="vacancy">
      <div class="vacancy-header mb-3">
        <h2>{{ vacancy.title }}</h2>
        <p><strong>Компания:</strong> {{ vacancy.company }}</p>
        <p><strong>Зарплата:</strong> {{ vacancy.salary }}</p>
        <p><strong>Опыт работы:</strong> {{ vacancy.experience }}</p>
      </div>

      <div>
        <h5 class="section-title">Описание</h5>
        <p v-html="vacancy.description"></p>
      </div>

      <div v-if="vacancy.requirements">
        <h5 class="section-title">Требования</h5>
        <ul>
          <li v-for="(r, idx) in vacancy.requirements" :key="idx">{{ r }}</li>
        </ul>
      </div>

      <div v-if="vacancy.bonus">
        <h5 class="section-title">Будет плюсом</h5>
        <ul>
          <li v-for="(b, idx) in vacancy.bonus" :key="idx">{{ b }}</li>
        </ul>
      </div>
    </div>
    <div v-else class="text-muted">Вакансия не найдена</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useVacancies from '@/composables/useVacancies'

const route = useRoute()
const { getVacancy } = useVacancies()
const vacancy = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    vacancy.value = await getVacancy(route.params.id)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>