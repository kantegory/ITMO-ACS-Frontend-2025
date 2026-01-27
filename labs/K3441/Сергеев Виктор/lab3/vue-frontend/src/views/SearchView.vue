<template>
    <main id="main-content" class="container py-4" role="main">
        <AlertComponent :message="alertMessage" :type="alertType" aria-live="polite" />

        <section class="page-header"
            aria-labelledby="searchPageTitle"
            aria-describedby="searchPageHelp">
            <h1 id="searchPageTitle" class="d-flex align-items-center">
                <svg class="me-2" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <use href="#search"></use>
                </svg>
                <span>Поиск рецептов</span>
            </h1>
            <p id="searchPageHelp" class="text-muted mb-0">Фильтруйте рецепты тегу.</p>
        </section>

        <section class="card shadow-sm filter-card">
            <div class="card-body">
                <form @submit.prevent="handleSearch" class="row g-3 align-items-end" role="search">
                    <div class="col-md-4">
                        <label for="titleFilter"
                            class="form-label">
                            Название рецепта
                        </label>
                        <input
                            id="titleFilter"
                            v-model="filters.title"
                            class="form-control"
                            type="text"
                            placeholder="Например, борщ или паста"
                            aria-label="Поиск по названию"
                            autocomplete="off"
                        />
                    </div>
                    <div class="col-md-3">
                        <label for="tagFilter" class="form-label">
                            Тег
                        </label>
                        <select
                            id="tagFilter"
                            v-model="filters.tagId"
                            class="form-select"
                            aria-label="Фильтр по тегу"
                        >
                            <option value="">Выберите тег</option>
                            <option v-for="tag in tags"
                                :key="tag.id"
                                :value="tag.id">
                                {{ tag.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-3" aria-hidden="true"></div>
                    <div class="col-md-2" aria-hidden="true"></div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100" type="submit"
                            aria-label="Выполнить поиск рецептов">
                            Найти
                        </button>
                    </div>
                </form>
            </div>
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
            <div v-else-if="recipes.length === 0 && hasSearched" class="row">
                <div class="col-12">
                    <EmptyStateComponent text="По заданным условиям ничего не найдено." />
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
import LoadingCircleComponent from '@/components/LoadingCircleComponent.vue';
import EmptyStateComponent from '@/components/EmptyStateComponent.vue';
import AlertComponent from '@/components/AlertComponent.vue';
import RecipeCardComponent from '@/components/RecipeCardComponent.vue';
const { sendRequest, BACKEND_URL } = useApi();
const tags = ref([]);
const recipes = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');
const filters = reactive({
    title: '',
    tagId: '',
});
async function loadFilters() {
    try {
        const tagsResponse = await sendRequest(`${BACKEND_URL}/api/tag`)
        if (tagsResponse.success) tags.value = tagsResponse.data ?? [];
    } catch (error) {
        alertMessage.value = 'Не удалось загрузить справочники. Попробуйте обновить страницу.';
    }
}
async function loadRecipes() {
    isLoading.value = true;
    alertMessage.value = '';
    hasSearched.value = true;
    const queryParams = new URLSearchParams();
    if (filters.title) queryParams.append('title', filters.title);
    if (filters.tagId) queryParams.append('tag_id', filters.tagId);
   
    const queryString = queryParams.toString();
    const url = `${BACKEND_URL}/api/recipe/filter/${queryString ? `?${queryString}` : ''}`;
    try {
        const response = await sendRequest(url, 'GET');
        if (response.success) {
            recipes.value = response.data ?? [];
        } else {
            recipes.value = [];
            alertMessage.value = response.error?.message || 'Ошибка при загрузке рецептов.';
        }
    } catch (error) {
        recipes.value = [];
        alertMessage.value = 'Не удалось загрузить рецепты. Попробуйте позже.';
    } finally {
        isLoading.value = false;
    }
}
function handleSearch() {
    loadRecipes();
}
onMounted(async () => {
    await loadFilters();
    await loadRecipes();
});
</script>