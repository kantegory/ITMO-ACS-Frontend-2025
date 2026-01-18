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
      <img :src="recipe.photo" class="object-fit-cover mb-3" :alt="recipe.name" style="width:100%" />

      <h2 class="h4">{{ recipe.name }}</h2>
      <p class="small text-muted">{{ recipe.text }}</p>

      <p><strong>Ингредиенты:</strong> {{ (recipe.ingredients || []).join(", ") }}</p>
      <p><strong>Сложность:</strong> {{ diffLabel }}</p>
      <p><strong>Тип:</strong> {{ typeLabel }}</p>

      <p class="mb-3">
        <strong>Автор:</strong> {{ recipe.author }}
        <button
          v-if="canSubscribe"
          class="btn btn-outline-primary btn-sm ms-2"
          @click="toggleSub"
        >
          {{ isSubscribed ? "Отписаться" : "Подписаться" }}
        </button>
      </p>

      <div class="d-flex flex-wrap gap-2">
        <button class="btn" :class="isSaved ? 'btn-success' : 'btn-outline-success'" @click="toggleSave">
          {{ isSaved ? "Сохранено" : "Сохранить" }}
        </button>

        <button class="btn" :class="isLiked ? 'btn-danger' : 'btn-outline-danger'" @click="toggleLike">
          {{ isLiked ? "Убрать лайк" : "Поставить лайк" }}
        </button>
      </div>

      <div class="mt-3 d-flex align-items-center gap-2">
        <span>{{ recipe.likes || 0 }}</span>
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="/sprite.svg#icon-heart"></use>
        </svg>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import BaseLayout from "@/components/BaseLayout.vue"
import { recipesApi, usersApi } from "@/api"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()
const auth = useAuthStore()

const loading = ref(false)
const recipe = ref(null)

const DIFF = ["Легко", "Средне", "Сложно"]
const TYPE = ["Завтрак", "Обед", "Ужин", "Десерт", "Напиток"]

const id = computed(() => route.params.id)
const me = computed(() => auth.user)

const diffLabel = computed(() => {
  const i = (recipe.value?.difficulty || 1) - 1
  return DIFF[i] || "—"
})

const typeLabel = computed(() => {
  const i = (recipe.value?.type || 1) - 1
  return TYPE[i] || "—"
})

const isSaved = computed(() => {
  const set = new Set((me.value?.savedRecipeIds || []).map(Number))
  return set.has(Number(recipe.value?.id))
})

const isLiked = computed(() => {
  const set = new Set((me.value?.likedRecipeIds || []).map(Number))
  return set.has(Number(recipe.value?.id))
})

const canSubscribe = computed(() => {
  const authorId = Number(recipe.value?.authorId)
  const myId = Number(me.value?.id)
  return Boolean(me.value && authorId && myId && authorId !== myId)
})

const isSubscribed = computed(() => {
  const set = new Set((me.value?.subscriptions || []).map(Number))
  return set.has(Number(recipe.value?.authorId))
})

onMounted(async () => {
  await load()
})

async function load() {
  loading.value = true
  try {
    const { data } = await recipesApi.getOne(id.value)
    recipe.value = data
  } finally {
    loading.value = false
  }
}

async function patchMe(patch) {
  if (!me.value?.id) return null
  const { data } = await usersApi.patch(me.value.id, patch)
  auth.setSession(auth.accessToken, data)
  return data
}

async function toggleSave() {
  const rid = Number(recipe.value.id)
  const current = Array.isArray(me.value?.savedRecipeIds) ? me.value.savedRecipeIds : []
  const set = new Set(current.map(Number))
  set.has(rid) ? set.delete(rid) : set.add(rid)
  await patchMe({ savedRecipeIds: Array.from(set) })
}

async function toggleLike() {
  const rid = Number(recipe.value.id)
  const liked = Array.isArray(me.value?.likedRecipeIds) ? me.value.likedRecipeIds : []
  const set = new Set(liked.map(Number))

  let nextLikes = Number(recipe.value.likes || 0)
  if (set.has(rid)) {
    set.delete(rid)
    nextLikes = Math.max(0, nextLikes - 1)
  } else {
    set.add(rid)
    nextLikes = nextLikes + 1
  }

  await patchMe({ likedRecipeIds: Array.from(set) })
  const { data } = await recipesApi.patch(recipe.value.id, { likes: nextLikes })
  recipe.value = data
}

async function toggleSub() {
  const aid = Number(recipe.value.authorId)
  const current = Array.isArray(me.value?.subscriptions) ? me.value.subscriptions : []
  const set = new Set(current.map(Number))
  set.has(aid) ? set.delete(aid) : set.add(aid)
  await patchMe({ subscriptions: Array.from(set) })
}
</script>
