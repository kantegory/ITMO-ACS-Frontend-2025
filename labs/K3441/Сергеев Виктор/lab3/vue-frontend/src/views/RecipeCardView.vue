<template>
  <main id="main-content" class="container py-4" role="main">
    <AlertComponent :message="alertMessage" :type="alertType" aria-live="assertive" aria-atomic="true" />

    <section v-if="recipe" class="page-header d-flex flex-wrap justify-content-between gap-3">
      <div>
        <p class="text-muted mb-1" aria-hidden="true">Рецепт</p>
        <h1 id="recipeTitle" class="mb-2">{{ recipe.title }}</h1>
        <p class="text-muted mb-1" aria-label="Метаданные рецепта">{{ recipeMeta }}</p>
        <p class="text-muted mb-0" aria-label="Автор рецепта">
          Автор: <router-link 
            v-if="authorId"
            :to="`/profile?id=${authorId}`"
            class="text-decoration-none">{{ authorName }}
        </router-link>
        <span v-else>{{ authorName }}</span>
        </p>
      </div>
    </section>

    <div v-if="recipe" class="row g-4">
      <div class="col-lg-8">
        <article class="card shadow-sm"
            aria-labelledby="recipeTitle">
          <div class="card-body">
            <img
              v-if="recipe.image"
              :src="recipe.image"
              :alt="recipe.title"
              class="img-fluid rounded mb-3"
              role="presentation"
              aria-hidden="true"
            />
            <p class="mb-0" aria-label="Описание рецепта">
              {{ recipe.description || 'Описание отсутствует.' }}
            </p>
          </div>
        </article>

        <article class="card shadow-sm mt-3" aria-labelledby="stepsHeading">
          <div class="card-body">
            <h2 id="stepsHeading" class="h5">Шаги приготовления</h2>
            <EmptyStateComponent v-if="steps.length === 0"
              text="Шаги приготовления появятся позже." />
            <div v-else class="mt-3">
              <div
                v-for="step in steps"
                :key="step.step_number"
                class="step-row"
              >
                <div class="d-flex align-items-center mb-2">
                  <span class="step-number-badge">{{ step.step_number }}</span>
                  <h6 class="mb-0">
                    Шаг {{ step.step_number }}
                </h6>
                </div>
                <p class="mb-0">{{ step.instruction }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="card shadow-sm mt-3"
          aria-labelledby="commentsHeading">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 id="commentsHeading" class="h5 mb-0">Комментарии</h2>
              <span class="data-summary" 
                aria-label="Счётчик комментариев">
                Всего: {{ comments.length }}
              </span>
            </div>
            <EmptyStateComponent v-if="comments.length === 0"
              text="Комментариев пока нет" />
            <div v-else>
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="card comment-card mb-3"
              >
                <div class="card-body">
                  <div class="comment-meta mb-2" aria-label="Данные о комментаторе">
                    <router-link
                      :to="`/profile?id=${comment.user.id}`"
                      class="text-decoration-none fw-semibold">
                      {{ comment.user.username || `Пользователь #${comment.user.id}` }}
                    </router-link>
                    <span class="ms-2">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="mb-0" aria-label="Текст комментария">
                    {{ comment.comment }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="isAuthenticated" class="mt-4"
              aria-label="Форма добавления комментария">
              <form @submit.prevent="handleCommentSubmit">
                <div class="mb-3">
                  <label for="commentText" class="form-label">Ваш комментарий</label>
                  <textarea
                    id="commentText"
                    v-model="commentText"
                    class="form-control"
                    rows="3"
                    required
                    aria-required="true"
                    aria-label="Текст комментария"
                  ></textarea>
                </div>
                <button class="btn btn-primary"
                  type="submit"
                  aria-label="Отправить комментарий">
                  Отправить
                </button>
              </form>
            </div>
            <div v-else class="alert alert-info mb-0 mt-4">
              Чтобы оставить комментарий, <router-link 
                to="/login" class="alert-link">
                войдите
              </router-link> в аккаунт.
            </div>
          </div>
        </article>
      </div>

      <div class="col-lg-4">
        <section class="card shadow-sm"
          aria-labelledby="ingredientsHeading">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h2 id="ingredientsHeading" class="h5 mb-0">Ингредиенты</h2>
              <span class="badge bg-light text-dark"
                aria-label="Счётчик ингредиентов">
                Всего {{ ingredients.length }}
              </span>
            </div>
            <ul v-if="ingredients.length > 0" class="list-group list-group-flush">
              <li
                v-for="entry in ingredients"
                :key="entry?.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{{ entry.ingredient?.name || 'Ингредиент' }}</span>
                <span class="text-muted">{{ entry.amount }} {{ entry.unit }}</span>
              </li>
            </ul>
            <div v-else class="text-muted">Ингредиенты не указаны.</div>
          </div>
        </section>

        <section class="card shadow-sm"
          aria-labelledby="tagsHeading">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h2 id="tagsHeading" class="h5 mb-0">Теги</h2>
              <span class="badge bg-light text-dark"
                aria-label="Счётчик тегов">
                Всего {{ tags.length }}
              </span>
            </div>
            <ul v-if="tags.length > 0" class="list-group list-group-flush">
              <li
                v-for="entry in tags"
                :key="entry?.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{{ entry.tag?.name || 'Тег' }}</span>
              </li>
            </ul>
            <div v-else class="text-muted">Теги не указаны.</div>
          </div>
        </section>

        <section class="card shadow-sm mt-3"
          aria-labelledby="actionsHeading">
          <div class="card-body">
            <h2 id="actionsHeading" 
              class="h6 text-uppercase text-muted">
              Действия
            </h2>
            <p class="mb-1">Лайков: <strong aria-label="Счётчик лайков">
                {{ likes.length }}
              </strong>
            </p>
            <button
              v-if="!isAuthenticated"
              class="btn btn-outline-primary w-100 mb-2"
              aria-label="Добавить или убрать лайк"
              aria-pressed="false"
              @click="$router.push('/login')"
            >
              Войти, чтобы поставить лайк
            </button>
            <button
              v-else
              class="btn w-100 mb-2"
              :class="hasUserLike ? 'btn-primary' : 'btn-outline-primary'"
              :aria-label="hasUserLike ? 'Убрать лайк c рецепта' : 'Поставить лайк рецепту'"
              :aria-pressed="hasUserLike"
              @click="toggleLike"
            >
              {{ hasUserLike ? 'Убрать лайк' : 'Нравится' }}
            </button>
            <button
              v-if="canEdit"
              class="btn btn-outline-secondary w-100 mb-2"
              @click="$router.push(`/edit-recipe/${recipeId}`)"
            >
              Редактировать
            </button>
          </div>
        </section>
      </div>
    </div>

    <LoadingCircleComponent v-else text="Загрузка рецепта..." />
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useAuth } from '@/composables/useAuth';
import { useSocial } from '@/composables/useSocial';
import { useRecipe } from '@/composables/useRecipe';
import { formatMinutesToText } from '@/utils/utils';
import AlertComponent from '@/components/AlertComponent.vue';
import LoadingCircleComponent from '@/components/LoadingCircleComponent.vue';
import EmptyStateComponent from '@/components/EmptyStateComponent.vue';
const route = useRoute()
const { sendRequest, BACKEND_URL } = useApi()
const { isAuthenticated, currentUser } = useAuth()
const { loadUser } = useSocial()
const { loadRecipeDetails, loadRecipeIngredients, loadRecipeTags, loadRecipeSteps } = useRecipe()
const recipeId = computed(() => Number(route.params.id))
const recipe = ref(null)
const authorName = ref('неизвестно')
const authorId = ref(null)
const ingredients = ref([])
const tags = ref([])
const steps = ref([])
const comments = ref([])
const likes = ref([])
const hasUserLike = ref(false)
const canEdit = ref(false)
const commentText = ref('')
const alertMessage = ref('')
const alertType = ref('danger')
const recipeMeta = computed(() => {
  if (!recipe.value) return ''
  return [
    `Сложность: ${recipe.value.difficulty || '-'}`,
    `Время готовки: ${formatMinutesToText(recipe.value.cooking_time)}`,
  ].join(' • ')
})
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('ru-RU')
}
async function loadRecipe() {
  try {
    recipe.value = await loadRecipeDetails(recipeId.value)
    ingredients.value = await loadRecipeIngredients(recipeId.value)
    tags.value = await loadRecipeTags(recipeId.value)
    steps.value = await loadRecipeSteps(recipeId.value)
    steps.value.sort((a, b) => a.step_number - b.step_number)
    canEdit.value = currentUser.value?.id === recipe.value.author.id
    await Promise.all([loadAuthor(), loadComments(), loadLikes()])
  } catch (error) {
    alertMessage.value = 'Не удалось загрузить рецепт'
  }
}
async function loadAuthor() {
  if (!recipe.value?.author.id) return
  authorId.value = recipe.value.author.id
  try {
    const authorData = await loadUser(authorId.value)
    authorName.value = authorData?.username || "неизвестно"
  } catch (error) {
    console.warn('Failed to load author', error)
  }
}
async function loadComments() {
  try {
    const response = await sendRequest(`${BACKEND_URL}/api/comment/?recipe_id=${recipeId.value}`)
    if (response.success) {
      const commentsData = response.data ?? []

      comments.value = await Promise.all(
        commentsData.map((comment) => {
            const user = comment.user
            return {
            ...comment,
            username: `${user.username}`.trim() || `Пользователь #${comment.user.id}`,
            }
        })
      )
    }
  } catch (error) {
    console.error('Failed to load comments', error)
  }
}
async function loadLikes() {
  try {
    const response = await sendRequest(`${BACKEND_URL}/api/like/?recipe_id=${recipeId.value}`)
    if (response.success) {
      likes.value = response.data ?? []
      hasUserLike.value = currentUser.value
        ? likes.value.some((like) => like.user.id === currentUser.value.id)
        : false
    }
  } catch (error) {
    console.error('Failed to load likes', error)
  }
}
async function toggleLike() {
  if (!isAuthenticated.value) return
  try {
    if (hasUserLike.value) {
      const userLike = likes.value.find((like) => like.user.id === currentUser.value.id)
      if (userLike) {
        const response = await sendRequest(`${BACKEND_URL}/api/like/${userLike.id}`, 'DELETE')
        if (response.success) {
          await loadLikes()
        }
      }
    } else {
      const response = await sendRequest(`${BACKEND_URL}/api/like/`, 'POST', {
        recipe_id: recipeId.value,
        user_id: currentUser.value.id
      })
      if (response.success) {
        await loadLikes()
      }
    }
  } catch (error) {
    alertMessage.value = 'Не удалось изменить лайк'
  }
}
async function handleCommentSubmit() {
  if (!commentText.value.trim()) {
    alertMessage.value = 'Введите текст комментария.'
    return
  }
  try {
    const response = await sendRequest(
      `${BACKEND_URL}/api/comment/`,
      'POST',
      { 
        recipe_id: recipeId.value,
        user_id: currentUser.value.id,
        comment: commentText.value.trim()
      }
    )
    if (response.success) {
      commentText.value = ''
      alertMessage.value = ''
      await loadComments()
    } else {
      alertMessage.value = response.data?.message || 'Не удалось отправить комментарий.'
    }
  } catch (error) {
    alertMessage.value = 'Не удалось отправить комментарий'
  }
}

watch(() => route.params.id, () => {
  loadRecipe()
}, { immediate: true })
onMounted(() => {
  loadRecipe()
})
</script>