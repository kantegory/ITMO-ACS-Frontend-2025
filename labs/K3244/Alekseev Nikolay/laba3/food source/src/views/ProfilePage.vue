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
    </div>

    <div v-if="loading" class="text-muted">Загрузка...</div>

    <p v-else-if="tab === 'subs' && subscriptions.length === 0" class="text-muted text-center">
      Подписок пока нет
    </p>

    <p v-else-if="tab !== 'subs' && tabMeals.length === 0" class="text-muted text-center">
      Тут пока пусто
    </p>

    <div v-else-if="tab !== 'subs'" class="row g-3">
      <div class="col-md-4" v-for="m in tabMeals" :key="m.idMeal">
        <router-link class="text-decoration-none text-dark" :to="`/recipe/${m.idMeal}`">
          <RecipeCard :recipe="m" />
        </router-link>
      </div>
    </div>

    <div v-else class="row g-3">
      <div class="col-md-6" v-for="u in subscriptions" :key="u.id">
        <div class="card shadow-sm p-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-semibold">{{ u.name || "Пользователь" }}</div>
              <div class="text-muted small" v-if="u.email">{{ u.email }}</div>
            </div>

            <button class="btn btn-outline-primary btn-sm" @click="toggleSub(u.id)">
              Отписаться
            </button>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import BaseLayout from "@/components/BaseLayout.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import { useAuthStore } from "@/stores/auth"
import { recipesApi, usersApi } from "@/api"
import { mealdbApi } from "@/api/mealDB"
import { applyTheme } from "@/theme"

const router = useRouter()
const auth = useAuthStore()

const tab = ref("saved")
const loading = ref(false)

const me = computed(() => auth.user)

const likedIds = computed(() =>
  (Array.isArray(me.value?.likedRecipeIds) ? me.value.likedRecipeIds : []).map(Number)
)
const savedIds = computed(() =>
  (Array.isArray(me.value?.savedRecipeIds) ? me.value.savedRecipeIds : []).map(Number)
)
const subsIds = computed(() =>
  (Array.isArray(me.value?.subscriptions) ? me.value.subscriptions : []).map(Number)
)

const likedMeals = ref([])
const savedMeals = ref([])
const subscriptions = ref([])

const tabMeals = computed(() => (tab.value === "liked" ? likedMeals.value : savedMeals.value))

async function loadMealsByProxyIds(proxyIds) {
  // proxyIds — ids из db.json recipes (source:"mealdb")
  const proxies = await Promise.all(
    proxyIds.map(id => recipesApi.getOne(id).then(r => r.data).catch(() => null))
  )

  const mealIds = proxies
    .filter(Boolean)
    .map(p => String(p.mealId || "").trim())
    .filter(Boolean)

  const meals = await Promise.all(
    mealIds.map(mid => mealdbApi.lookupById(mid).then(r => r.data?.meals?.[0] ?? null).catch(() => null))
  )

  return meals.filter(Boolean)
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
      loadMealsByProxyIds(savedIds.value),
      loadMealsByProxyIds(likedIds.value)
    ])

    savedMeals.value = saved
    likedMeals.value = liked

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

onMounted(async () => {
  await reloadAll()
  const t = auth.user?.theme
  applyTheme(t === "light" || t === "dark" ? t : null)
})

watch([likedIds, savedIds, subsIds], async () => {
  await reloadAll()
})
</script>
