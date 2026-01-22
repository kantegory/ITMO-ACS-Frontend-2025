import { ref, computed } from 'vue'

// Ключ в localStorage — как в твоей ЛР2
const LIKES_KEY = 'recipes_likes'

const likes = ref(loadLikes())

function loadLikes() {
  try {
    const data = localStorage.getItem(LIKES_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveLikes() {
  localStorage.setItem(LIKES_KEY, JSON.stringify(likes.value))
}

export function useLikes() {
  // Получить количество лайков для конкретного рецепта
  const getLikesCount = (recipeId) => {
    return likes.value[recipeId] || 0
  }

  // Лайкнули ли мы этот рецепт
  const isLiked = (recipeId) => {
    return !!likes.value[recipeId]
  }

  // Переключить лайк 
  const toggleLike = (recipeId) => {
    const id = String(recipeId) // на всякий случай приводим к строке

    if (likes.value[id]) {
      // Если уже лайкнули - убираем
      delete likes.value[id]
    } else {
      // Ставим лайк 
      likes.value[id] = (likes.value[id] || 0) + 1
    }

    saveLikes()
  }

  return {
    getLikesCount,
    isLiked,
    toggleLike
  }
}