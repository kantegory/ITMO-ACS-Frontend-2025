<template>
  <BaseLayout>
    <header class="d-flex justify-content-between align-items-center mb-4">
      <router-link class="btn btn-outline-primary d-inline-flex align-items-center gap-2" to="/">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-arrow-left"></use>
        </svg>
        <span>Назад</span>
      </router-link>

      <button class="btn btn-outline-danger d-inline-flex align-items-center gap-2" @click="onLogout">
        <svg class="svg-icon fill" aria-hidden="true">
          <use href="../../sprite.svg#icon-logout"></use>
        </svg>
        <span>Выйти</span>
      </button>
    </header>

    <div class="card shadow-lg p-4 mb-4">
      <h2 class="h5 mb-1">Профиль</h2>
      <div class="d-flex justify-content-between">
        <p class="text-muted mb-0 mt-3" v-if="me?.name">{{ me.name }}</p>
        <button
          type="button"
          class="btn btn-outline-primary d-inline-flex align-items-center gap-2"
          @click="onToggleTheme"
        >
          <span>Сменить тему</span>
        </button>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-3">
      <button
        type="button"
        class="btn"
        :class="tab === 'saved' ? 'btn-primary' : 'btn-outline-primary'"
        @click="tab = 'saved'"
      >
        Сохранённые рецепты
      </button>

      <button
        type="button"
        class="btn"
        :class="tab === 'liked' ? 'btn-primary' : 'btn-outline-primary'"
        @click="tab = 'liked'"
      >
        Понравилось
      </button>

      <button
        type="button"
        class="btn"
        :class="tab === 'subs' ? 'btn-primary' : 'btn-outline-primary'"
        @click="tab = 'subs'"
      >
        Подписки
      </button>

      <button
        type="button"
        class="btn"
        :class="tab === 'mine' ? 'btn-primary' : 'btn-outline-primary'"
        @click="tab = 'mine'"
      >
        Мои рецепты
      </button>


      <button
        type="button"
        class="btn btn-outline-primary d-inline-flex align-items-center gap-2 ms-auto"
        @click="createOpen = true"
      >
        <span>Создать рецепт</span>
      </button>
    </div>

    <div v-if="loading" class="text-muted">Загрузка...</div>

    <p v-else-if="tab === 'subs' && subscriptions.length === 0" class="text-muted text-center">
      Подписок пока нет
    </p>

    <p v-else-if="tab === 'mine' && myRecipes.length === 0" class="text-muted text-center">
      У вас пока нет рецептов
    </p>

    <p v-else-if="tab !== 'subs' && tab !== 'mine' && tabRecipes.length === 0" class="text-muted text-center">
      Тут пока пусто
    </p>

    <div v-else-if="tab === 'mine'" class="row g-3">
      <div class="col-md-4" v-for="r in myRecipes" :key="r.id">
        <router-link class="text-decoration-none text-dark" :to="`/recipe/${r.id}`">
          <RecipeCard :recipe="r" />
        </router-link>
      </div>
    </div>


    <div v-else-if="tab !== 'subs'" class="row g-3">
      <div class="col-md-4" v-for="r in tabRecipes" :key="r.id">
        <router-link class="text-decoration-none text-dark" :to="`/recipe/${r.id}`">
          <RecipeCard :recipe="r" />
        </router-link>
      </div>
    </div>

    <div v-else class="row g-3">
      <div class="col-md-6" v-for="u in subscriptions" :key="u.id">
        <div class="card shadow-sm p-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link
                class="fw-semibold text-decoration-none"
                :to="`/author/${u.id}`"
              >
                {{ u.name || "Пользователь" }}
              </router-link>
            </div>

            <button class="btn btn-outline-primary btn-sm" @click="toggleSub(u.id)">
              Отписаться
            </button>
          </div>
        </div>
      </div>
    </div>

    <CreateRecipeModal
      :open="createOpen"
      @close="createOpen = false"
      @created="onCreateRecipe"
    />
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import BaseLayout from "@/components/BaseLayout.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import { useAuthStore } from "@/stores/auth"
import { recipesApi, usersApi } from "@/api"
import { useRecipesStore } from "@/stores/recipes"
import { applyTheme } from "@/theme"
import CreateRecipeModal from "@/components/CreateRecipeModal.vue"

