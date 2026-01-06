<template>
    <div class="col">
        <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <small 
                        class="text-muted"
                        aria-label="Время приготовления"
                    >
                        {{ formatTime(recipe.cooking_time) }}
                    </small>
                </div>
                <h5 class="card-title">{{ recipe.title }}</h5>
                <p class="card-text text-muted flex-grow-1">
                    {{ recipe.description ?? 'Без описания' }}
                </p>
                <p class="mb-3 text-muted">Сложность: {{ recipe.difficulty }}</p>
                <!-- TODO: ебануть автора мб -->
                <router-link :to="`/recipe/${recipe.id}`"
                    class="btn btn-primary mt-auto align-self-start">
                    Открыть
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatMinutesToText } from '@/utils/utils';
defineProps({
    recipe: {
        type: Object,
        required: true,
    },
});
function formatTime(minutes) {
    return formatMinutesToText(minutes);
}
</script>