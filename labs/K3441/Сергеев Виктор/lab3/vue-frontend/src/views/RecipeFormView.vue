<template>
    <main id="main-content" class="container py-4" role="main">
        <AlertComponent :message="alertMessage" :type="alertType" :is-html="true" aria-live="assertive"
                     aria-atomic="true" />

        <section class="page-header" aria-labelledby="pageTitle">
            <h1 id="pageTitle">
                {{ isEdit ? 'Редактировать рецепт' : 'Создать рецепт' }}
            </h1>
            <p class="text-muted mb-0">Заполните форму.</p>
        </section>

        <form v-if="dictionariesLoaded" 
            @submit.prevent="handleSubmit"
            role="form"
            aria-describedby="recipeFormHelp"
            aria-labelledby="pageTitle">
            <p id="recipeFormHelp" class="visually-hidden">
                Форма {{ isEdit ? 'редактирования' : 'создания' }} рецепта
            </p>
            <section class="card shadow-sm mb-4"
                aria-labelledby="infoHeading">
                <div class="card-body">
                    <h2 id="infoHeading" class="h5 mb-3">Основная информация</h2>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="titleInput" class="form-label">Название*</label>
                            <input
                                id="titleInput"
                                v-model="form.title"
                                class="form-control"
                                type="text"
                                required
                                aria-required="true"
                                aria-label="Название"
                            />
                        </div>
                        <div class="col-md-3" aria-hidden="true"></div>
                        <div class="col-md-3">
                            <label for="difficultyInput" class="form-label">
                                Сложность*
                            </label>
                            <input
                                id="difficultyInput"
                                v-model.number="form.difficulty"
                                class="form-control"
                                type="number"
                                min="1"
                                max="5"
                                required
                                aria-required="true"
                                aria-label="Сложность"
                            >
                        </div>
                        <div class="col-md-6">
                            <label for="descriptionInput" class="form-label">
                                Описание
                            </label>
                            <textarea
                                id="descriptionInput"
                                v-model="form.description"
                                class="form-control"
                                rows="3"
                                aria-label="Описание рецепта"
                            >
                            </textarea>
                        </div>
                        <div class="col-md-3" aria-hidden="true"></div>
                        <div class="col-md-3">
                            <label for="cookTimeInput" class="form-label">
                                Готовка (мин)*
                            </label>
                            <input
                                id="cookTimeInput"
                                v-model.number="form.cookingTime"
                                class="form-control"
                                type="number"
                                min="1"
                                required
                                aria-required="true"
                                aria-label="Время готовки в минутах"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section class="card shadow-sm mb-4"
                aria-labelledby="mediaHeading">
                <div class="card-body">
                    <h2 id="mediaHeading" class="h5 mb-3">Медиа</h2>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="imageInput" class="form-label">
                                Ссылка на фото*
                            </label>
                            <input
                                id="imageInput"
                                v-model="form.imageUrl"
                                class="form-control"
                                type="url"
                                placeholder="https://..."
                                required
                                aria-required="true"
                                aria-label="Ссылка на фотографию рецепта"
                            />
                        </div>
                        <div class="col-md-6">
                            <label for="videoInput" class="form-label">
                                Ссылка на видео
                            </label>
                            <input
                                id="videoInput"
                                v-model="form.videoUrl"
                                class="form-control"
                                type="url"
                                placeholder="https://..."
                                aria-label="Ссылка на видео рецепта"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section class="card shadow-sm mb-4"
                aria-labelledby="ingredientsHeading">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 id="ingredientsHeading" class="h5 mb-0">
                            Ингредиенты
                        </h2>
                        <button 
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            @click="addIngredient"
                            aria-label="Добавить ингредиент"
                        >
                            <svg class="me-2" width="1.2em" height="1.2em" fill="currentColor" aria-hidden="true"><use href="#plus"></use></svg> Добавить
                        </button>
                    </div>
                    <div
                        role="list"
                        aria-live="polite"
                        aria-atomic="false"
                        aria-label="Список ингредиентов"
                    >
                        <IngredientRowComponent
                            v-for="(ingredient, index) in ingredients"
                            :key="index"
                            v-model="ingredients[index]"
                            :ingredients="dictionaries.ingredients"
                            @remove="removeIngredient(index)"
                        />
                    </div>
                </div>
            </section>

            <section class="card shadow-sm mb-4"
                aria-labelledby="tagsHeading">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 id="tagsHeading" class="h5 mb-0">
                            Теги
                        </h2>
                        <button 
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            @click="addTag"
                            aria-label="Добавить тег"
                        >
                            <svg class="me-2" width="1.2em" height="1.2em" fill="currentColor" aria-hidden="true"><use href="#plus"></use></svg> Добавить
                        </button>
                    </div>
                    <div
                        role="list"
                        aria-live="polite"
                        aria-atomic="false"
                        aria-label="Список тегов"
                    >
                        <TagRowComponent
                            v-for="(tag, index) in tags"
                            :key="index"
                            v-model="tags[index]"
                            :tags="dictionaries.tags"
                            @remove="removeTag(index)"
                        />
                    </div>
                </div>
            </section>

            <section class="card shadow-sm mb-4"
                aria-labelledby="stepsHeading">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 id="stepsHeading" class="h5 mb-0">
                            Шаги приготовления
                        </h2>
                        <button 
                            type="button"
                            class="btn btn-sm btn-outline-primary" 
                            @click="addStep"
                            aria-label="Добавить шаг"
                        >
                            <svg class="me-2" width="1.2em" height="1.2em" fill="currentColor" aria-hidden="true"><use href="#plus"></use></svg> Добавить
                        </button>
                    </div>
                    <div 
                        role="list"
                        aria-live="polite"
                        aria-atomic="false"
                        aria-label="Список шагов приготовления">
                        <RecipeStepRowComponent
                            v-for="(step, index) in steps"
                            :key="index"
                            v-model="steps[index]"
                            :index="index"
                            @remove="removeStep(index)"
                        />
                    </div>
                </div>
            </section>

            <div class="text-end">
                <button
                    class="btn btn-primary btn-lg"
                    type="submit"
                    :disabled="isSaving"
                    aria-label="Сохранить рецепт"
                >
                    {{ isSaving ? 'Сохраняем...' : isEdit ? 'Сохранить изменения' : 'Создать рецепт' }}
                </button>
            </div>
        </form>

        <LoadingCircleComponent v-else text="Загрузка данных..." />
    </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useRecipe } from '@/composables/useRecipe';
