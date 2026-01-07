<template>
    <main id="main-content" class="container py-4" role="main">
        <AlertComponent :message="alertMessage" :type="alertType" aria-live="polite" />

        <section class="page-header">
            <h1 id="indexTitle" class="d-flex align-items-center">
                Главная
            </h1>
            <p class="text-muted mb-0">
                Выберите рецепт из списка
            </p>
        </section>

        <section class="mt-4" aria-labelledby="resultsHeading">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 id="resultsHeading" class="h5 mb-0">Результаты</h2>
                <span v-if="recipes.length > 0"
                    class="data-summary"
                    aria-live="polite"
                    aria-atomic="true">
          Найдено рецептов: {{ recipes.length }}
        </span>
            </div>
            <div v-if="isLoading" class="row">
                <div class="col-12">
                    <LoadingCircleComponent text="Ищем рецепты..." />
                </div>
            </div>
            <div v-else-if="recipes.length === 0" class="row">
                <div class="col-12">
                    <EmptyStateComponent text="Рецептов не найдено" />
                </div>
            </div>
            <div v-else class="row row-cols-1 row-cols-md-2 g-3" role="list">
                <RecipeCardComponent v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
            </div>
        </section>
    </main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import AlertComponent from '@/components/AlertComponent.vue';
import LoadingCircleComponent from "@/components/LoadingCircleComponent.vue"
import RecipeCardComponent from "@/components/RecipeCardComponent.vue"

const { sendRequest, BACKEND_URL } = useApi();
const recipes = ref([]);
const isLoading = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');


async function loadRecipes() {
    isLoading.value = true;
    alertMessage.value = '';

    try {
        const response = await sendRequest(`${BACKEND_URL}/api/recipe`, 'GET');
        if (response.success) {
            recipes.value = response.data ?? [];
        } else {
            recipes.value = [];
            alertMessage.value = response.data?.message || 'Ошибка при загрузке рецептов.';
        }
    } catch (error) {
        recipes.value = [];
        alertMessage.value = 'Не удалось загрузить рецепты. Попробуйте позже.';
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    await loadRecipes();
});
</script>