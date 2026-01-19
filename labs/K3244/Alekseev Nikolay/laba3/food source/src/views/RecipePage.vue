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

    <div v-else-if="!recipe" class="text-muted text-center">
      Рецепт не найден
    </div>

    <div v-else class="card shadow-lg p-4">
      <img
        v-if="recipe.photo"
        :src="recipe.photo"
        :alt="recipe.name"
        class="object-fit-contain mb-3"
        style="max-height: 30vh; width: 100%;"
      />

      <h2 class="h4">{{ recipe.name }}</h2>

      <p class="small text-muted" style="white-space: pre-line;">
        {{ recipe.text }}
      </p>

      <p v-if="(recipe.ingredients || []).length">
        <strong>Ингредиенты:</strong>
        {{ (recipe.ingredients || []).join(", ") }}
      </p>

      <p v-if="recipe.category">
        <strong>Категория:</strong> {{ recipe.category }}
      </p>

      <p v-if="recipe.area">
        <strong>Кухня:</strong> {{ recipe.area }}
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
        <span>{{ recipe.likes || 0 }}</span>
        <svg class="svg-icon fill icon-heart" aria-hidden="true">
          <use href="../../sprite.svg#icon-heart"></use>
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
import { recipesApi, usersApi, commentsApi } from "@/api"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()
const auth = useAuthStore()

const me = computed(() => auth.user)

const loading = ref(false)
const recipe = ref(null)
const author = ref(null)

const comments = ref([])
const commentText = ref("")
const commentsLoading = ref(false)

const canSubscribe = computed(() => {
  const authorId = Number(recipe.value?.authorId)
  const myId = Number(me.value?.id)
  if (!me.value || !authorId || !myId) return false
  if (authorId === myId) return false
  return true
})

const isSubscribed = computed(() => {
  const set = new Set((me.value?.subscriptions || []).map(Number))
  return set.has(Number(recipe.value?.authorId))
})

const isSaved = computed(() => {
  const set = new Set((me.value?.savedRecipeIds || []).map(Number))
  return set.has(Number(recipe.value?.id))
})

const isLiked = computed(() => {
  const set = new Set((me.value?.likedRecipeIds || []).map(Number))
  return set.has(Number(recipe.value?.id))
})

async function patchMe(patch) {
  if (!me.value?.id) return null
  const { data } = await usersApi.patch(me.value.id, patch)
  auth.setSession(auth.accessToken, data)
  return data
}

async function loadAuthor() {
  const aid = Number(recipe.value?.authorId)
  if (!aid) {
    author.value = null
    return
  }
  const { data } = await usersApi.getOne(aid)
  author.value = data
}

async function toggleSub() {
  const aid = Number(recipe.value?.authorId)
  if (!aid) return
  if (!me.value?.id) return

  const current = Array.isArray(me.value?.subscriptions) ? me.value.subscriptions : []
  const set = new Set(current.map(Number))
  set.has(aid) ? set.delete(aid) : set.add(aid)

  await patchMe({ subscriptions: Array.from(set) })
}

async function toggleSave() {
  if (!me.value?.id) return
  const rid = Number(recipe.value?.id)
  if (!rid) return

  const current = Array.isArray(me.value?.savedRecipeIds) ? me.value.savedRecipeIds : []
  const set = new Set(current.map(Number))
  set.has(rid) ? set.delete(rid) : set.add(rid)

  await patchMe({ savedRecipeIds: Array.from(set) })
}

async function toggleLike() {
  if (!me.value?.id) return
  const rid = Number(recipe.value?.id)
  if (!rid) return

  const current = Array.isArray(me.value?.likedRecipeIds) ? me.value.likedRecipeIds : []
  const set = new Set(current.map(Number))

  const has = set.has(rid)
  has ? set.delete(rid) : set.add(rid)

  await patchMe({ likedRecipeIds: Array.from(set) })

  const nextLikes = Math.max(0, Number(recipe.value.likes || 0) + (has ? -1 : 1))
  const { data: updatedRecipe } = await recipesApi.patch(rid, { likes: nextLikes })
  recipe.value = updatedRecipe
}

async function loadComments() {
  const rid = Number(recipe.value?.id)
  if (!rid) return

  commentsLoading.value = true
  try {
    const { data } = await commentsApi.getByRecipe(rid)
    comments.value = Array.isArray(data) ? data : []
  } finally {
    commentsLoading.value = false
  }
}

async function addComment() {
  if (!auth.user?.id) return
  if (!commentText.value.trim()) return
  const rid = Number(recipe.value?.id)
  if (!rid) return

  await commentsApi.create({
    recipeId: rid,
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
  if (Number(c.userId) !== Number(auth.user.id)) return

  await commentsApi.remove(commentId)
  await loadComments()
}

onMounted(async () => {
  const rid = Number(route.params.id)
  if (!rid) return

  loading.value = true
  try {
    const { data } = await recipesApi.getOne(rid)
    recipe.value = data || null

    if (recipe.value) {
      await loadAuthor()
      await loadComments()
    }
  } finally {
    loading.value = false
  }
})
</script>