import LoadingCircleComponent from '@/components/LoadingCircleComponent.vue';
import IngredientRowComponent from '@/components/IngredientRowComponent.vue';
import RecipeStepRowComponent from '@/components/RecipeStepRowComponent.vue';
import TagRowComponent from '@/components/TagRowComponent.vue';
import AlertComponent from '@/components/AlertComponent.vue';
const route = useRoute();
const router = useRouter();
const { requireAuth, fetchCurrentUser } = useAuth();
const { loadDictionaries, loadRecipeDetails, loadRecipeIngredients, loadRecipeTags, loadRecipeSteps, saveRecipe } = useRecipe();
const isEdit = computed(() => Boolean(route.params.id));
const recipeId = computed(() => (route.params.id ? Number(route.params.id) : null));
const dictionaries = reactive({ tags: [], ingredients: [] });
const dictionariesLoaded = ref(false);
const isSaving = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');
const form = reactive({
    title: '',
    description: '',
    difficulty: 1,
    cookingTime: 0,
    imageUrl: '',
    videoUrl: '',
});
const ingredients = ref([{ ingredientId: '', amount: 0, unit: '' }]);
const tags = ref([{ tagId: '' }])
const steps = ref([{ instruction: '', step_number: 1 }]);
function addIngredient() {
    ingredients.value.push({ ingredientId: '', amount: 0, unit: '' });
}

function removeIngredient(index) {
    ingredients.value.splice(index, 1);
}

function addTag() {
    tags.value.push({ tagId: '' });
}

function removeTag(index) {
    tags.value.splice(index, 1);
}

function addStep() {
    steps.value.push({ instruction: '', step_number: steps.value.length + 1 });
}

function removeStep(index) {
    steps.value.splice(index, 1);
}

