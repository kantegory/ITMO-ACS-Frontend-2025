<template>
  <div>
    <div class="filter-section mb-4">
      <div class="row g-2">
        <div class="col">
          <input v-model="q" @keyup.enter="search" type="text" class="form-control" placeholder="Введите текст" />
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" @click="search">
            <svg class="icon"><use xlink:href="../assets/imgs/sprite.svg#search"></use></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading">Загрузка...</div>
    <div v-if="error">Ошибка: {{ error.message || error }}</div>

    <div id="vacancy-list">
      <VacancyCard v-for="v in vacancies" :key="v.id" :vacancy="v" @delete="onDelete" />
      <div v-if="vacancies.length === 0" class="text-muted">Вакансий не найдено</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useVacancies from '@/composables/useVacancies'
import VacancyCard from '@/components/VacancyCard.vue'

const q = ref('')
const { vacancies, loadVacancies, loading, error, deleteVacancy } = useVacancies()

onMounted(() => {
  loadVacancies()
})

async function search() {
  await loadVacancies({ search: q.value })
}

async function onDelete(id) {
  if (!confirm('Удалить вакансию?')) return
  try {
    await deleteVacancy(id)
    await loadVacancies()
  } catch (e) {
    alert('Ошибка удаления: ' + (e.response?.data?.message || e.message))
  }
}
</script>