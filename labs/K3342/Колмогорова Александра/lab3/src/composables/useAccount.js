import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000'

export function useAccount() {
  const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
  const recipes = ref([])
  const staredRecipes = ref([])

  const token = localStorage.getItem('accessToken')

  async function loadProfile() {
    if (!user.value.id || !token) return

    const res = await fetch(`${API_URL}/users/${user.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    user.value = data
    recipes.value = data.recipes || []
    localStorage.setItem('user', JSON.stringify(data))
  }

  async function updateProfile(payload) {
    const res = await fetch(`${API_URL}/users/${user.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    const updated = await res.json()
    user.value = updated
    localStorage.setItem('user', JSON.stringify(updated))
  }

  async function createRecipe(recipe) {
    const updatedRecipes = [...recipes.value, recipe]

    await updateProfile({ recipes: updatedRecipes })
    recipes.value = updatedRecipes
  }

  async function deleteRecipe(recipeId) {
    const updated = recipes.value.filter(r => r.id !== recipeId)
    await updateProfile({ recipes: updated })
    recipes.value = updated
  }

  onMounted(loadProfile)

  return {
    user,
    recipes,
    staredRecipes,
    updateProfile,
    createRecipe,
    deleteRecipe
  }
}
