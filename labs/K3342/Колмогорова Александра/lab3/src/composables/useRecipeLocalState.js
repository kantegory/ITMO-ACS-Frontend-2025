import { computed } from 'vue'

const getLS = (key) => JSON.parse(localStorage.getItem(key) || '{}')
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export default function useRecipeLocalState(recipeId, author) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const isStared = computed(() => {
    const star = getLS('userStared')
    return star[user.id]?.includes(recipeId) || false
  })

  const comments = computed(() => {
    return getLS('recipeComments')[recipeId] || []
  })

  const toggleStar = () => {
    const star = getLS('userStared')
    star[user.id] = star[user.id] || []

    star[user.id] = isStared.value
      ? star[user.id].filter(id => id !== recipeId)
      : [...star[user.id], recipeId]

    setLS('userStared', star)
  }

  const addComment = (text) => {
    if (!text.trim()) return

    const all = getLS('recipeComments')
    all[recipeId] = all[recipeId] || []

    all[recipeId].push({
      user: user.username || 'Гость',
      text,
      timestamp: new Date().toISOString()
    })

    setLS('recipeComments', all)
  }

  return {
    user,
    isStared,
    comments,
    toggleStar,
    addComment
  }
}
