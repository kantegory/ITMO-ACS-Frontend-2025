<template>
    <div>
        <header class="hero-section">
            <div class="container">
                <h1 class="display-4 fw-bold">Твоё тело — твоё дело</h1>
                <p class="lead">Найди идеальную тренировку и начни путь к лучшей версии себя</p>
                <a href="#catalog" class="btn btn-primary btn-lg mt-3">Начать тренировку</a>
            </div>
        </header>

        <section id="catalog" class="container">
            <div class="row mb-4 p-4 bg-white rounded shadow-sm">
                <div class="col-md-4 mb-3">
                    <label for="levelFilter" class="form-label">Уровень</label>
                    <select class="form-select" id="levelFilter" v-model="levelFilter">
                        <option value="all">Все уровни</option>
                        <option value="1">Новичок</option>
                        <option value="2">Средний</option>
                        <option value="3">Продвинутый</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="typeFilter" class="form-label">Тип тренировки</label>
                    <select class="form-select" id="typeFilter" v-model="typeFilter">
                        <option value="all">Все типы</option>
                        <option value="cardio">Кардио</option>
                        <option value="strength">Силовые</option>
                    </select>
                </div>
            </div>

            <div class="row row-cols-1 row-cols-md-3 g-4" id="workoutGrid">
                <WorkoutList :levelFilter="levelFilter" :typeFilter="typeFilter"/>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import WorkoutList from "@/components/WorkoutLIst.vue";

const levelFilter = ref('all')
const typeFilter = ref('all')
</script>
