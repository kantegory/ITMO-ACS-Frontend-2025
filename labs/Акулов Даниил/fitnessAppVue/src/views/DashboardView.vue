<template>
    <div class="container mt-5 content">
        <div class="row">
            <div class="col-md-4 mb-4">
                <ProfileCard :user="authStore.user"/>
            </div>

            <div class="col-md-8">
                <WorkoutHistoryCard :addedWorkouts="addedWorkouts" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { workoutApi } from '@/api'
import ProfileCard from "@/components/ProfileCard.vue";
import WorkoutHistoryCard from "@/components/WorkoutHistoryCard.vue";

const authStore = useAuthStore()
const addedWorkouts = ref([])

onMounted(async () => {
    if (authStore.user) {
        addedWorkouts.value = await workoutApi.getAddedWorkoutPlans(authStore.user.id)
    }
})
</script>
