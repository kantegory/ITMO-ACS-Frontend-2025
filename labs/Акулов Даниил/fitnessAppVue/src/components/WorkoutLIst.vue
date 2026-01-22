<template>
    <div v-if="isWorkoutsLoading">Тренировки загружаются..</div>
    <div v-else v-for="workout in filteredWorkouts" :key="workout.id" class="col">
        <WorkoutListCard :workout="workout"/>
    </div>
</template>

<script>
import WorkoutListCard from "@/components/WorkoutListCard.vue";
import {computed} from "vue";
import {useWorkouts} from "@/hooks/useWorkouts.js";

export default {
    name: "WorkoutList",
    components: {WorkoutListCard},
    props:{
        levelFilter:{
            type: String,
            required: true,
        },
        typeFilter:{
            type: String,
            required: true,
        }
    },
    setup(props) {
        const {workouts, isWorkoutsLoading} = useWorkouts()

        const filteredWorkouts = computed(() => {
            return workouts.value.filter(workout => {
                const isLevelMatch = props.levelFilter === 'all' || String(workout.level) === props.levelFilter
                const isTypeMatch = props.typeFilter === 'all' || workout.type === props.typeFilter
                return isLevelMatch && isTypeMatch
            })
        })

        return {
            filteredWorkouts, isWorkoutsLoading
        }
    }
};
</script>