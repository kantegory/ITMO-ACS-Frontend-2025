import {ref, onMounted} from 'vue';
import {workoutApi} from "@/api/index.js";

export function useWorkouts() {
    const workouts = ref([])
    const isWorkoutsLoading = ref(true)

    const fetching = async () => {
        try {
            workouts.value = await workoutApi.getWorkoutPlans()
        } finally {
            isWorkoutsLoading.value = false;
        }
    }

    onMounted(fetching)

    return {
        workouts, isWorkoutsLoading
    }
}