const router = useRouter()
const auth = useAuthStore()
const recipesStore = useRecipesStore()

const tab = ref("saved")
const loading = ref(false)

const me = computed(() => auth.user)

const createOpen = ref(false)
const creating = ref(false)

const likedIds = computed(() =>
  (Array.isArray(me.value?.likedRecipeIds) ? me.value.likedRecipeIds : []).map(Number)
)
const savedIds = computed(() =>
  (Array.isArray(me.value?.savedRecipeIds) ? me.value.savedRecipeIds : []).map(Number)
)
const subsIds = computed(() =>
  (Array.isArray(me.value?.subscriptions) ? me.value.subscriptions : []).map(Number)
)

const likedRecipes = ref([])
const savedRecipes = ref([])
const subscriptions = ref([])

const tabRecipes = computed(() => (tab.value === "liked" ? likedRecipes.value : savedRecipes.value))

const myRecipes = computed(() => {
  const myId = Number(me.value?.id)
  if (!myId) return []
  return (Array.isArray(recipesStore.list) ? recipesStore.list : [])
    .filter(r => Number(r?.authorId) === myId)
    .slice()
    .sort((a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0))
})

async function loadRecipesByIds(ids) {
  if (!ids.length) return []
  const items = await Promise.all(
    ids.map(id => recipesApi.getOne(id).then(r => r.data).catch(() => null))
  )
  return items.filter(Boolean)
}

async function loadSubscriptions() {
  if (!subsIds.value.length) {
    subscriptions.value = []
    return
  }
  const users = await Promise.all(
    subsIds.value.map(id => usersApi.getOne(id).then(r => r.data).catch(() => null))
  )
  subscriptions.value = users.filter(Boolean)
}

async function reloadAll() {
  loading.value = true
  try {
    const [saved, liked] = await Promise.all([
      loadRecipesByIds(savedIds.value),
      loadRecipesByIds(likedIds.value)
    ])

    savedRecipes.value = saved
    likedRecipes.value = liked

    await loadSubscriptions()
  } finally {
    loading.value = false
  }
}

async function toggleSub(userId) {
  if (!me.value?.id) return
  const uid = Number(userId)

  const current = Array.isArray(me.value.subscriptions) ? me.value.subscriptions : []
  const set = new Set(current.map(Number))
  set.has(uid) ? set.delete(uid) : set.add(uid)

  const { data } = await usersApi.patch(me.value.id, { subscriptions: Array.from(set) })
  auth.setSession(auth.accessToken, data)
  await loadSubscriptions()
}

async function onToggleTheme() {
  if (!auth.user?.id) return

  const current = auth.user.theme === "dark" ? "dark" : "light"
  const next = current === "dark" ? "light" : "dark"

  applyTheme(next)

  const { data } = await usersApi.patch(auth.user.id, { theme: next })
  auth.setSession(auth.accessToken, data)
}

async function onLogout() {
  await auth.logout()
  await router.replace({ name: "login" })
}

async function onCreateRecipe(payload) {
  if (!auth.user?.id) return

  creating.value = true
  try {
    const body = {
      source: "local",
      name: payload.name,
      photo: payload.photo || "",
      category: payload.category,
      area: payload.area,
      ingredients: payload.ingredients,
      text: payload.instructions,
      instructions: payload.instructions,
      likes: 0,
      authorId: auth.user.id,
      createdAt: Date.now()
    }

    await recipesApi.create(body)
    await recipesStore.load()

    createOpen.value = false
  } finally {
    creating.value = false
  }
}

onMounted(async () => {
  const t = auth.user?.theme
  applyTheme(t === "light" || t === "dark" ? t : null)
  await recipesStore.load()
  await reloadAll()
})

watch([likedIds, savedIds, subsIds], async () => {
  await reloadAll()
})
</script>
