<template>
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom" aria-label="Основная навигация">
        <div class="container">
            <router-link class="navbar-brand" to="/">FitnessApp</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Переключить навигацию">
                <svg class="icon icon--fill">
                    <use href="#icon-menu"></use>
                </svg>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><router-link class="nav-link" active-class="active" to="/">Тренировки</router-link></li>
                    <li class="nav-item"><router-link class="nav-link" active-class="active" to="/blog">Блог</router-link></li>
                </ul>
                <ul v-if="!authStore.user" class="navbar-nav">
                    <li class="nav-item"><router-link class="nav-link" active-class="active" to="/login">Вход</router-link></li>
                    <li class="nav-item"><router-link class="nav-link" active-class="active" to="/register">Регистрация</router-link></li>
                </ul>
                <ul v-else class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" active-class="active" to="/dashboard">
                            <svg class="icon icon--fill">
                                <use xlink:href="#icon-account"></use>
                            </svg>
                            Кабинет ({{ authStore.user.name }})
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click.prevent="handleLogout">
                            <svg class="icon icon--fill">
                                <use xlink:href="#icon-logout"></use>
                            </svg>
                            Выход
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    authStore.logout()
    router.push('/')
}
</script>
