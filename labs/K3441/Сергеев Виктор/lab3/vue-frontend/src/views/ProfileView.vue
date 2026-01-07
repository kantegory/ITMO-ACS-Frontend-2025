<template>
    <main class="container py-4" role="main">
        <AlertComponent :message="alertMessage" :type="alertType" aria-live="assertive" aria-atomic="true" />

        <section 
            v-if="profileUser"
            class="page-header d-flex flex-wrap justify-content-between gap-3"
            aria-labelledby="profileUsername">
            <div>
                <p class="text-muted mb-1" aria-label="Описание профиля">
                    Профиль пользователя
                </p>
                <h1 id="profileUsername" class="mb-2 d-flex align-items-center">
                    <svg 
                        class="me-2" 
                        width="1em" 
                        height="1em" 
                        fill="currentColor" 
                        aria-hidden="true"
                    >
                        <use href="#user"></use>
                    </svg>
                    <span>{{ profileUser.username }}</span>
                </h1>
                <ul class="list-inline text-muted mb-0"
                    role="list" 
                    aria-label="Статистика профиля">
                    <li class="list-inline-item" role="listitem">
                        <strong aria-label="Количество рецептов">
                            {{ stats.recipes }}
                        </strong> рецептов
                    </li>
                    <li class="list-inline-item" role="listitem">
                        <strong aria-label="Количество лайков">
                            {{ stats.likes }}
                        </strong> лайков
                    </li>
                </ul>
            </div>
            <div v-if="showActions"
                class="d-flex flex-column align-items-end gap-2"
                aria-label="Действия профиля">
                <router-link v-if="isOwnProfile" to="/create-recipe"
                    class="btn btn-primary btn-sm"
                    aria-label="Перейти на страницу создания нового рецепта">
                    Создать рецепт
                </router-link>
            </div>
        </section>

        <section v-if="profileUser">
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button
                        id="tab-recipes"
                        class="nav-link"
                        :class="{ active: activeTab === 'recipes' }"
                        @click="activeTab = 'recipes'"
                        type="button"
                        role="tab"
                        :aria-selected="activeTab === 'recipes'"
                        aria-controls="panel-recipes">
                        Рецепты
                    </button>
                </li>

                <li class="nav-item" role="presentation">
                    <button
                        id="tab-likes"
                        class="nav-link"
                        :class="{ active: activeTab === 'likes' }"
                        @click="activeTab = 'likes'"
                        type="button"
                        role="tab"
                        :aria-selected="activeTab === 'recipes'"
                        aria-controls="panel-likes">
                        Лайки
                    </button>
                </li>
            </ul>

            <div class="tab-content pt-3">
                <div v-if="activeTab === 'recipes'"
                    class="tab-pane fade show active"
                    :class="{ 'show active': activeTab === 'recipes' }"
                    role="tabpanel"
                    aria-labelledby="tab-recipes"
                    aria-live="polite">
                    <div v-if="isLoading" class="row">
                        <div class="col-12">
                            <LoadingCircleComponent text="Загружаем рецепты..." />
                        </div>
                    </div>
                    <div v-else-if="recipes.length === 0" class="row">
                        <div class="col-12">
                            <EmptyStateComponent text="Пока нет опубликованных рецептов." />
                        </div>
                    </div>
                    <div v-else class="row row-cols-1 row-cols-md-2 g-3">
                        <RecipeCardComponent v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
                    </div>
                </div>

                <div v-if="activeTab === 'likes'" 
                    class="tab-pane fade"
                    :class="{ 'show active': activeTab === 'likes' }"
                    role="tabpanel"
                    aria-labelledby="tab-likes"
                    aria-live="polite">
                    <LikesListComponent :likes="likes" :loading="isLoading" />
                </div>
            </div>
        </section>

        <LoadingCircleComponent v-else text="Загрузка профиля..." />
    </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useSocial } from '@/composables/useSocial';
import RecipeCardComponent from '@/components/RecipeCardComponent.vue';
import AlertComponent from '@/components/AlertComponent.vue';
import LikesListComponent from '@/components/LikesListComponent.vue';
import LoadingCircleComponent from '@/components/LoadingCircleComponent.vue';
import EmptyStateComponent from '@/components/EmptyStateComponent.vue';

const route = useRoute();
const { currentUser, isAuthenticated } = useAuth();
const {
    loadUser,
    loadUserRecipes,
    loadUserLikes,
} = useSocial();
const profileUser = ref(null);
const recipes = ref([]);
const likes = ref([]);
const activeTab = ref('recipes');
const isLoading = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');
const stats = reactive({
    recipes: 0,
    likes: 0,
});
const profileUserId = computed(() => {
    if (route.query.mode === 'me') {
        return currentUser.value?.id;
    }
    return route.query.id ? Number(route.query.id) : currentUser.value?.id;
});
const isOwnProfile = computed(() => {
    return currentUser.value && profileUserId.value === currentUser.value.id;
});
const showActions = computed(() => {
    return isOwnProfile.value || (isAuthenticated.value && !isOwnProfile.value);
});
async function loadProfile() {
    if (!profileUserId.value) {
        alertMessage.value = 'Укажите пользователя или авторизуйтесь';
        return;
    }
    isLoading.value = true;
    try {
        profileUser.value = await loadUser(profileUserId.value);
        await Promise.all([loadStats()]);
    } catch (error) {
        alertMessage.value = error.message || 'Не удалось загрузить профиль';
    } finally {
        isLoading.value = false;
    }
}
async function loadStats() {
    try {
        const [recipesData, likesData] = await Promise.all([
            loadUserRecipes(profileUserId.value),
            loadUserLikes(profileUserId.value),
        ]);
        stats.recipes = recipesData.length;
        stats.likes = likesData.length;
    } catch (error) {
        console.error('Failed to load stats', error);
    }
}

async function loadTabData() {
    if (!profileUserId.value) return;
    isLoading.value = true;
    try {
        switch (activeTab.value) {
            case 'recipes':
                recipes.value = await loadUserRecipes(profileUserId.value);
                break;

            case 'likes':
                likes.value = await loadUserLikes(profileUserId.value);
                break;
        }
    } catch (error) {
        alertMessage.value = error.message || 'Ошибка загрузки данных';
    } finally {
        isLoading.value = false;
    }
}

watch(
    () => activeTab.value,
    () => {
        loadTabData();
    },
);
watch(
    () => route.query,
    () => {
        loadProfile().then(() => {
            if (activeTab.value === 'recipes') {
                loadTabData();
            }
        });
    },
    { deep: true },
);
onMounted(async () => {
    await loadProfile();
    await loadTabData();
});
</script>