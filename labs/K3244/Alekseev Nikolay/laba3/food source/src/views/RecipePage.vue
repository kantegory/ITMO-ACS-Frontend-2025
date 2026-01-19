<template>
  <BaseLayout>
    <header class="d-flex justify-content-between align-items-center mb-4">
      <router-link class="btn btn-outline-primary d-inline-flex align-items-center gap-2" to="/">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-arrow-left"></use>
        </svg>
        <span>Назад к списку</span>
      </router-link>

      <router-link class="btn btn-outline-primary d-inline-flex align-items-center gap-2" to="/profile">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-user"></use>
        </svg>
        <span>Профиль</span>
      </router-link>
    </header>

    <div v-if="loading" class="text-muted">Загрузка...</div>

    <div v-else-if="!meal" class="text-muted text-center">
      Рецепт не найден
    </div>

    <div v-else class="card shadow-lg p-4">
      <img
        :src="meal.strMealThumb"
        :alt="meal.strMeal"
        class="object-fit-contain mb-3"
        style="max-height: 50vh;"
      />

      <h2 class="h4">{{ meal.strMeal }}</h2>

      <p class="small text-muted" style="white-space: pre-line;">
        {{ meal.strInstructions }}
      </p>

      <p>
        <strong>Ингредиенты:</strong>
        {{ ingredients.join(", ") }}
      </p>

      <p v-if="meal.strCategory">
        <strong>Категория:</strong> {{ meal.strCategory }}
      </p>

      <p v-if="meal.strArea">
        <strong>Кухня:</strong> {{ meal.strArea }}
      </p>

      <p class="mb-3">
        <strong>Автор:</strong> {{ author?.name || "—" }}
        <button
          v-if="canSubscribe"
          class="btn btn-outline-primary btn-sm ms-2"
          @click="toggleSub"
        >
          {{ isSubscribed ? "Отписаться" : "Подписаться" }}
        </button>
      </p>


      <div class="d-flex flex-wrap gap-2 mt-3">
        <button
          class="btn"
          :class="isSaved ? 'btn-success' : 'btn-outline-success'"
          @click="toggleSave"
        >
          {{ isSaved ? "Сохранено" : "Сохранить" }}
        </button>

        <button
          class="btn"
          :class="isLiked ? 'btn-danger' : 'btn-outline-danger'"
          @click="toggleLike"
        >
          {{ isLiked ? "Убрать лайк" : "Поставить лайк" }}
        </button>
      </div>

      <div class="mt-3 d-flex align-items-center gap-2">
        <span>{{ likes }}</span>
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="/sprite.svg#icon-heart"></use>
        </svg>
      </div>

      <hr class="my-4" />

      <h5>Комментарии</h5>

      <div v-if="commentsLoading" class="text-muted">
        Загрузка комментариев…
      </div>

      <p v-else-if="comments.length === 0" class="text-muted">
        Комментариев пока нет
      </p>

      <div v-else class="d-flex flex-column gap-3 mb-3">
        <div v-for="c in comments" :key="c.id" class="border rounded p-2">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div>
              <strong>{{ c.user?.name || "Пользователь" }}</strong>
              <p class="mb-1">{{ c.text }}</p>
              <small class="text-muted">
                {{ new Date(c.createdAt).toLocaleString() }}
              </small>
            </div>

            <button
              v-if="auth.user && Number(c.userId) === Number(auth.user.id)"
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="deleteComment(c.id)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div v-if="auth.user" class="mt-3">
        <textarea
          v-model="commentText"
          class="form-control mb-2"
          rows="3"
          placeholder="Написать комментарий…"
        />
        <button class="btn btn-primary" @click="addComment">
          Отправить
        </button>
      </div>

      <p v-else class="text-muted">
        Войдите, чтобы оставить комментарий
      </p>
      
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import BaseLayout from "@/components/BaseLayout.vue"
import { mealdbApi } from "@/api/mealDB"
import { useMealdbProxyActions } from "@/composables/useMealdbProxyActions"
import { usersApi, commentsApi } from "@/api"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()

const THEMEALDB_USER_ID = 999999

const auth = useAuthStore()
const me = computed(() => auth.user)

const author = ref(null)


const loading = ref(false)
const meal = ref(null)

const comments = ref([])
const commentText = ref("")
const commentsLoading = ref(false)


const mealRef = computed(() => meal.value || {})

const {
  proxy,
  likes,
  isLiked,
  isSaved,
  loadProxyIfExists,
  ensureProxy,
  toggleLike,
  toggleSave
} = useMealdbProxyActions(mealRef)

const ingredients = computed(() => {
  if (!meal.value) return []
  const out = []
  for (let i = 1; i <= 20; i++) {
    const ing = String(meal.value[`strIngredient${i}`] ?? "").trim()
    if (ing) out.push(ing)
  }
  return out
})

const canSubscribe = computed(() => {
  const authorId = Number(proxy.value?.authorId)
  const myId = Number(me.value?.id)
  if (!me.value || !authorId || !myId) return false
  if (authorId === myId) return false
  if (authorId === THEMEALDB_USER_ID) return false
  return true
})

const isSubscribed = computed(() => {
  const set = new Set((me.value?.subscriptions || []).map(Number))
  return set.has(Number(proxy.value?.authorId))
})

async function loadAuthor() {
  const aid = Number(proxy.value?.authorId)
  
  if (!aid) {
    author.value = null
    return
  }
  const { data } = await usersApi.getOne(aid)
  author.value = data
}

async function patchMe(patch) {
  if (!me.value?.id) return null
  const { data } = await usersApi.patch(me.value.id, patch)
  auth.setSession(auth.accessToken, data)
  return data
}

async function toggleSub() {
  const aid = Number(proxy.value?.authorId)
  if (!aid) return

  const current = Array.isArray(me.value?.subscriptions) ? me.value.subscriptions : []
  const set = new Set(current.map(Number))
  set.has(aid) ? set.delete(aid) : set.add(aid)

  await patchMe({ subscriptions: Array.from(set) })
}

async function loadComments() {
  if (!proxy.value?.id) return
  commentsLoading.value = true
  try {
    const { data } = await commentsApi.getByRecipe(proxy.value.id)
    comments.value = data
  } finally {
    commentsLoading.value = false
  }
}

async function addComment() {
  if (!auth.user?.id) return
  if (!commentText.value.trim()) return
  if (!proxy.value?.id) return

  await commentsApi.create({
    recipeId: proxy.value.id,
    userId: auth.user.id,
    text: commentText.value.trim(),
    createdAt: Date.now()
  })

  commentText.value = ""
  await loadComments()
}

async function deleteComment(commentId) {
  if (!auth.user?.id) return

  const c = comments.value.find(x => Number(x.id) === Number(commentId))
  if (!c) return

  // удалять может автор комментария
  if (Number(c.userId) !== Number(auth.user.id)) return

  await commentsApi.remove(commentId)
  await loadComments()
}

onMounted(async () => {
  const idMeal = String(route.params.id || "")
  if (!idMeal) return

  loading.value = true
  try {
    const { data } = await mealdbApi.lookupById(idMeal)
    meal.value = data?.meals?.[0] ?? null

    // подтянуть лайки / сохранённые из db.json, если прокси уже существует
    if (meal.value) {
      await ensureProxy()
      await loadProxyIfExists()
      await loadAuthor()
      await loadComments()
    }


  } finally {
    loading.value = false
  }
})
</script>
