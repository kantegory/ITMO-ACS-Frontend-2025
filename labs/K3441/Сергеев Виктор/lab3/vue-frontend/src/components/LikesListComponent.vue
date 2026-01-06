<template>
    <div>
        <LoadingCircleComponent v-if="loading || isProcessing" text="Загружаем лайки..." />
        <EmptyStateComponent v-else-if="processedLikes.length === 0" text="Пользователь еще не ставил лайки." />
        <div v-else>
            <div v-for="like in processedLikes" :key="like.id" class="card mb-2">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1" aria-label="Название рецепта">
                            {{ like.recipeTitle }}
                        </h6>
                        <p class="text-muted mb-0" aria-label="Описание рецепта">
                            {{ like.recipeDescription }}
                        </p>
                    </div>
                    <router-link :to="`/recipe/${like.recipe.id}`"
                        class="btn btn-sm btn-outline-primary"
                        aria-label="Открыть рецепт: {{ title }}">
                        Открыть
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSocial } from '@/composables/useSocial';
import LoadingCircleComponent from './LoadingCircleComponent.vue';
import EmptyStateComponent from './EmptyStateComponent.vue';
const props = defineProps({
    likes: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
});
const { resolveRecipeTitle } = useSocial();
const processedLikes = ref([]);
const isProcessing = ref(false);
async function processLikes() {
    if (!props.likes.length) {
        processedLikes.value = [];
        return;
    }
    isProcessing.value = true;
    try {
        processedLikes.value = await Promise.all(
            props.likes.map(async (like) => {
                const recipeTitle = await resolveRecipeTitle(like.recipe.id)
                const recipeDescription = like.recipe.description ?? `Описание отсутствует`
                return {
                    ...like,
                    recipeDescription,
                    recipeTitle,
                };
            }),
        );
    } catch (error) {
        console.error('Failed to process likes', error);
        processedLikes.value = [];
    } finally {
        isProcessing.value = false;
    }
}
watch(() => props.likes, processLikes, { immediate: true });
</script>