<template>
  <BaseLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <router-link class="btn btn-outline-primary d-inline-flex align-items-center gap-2" to="/">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-arrow-left"></use>
        </svg>
        <span>Назад к списку</span>
      </router-link>

      <button class="btn btn-outline-danger d-inline-flex align-items-center gap-2" @click="logout">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-logout"></use>
        </svg>
        <span>Выйти</span>
      </button>
    </div>

    <h2 class="mb-3">Профиль: {{ me?.name || "" }}</h2>

    <div class="d-flex gap-2 mb-4">
      <button class="btn btn-outline-secondary" @click="toggleTheme">
        Тема: {{ me?.theme === "dark" ? "тёмная" : "светлая" }}
      </button>
    </div>

    <h4>Мои рецепты</h4>
    <div class="row g-3 mb-5">
      <div class="col-md-4" v-for="r in myRecipes" :key="r.id">
        <router-link class="text-decoration-none text-dark" :to="`/recipe/${r.id}`">
          <RecipeCard :recipe="r" />
        </router-link>
      </div>
    </div>

    <h4>Сохранённые рецепты</h4>
    <div class="row g-3">
      <div class="col-md-4" v-for="r in savedRecipes" :key="r.id">
        <router-link class="text-decoration-none text-dark" :to="`/recipe/${r.id}`">
          <RecipeCard :recipe="r" />
        </router-link>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import BaseLayout from "@/components/BaseLayout.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import { useAuthStore } from "@/stores/auth"
import { useRecipesStore } from "@/stores/recipes"
import { usersApi } from "@/api"

const router = useRouter()
const auth = useAuthStore()
const store = useRecipesStore()

const me = computed(() => auth.user)

const myRecipes = computed(() => {
  const myId = Number(me.value?.id)
  return store.list.filter(r => Number(r.authorId) === myId)
})

const savedRecipes = computed(() => {
  const ids = new Set((me.value?.savedRecipeIds || []).map(Number))
  return store.list.filter(r => ids.has(Number(r.id)))
})

function applyTheme(theme) {
  const t = theme === "dark" ? "dark" : "light"
  document.documentElement.dataset.theme = t
}

onMounted(async () => {
  applyTheme(me.value?.theme)
  if (!store.list.length) await store.load()
})

function logout() {
  auth.logout()
  router.push("/login")
}

async function toggleTheme() {
  if (!me.value?.id) return
  const next = me.value.theme === "dark" ? "light" : "dark"
  const { data } = await usersApi.patch(me.value.id, { theme: next })
  auth.setSession(auth.accessToken, data)
  applyTheme(next)
}
</script>
