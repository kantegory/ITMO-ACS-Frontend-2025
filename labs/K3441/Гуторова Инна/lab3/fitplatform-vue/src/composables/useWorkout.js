import { ref, onMounted } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export function useWorkout(workoutId) {
  const api = useApi()
  const { user, token } = useAuth()

  const workout = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const markedDone = ref(false)
  const scheduleDate = ref(new Date().toISOString().split('T')[0])

  async function loadWorkout(id = workoutId) {
    if (!id) return
    loading.value = true
    error.value = null
    try {
      workout.value = await api.get(`/workouts/${id}`)
    } catch (e) {
      error.value = 'Тренировка не найдена'
    } finally {
      loading.value = false
    }
  }

  async function markDone(id = workoutId) {
    if (!token.value || !user.value) return alert('Доступно только авторизованным пользователям')
    try {
      await api.post('/history', {
        userId: user.value.id,
        workoutId: id,
        date: new Date().toISOString().split('T')[0]
      })
      markedDone.value = true
    } catch (err) {
      console.error(err)
      alert('Ошибка при отметке выполнения')
    }
  }

  async function scheduleWorkout(date, id = workoutId) {
    if (!token.value || !user.value) return alert('Доступно только авторизованным пользователям')
    if (!date) return alert('Выберите дату')
    try {
      await api.post('/planned', {
        userId: user.value.id,
        workoutId: id,
        date
      })
      alert(`Тренировка запланирована на ${date}`)
    } catch (err) {
      console.error(err)
      alert('Ошибка при планировании')
    }
  }

  onMounted(() => loadWorkout())

  return {
    workout,
    loading,
    error,
    markedDone,
    scheduleDate,
    loadWorkout,
    markDone,
    scheduleWorkout
  }
}
