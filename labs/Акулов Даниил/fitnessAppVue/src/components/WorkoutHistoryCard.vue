<template>
    <div class="card auto-height">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Мои тренировки</h5>
        </div>
        <div class="list-group list-group-flush">
            <div v-for="workout in addedWorkouts" :key="workout.id" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ workout.title }}</h5>
                    <small class="text">{{ getPrettyDate(workout.planedAt) }}</small>
                </div>
                <p class="mb-1">{{ workout.description }}</p>
            </div>
            <div v-if="addedWorkouts.length === 0" class="p-3 text-center text-muted">
                У вас пока нет добавленных тренировок.
            </div>
        </div>
    </div>
</template>

<script>
import {getPrettyDate} from "../utils/date.js";

export default {
    name: "WorkoutHistoryCard",
    methods: {getPrettyDate},

    props: {
        addedWorkouts: [{
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
            planedAt: {
                type: Number,
                required: true,
            },
        }]
    },
};
</script>