async function loadRecipeData() {
    if (!recipeId.value) return;
    try {
        const recipeDetails = await loadRecipeDetails(recipeId.value);
        form.title = recipeDetails.title || '';
        form.description = recipeDetails.description || '';
        form.difficulty = recipeDetails.difficulty || 1;
        form.cookingTime = recipeDetails.cooking_time || 0;
        form.imageUrl = recipeDetails.image_url || '';
        form.videoUrl = recipeDetails.video_url || '';
        const recipeIngredients = await loadRecipeIngredients(recipeId.value);
        ingredients.value =
            recipeIngredients.length > 0
                ? recipeIngredients.map((entry) => ({
                    ingredientId: entry.ingredient?.id || '',
                    amount: Number(entry.amount) || 0,
                    unit: entry.unit || '',
                }))
                : [{ ingredientId: '', amount: 0, unit: '' }];
        const recipeTags = await loadRecipeTags(recipeId.value);
        tags.value =
            recipeTags.length > 0
                ? recipeTags.map((entry) => ({
                    tagId: entry.tag?.id || '',
                }))
                : [{ tagId: '' }];
        const recipeSteps = await loadRecipeSteps(recipeId.value);
        recipeSteps.sort((a, b) => a.step_number - b.step_number);
        steps.value =
            recipeSteps.length > 0
                ? recipeSteps.map((step) => ({ 
                    instruction: step.instruction || '',
                    step_number: step.step_number || '',
                 }))
                : [{ instruction: '', step_number: '' }];
    } catch (error) {
        alertMessage.value = error.message || 'Не удалось загрузить рецепт';
        alertType.value = 'danger';
    }
}

async function handleSubmit() {
    if (!requireAuth()) return;
    const currentUserData = await fetchCurrentUser()
    if (!currentUserData) {
        alertMessage.value = "Не удалось получить данные о текущем пользователе";
        alertType.value = "danger";
        return;
    }

    alertMessage.value = '';
    const validIngredients = ingredients.value.filter(
        (ing) => ing.ingredientId && ing.amount && ing.unit,
    );
    const validTags = tags.value.filter(
        (tag) => tag.tagId,
    );
    const validSteps = steps.value.filter(
        (step) => step.instruction.trim() && step.step_number,
    );
    if (validIngredients.length === 0) {
        alertMessage.value = 'Добавьте хотя бы один ингредиент.';
        alertType.value = 'danger';
        return;
    }
    if (validTags.length === 0) {
        alertMessage.value = 'Добавьте хотя бы один тег.';
        alertType.value = 'danger';
        return;
    }
    if (validSteps.length === 0) {
        alertMessage.value = 'Добавьте хотя бы один шаг приготовления.';
        alertType.value = 'danger';
        return;
    }
    isSaving.value = true;
    try {
        const recipeData = isEdit.value ? {
            title: form.title.trim(),
            description: form.description.trim() || null,
            difficulty: form.difficulty,
            cooking_time: form.cookingTime,
            image_url: form.imageUrl.trim() || null,
            video_url: form.videoUrl.trim() || null,
        } : {
            title: form.title.trim(),
            description: form.description.trim() || null,
            difficulty: form.difficulty,
            cooking_time: form.cookingTime,
            image_url: form.imageUrl.trim() || null,
            video_url: form.videoUrl.trim() || null,
            author_id: currentUserData.id
        }
        const savedRecipeId = await saveRecipe(
            recipeData,
            validIngredients.map((ing) => ({
                ingredient_id: Number(ing.ingredientId),
                amount: Number(ing.amount),
                unit: ing.unit.trim(),
            })),
            validTags.map((tag) => ({
                tag_id: Number(tag.tagId)
            })),
            validSteps.map((step) => ({
                step_number: Number(step.step_number),
                instruction: step.instruction.trim(),
            })),
            recipeId.value,
        );
        alertMessage.value = `Рецепт успешно сохранен. Переход на страницу рецепта...`;
        alertType.value = 'success';
        setTimeout(() => {
            router.push(`/recipe/${savedRecipeId}`);
        }, 1500);
    } catch (error) {
        alertMessage.value = error.message || 'Произошла ошибка. Попробуйте повторить.';
        alertType.value = 'danger';
    } finally {
        isSaving.value = false;
    }
}
onMounted(async () => {
    if (!requireAuth()) return;
    try {
        const dicts = await loadDictionaries();
        dictionaries.ingredients = dicts.ingredients;
        dictionaries.tags = dicts.tags
        dictionariesLoaded.value = true;
        if (isEdit.value) {
            await loadRecipeData();
        }
    } catch (error) {
        alertMessage.value = error.message || 'Ошибка загрузки данных';
        alertType.value = 'danger';
    }
});
</script>