import { ref } from 'vue'
import { useApi } from './useApi'

export function useProfile(userId) {
  const api = useApi()

  const stats = ref({
    progress: 0,
    workouts: 0,
    hours: 0
  })

  const history = ref([])
  const planned = ref([])

async function loadStats() {
  const fullUser = await api.get(`/users/${userId}`)
  if (fullUser.stats) {
    stats.value = fullUser.stats
  }
}

async function loadWorkouts() {
  const workouts = await api.get('/workouts')

  const historyData = await api.get(`/history?userId=${userId}`)
  history.value = historyData.map(h => ({
    ...h,
    title: workouts.find(w => w.id === h.workoutId)?.title || 'Неизвестно'
  }))

  const plannedData = await api.get(`/planned?userId=${userId}`)
  planned.value = plannedData.map(p => ({
    ...p,
    title: workouts.find(w => w.id === p.workoutId)?.title || 'Неизвестно'
  }))
}

async function removeItem(type, id) {
  try {
    await api.del(`/${type}/${id}`)
    if (type === 'history') {
      history.value = history.value.filter(i => i.id !== id)
    } else {
      planned.value = planned.value.filter(i => i.id !== id)
    }
  } catch (e) {
    alert('Не удалось удалить запись')
  }
}

  return {
    stats,
    history,
    planned,
    loadStats,
    loadWorkouts,
    removeItem
  }
}