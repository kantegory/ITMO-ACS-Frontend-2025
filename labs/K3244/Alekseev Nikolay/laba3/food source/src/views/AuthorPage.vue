<template>
  <BaseLayout>
    <header class="d-flex justify-content-between align-items-center mb-4">
      <router-link class="btn btn-outline-primary d-inline-flex align-items-center gap-2" to="/">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-arrow-left"></use>
        </svg>
        <span>Назад</span>
      </router-link>

      <router-link class="btn btn-outline-primary d-inline-flex align-items-center gap-2" to="/profile">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-user"></use>
        </svg>
        <span>Профиль</span>
      </router-link>
    </header>

    <div v-if="loading" class="text-muted">Загрузка...</div>

    <div v-else>
      <div class="card shadow-sm p-3 mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-1 d-flex">{{ author?.name || "Автор" }}</h2>
          <button
            v-if="canSubscribe"
            class="btn btn-outline-primary flex-inline"
            @click="toggleSub"
          >
            {{ isSubscribed ? "Отписаться" : "Подписаться" }}
          </button>
        </div>
      </div>

      <p v-if="authorRecipes.length === 0" class="text-muted text-center">
        У автора пока нет рецептов
      </p>

      <div v-else class="row g-3">
        <div class="col-md-4" v-for="r in authorRecipes" :key="r.id">
          <router-link class="text-decoration-none text-dark" :to="`/recipe/${r.id}`">
            <RecipeCard :recipe="r" />
          </router-link>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import BaseLayout from "@/components/BaseLayout.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import { usersApi } from "@/api"
import { useRecipesStore } from "@/stores/recipes"
import { useAuthStore } from "@/stores/auth"


const route = useRoute()
const recipesStore = useRecipesStore()

const loading = ref(false)
const author = ref(null)

const auth = useAuthStore()
const me = computed(() => auth.user)


const authorId = computed(() => Number(route.params.id))

const authorRecipes = computed(() => {
  const aid = Number(authorId.value)
  if (!aid) return []
  return (Array.isArray(recipesStore.list) ? recipesStore.list : [])
    .filter(r => Number(r?.authorId) === aid)
    .slice()
    .sort((a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0))
})

const canSubscribe = computed(() => {
  const myId = Number(me.value?.id)
  const aid = Number(authorId.value)
  if (!myId || !aid) return false
  if (myId === aid) return false
  return true
})

const isSubscribed = computed(() => {
  const set = new Set((me.value?.subscriptions || []).map(Number))
  return set.has(Number(authorId.value))
})

async function toggleSub() {
  if (!me.value?.id) return
  const aid = Number(authorId.value)
  if (!aid) return

  const current = Array.isArray(me.value.subscriptions)
    ? me.value.subscriptions
    : []

  const set = new Set(current.map(Number))
  set.has(aid) ? set.delete(aid) : set.add(aid)

  const { data } = await usersApi.patch(me.value.id, {
    subscriptions: Array.from(set)
  })

  auth.setSession(auth.accessToken, data)
}

onMounted(async () => {
  const aid = Number(authorId.value)
  if (!aid) return

  loading.value = true
  try {
    if (!recipesStore.list.length) await recipesStore.load()

    const { data } = await usersApi.getOne(aid)
    author.value = data || null
  } finally {
    loading.value = false
  }
})
</script>
