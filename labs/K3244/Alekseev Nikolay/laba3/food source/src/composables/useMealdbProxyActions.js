import { computed, ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { usersApi, recipesApi, mealdbProxyApi } from "@/api"

function uniq(arr) {
  return Array.from(new Set(arr))
}

export function useMealdbProxyActions(mealRef) {
  const auth = useAuthStore()

  const proxy = ref(null)
  const likes = computed(() => Number(proxy.value?.likes || 0))

  const proxyId = computed(() => proxy.value?.id ?? null)

  const isLiked = computed(() => {
    if (!proxyId.value) return false
    const arr = Array.isArray(auth.user?.likedRecipeIds) ? auth.user.likedRecipeIds : []
    return arr.map(Number).includes(Number(proxyId.value))
  })

  const isSaved = computed(() => {
    if (!proxyId.value) return false
    const arr = Array.isArray(auth.user?.savedRecipeIds) ? auth.user.savedRecipeIds : []
    return arr.map(Number).includes(Number(proxyId.value))
  })

  async function loadProxyIfExists() {
    const mealId = mealRef.value?.idMeal
    if (!mealId) return
    try {
      const { data } = await mealdbProxyApi.getProxy(mealId)
      proxy.value = data
    } catch (e) {
    }
  }

  async function ensureProxy() {
    if (proxy.value?.id) return proxy.value

    const m = mealRef.value
    const payload = {
      mealId: String(m.idMeal),
      name: m.strMeal || "",
      photo: m.strMealThumb || "",
      category: m.strCategory || "",
      area: m.strArea || ""
    }

    const { data } = await mealdbProxyApi.upsertProxy(payload)
    proxy.value = data
    return data
  }

  async function toggleSave() {
    if (!auth.user?.id) return

    const r = await ensureProxy()
    const id = Number(r.id)

    const current = Array.isArray(auth.user.savedRecipeIds) ? auth.user.savedRecipeIds.map(Number) : []
    const has = current.includes(id)
    const next = has ? current.filter(x => x !== id) : uniq([...current, id])

    const { data: updatedUser } = await usersApi.patch(auth.user.id, { savedRecipeIds: next })
    auth.user = updatedUser
  }

  async function toggleLike() {
    if (!auth.user?.id) return

    const r = await ensureProxy()
    const id = Number(r.id)

    const liked = Array.isArray(auth.user.likedRecipeIds) ? auth.user.likedRecipeIds.map(Number) : []
    const has = liked.includes(id)
    const nextLiked = has ? liked.filter(x => x !== id) : uniq([...liked, id])

    const { data: updatedUser } = await usersApi.patch(auth.user.id, { likedRecipeIds: nextLiked })
    auth.user = updatedUser

    const nextLikes = Math.max(0, Number(r.likes || 0) + (has ? -1 : 1))
    const { data: updatedRecipe } = await recipesApi.patch(id, { likes: nextLikes })
    proxy.value = updatedRecipe
  }

  return {
    proxy,
    likes,
    isLiked,
    isSaved,
    loadProxyIfExists,
    ensureProxy,
    toggleLike,
    toggleSave
  }
  
}
