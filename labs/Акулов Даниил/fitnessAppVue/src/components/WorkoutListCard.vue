<template>
    <div class="card h-100 workout-card" :data-level="workout.level" :data-type="workout.type">
        <img :src="workout.image || 'https://zelva-crb.by/images/news/2022/zaradka.jpg'" class="card-img-top" :alt="workout.title">
        <div class="card-body">
            <h5 class="card-title">{{ workout.title }}</h5>
            <p class="card-text text-muted">{{ workout.description }}</p>
            <div class="d-flex align-items-center mt-3 gap-2">
                <span class="badge rounded-pill" :class="getBadgeClass(workout.level)">{{ getLevelName(workout.level) }}</span>
                <span class="badge bg-info rounded-pill">{{ workout.type }}</span>
            </div>
        </div>
        <div class="card-footer bg-transparent border-top-0">
            <router-link :to="`/workout/${workout.id}`" class="btn btn-outline-primary w-100">Подробнее</router-link>
        </div>
    </div>
</template>

<script>
import {getPrettyDate} from "../utils/date.js";

const getLevelName = (level) => {
    const map = {
        '1': 'Новичок',
        '2': 'Средний',
        '3': 'Продвинутый'
    }
    return map[String(level)] || 'Любой'
}

const getBadgeClass = (level) => {
    const lvl = Number(level)
    if (lvl === 1) return 'bg-success'
    if (lvl === 2) return 'bg-warning text-dark'
    return 'bg-danger'
}

export default {
    name: "WorkoutListCard",
    methods: {getPrettyDate, getLevelName, getBadgeClass},

    props: {
        workout: {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            id: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            level: {
                type: Number,
                required: true,
            },
            type: {
                type: Number,
                required: true,
            },
        }
    },
};
</script>