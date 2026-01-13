<template>
    <div class="container mt-4">
        <nav aria-label="breadcrumb" >
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Тренировки</router-link></li>
                <li class="breadcrumb-item" aria-current="page">{{ workout?.title || 'Текущая тренировка' }}</li>
            </ol>
        </nav>

        <div v-if="workout" class="col-lg-8">
            <h1 class="mb-4" id="workoutTitle">{{workout.title}}</h1>
            <div class="d-flex gap-3 mb-4">
                <span :class="'p-2 badge ' + getBadgeClass(workout.level)">Уровень: {{ getBadgeText(workout.level) }}</span>
                <span class="badge bg-info p-2">Тип: {{ workout.type }}</span>
            </div>
            <div class="ratio ratio-16x9 mb-4 bg-dark rounded">
                <iframe :src="workout.videoUrl" title="YouTube video" allowfullscreen></iframe>
            </div>
            <h3>Описание</h3>
            <p class="lead">{{workout.description}}</p>
            <hr>
            <h4>Программа упражнений</h4>
            <div class="list-group mb-4">
                <div v-html="workout.content"></div>
            </div>
            <button @click="handleAddWorkout" class="btn btn-success w-100 btn-lg mb-2">Засчитать тренировку</button>
        </div>
        <div v-else class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workoutApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const workout = ref(null)

onMounted(async () => {
    const id = route.params.id
    if (!id) {
        router.push('/')
        return
    }
    workout.value = await workoutApi.getWorkoutPlan(id)
})

function getBadgeText(level) {
    if (level === 1) return 'Новичок';
    if (level === 2) return 'Средний';
    return 'Продвинутый';
}
function getBadgeClass(level) {
    if (level === 1) return 'bg-success';
    if (level === 2) return 'bg-warning text-dark';
    return 'bg-danger';
}

const handleAddWorkout = async () => {
    if (!authStore.token) {
        alert("Error: not auth")
        return
    }
    const result = await workoutApi.addWorkoutPlan(workout.value.id, authStore.token)
    if (result.success) {
        alert("Успех! Тренировка засчитана, статистика в профиле обновлена.")
    } else {
        alert('Ошибка. Не удалось записать тренировку.')
    }
}
</script>
