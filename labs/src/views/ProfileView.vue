<template>
  <AppNavbar />

  <div class="container mt-4">
    <h1>Мой кабинет</h1>

    <!-- Блок входа (если не авторизован) -->
    <div v-if="!username" class="card mb-4">
      <div class="card-body text-center">
        <h5>Войдите в аккаунт</h5>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#authModal">
          Войти / Зарегистрироваться
        </button>
      </div>
    </div>

    <!-- Профиль после входа -->
    <div v-else>
      <h4>Привет, {{ username }}!</h4>
      <button @click="handleLogout" class="btn btn-outline-danger mb-4">Выйти</button>

      <!-- Форма добавления рецепта -->
      <div class="card mt-4">
        <div class="card-body">
          <h5>Добавить свой рецепт</h5>
          <form @submit.prevent="handleAddRecipe">
            <div class="mb-3">
              <label class="form-label">Название</label>
              <input v-model="newTitle" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Краткое описание</label>
              <textarea v-model="newShort" class="form-control" rows="2"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Время приготовления (минуты)</label>
              <input v-model.number="newTime" type="number" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Сложность</label>
              <select v-model="newDifficulty" class="form-select">
                <option>Легко</option>
                <option>Средне</option>
                <option>Сложно</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Ингредиенты (каждый с новой строки)</label>
              <textarea v-model="newIngredients" class="form-control" rows="5" required></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Шаги (каждый с новой строки)</label>
              <textarea v-model="newSteps" class="form-control" rows="6" required></textarea>
            </div>
            <button type="submit" class="btn btn-success w-100" :disabled="addLoading">
              {{ addLoading ? 'Публикация...' : 'Опубликовать рецепт' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Мои рецепты -->
      <div class="mt-4">
        <h4>Мои рецепты</h4>
        <div v-if="myRecipesLoading" class="text-center">Загрузка...</div>
        <div v-else-if="myRecipes.length === 0" class="text-muted">У тебя пока нет своих рецептов</div>
        <div v-else class="row">
          <div v-for="r in myRecipes" :key="r.id" class="col-md-6 mb-3">
            <div class="card">
              <div class="card-body">
                <h5>{{ r.title }}</h5>
                <p class="small text-muted">{{ r.short || '' }}</p>
                <small>Время: {{ r.time }} мин • {{ r.difficulty }}</small>
                <div class="mt-3">
                  <router-link :to="{ name: 'recipe', params: { id: r.id } }" class="btn btn-sm btn-outline-primary">
                    Открыть
                  </router-link>
                  <button @click="handleDelete(r.id)" class="btn btn-sm btn-outline-danger ms-2" :disabled="deleteLoading">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка авторизации -->
    <AuthModal />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AuthModal from '@/components/AuthModal.vue'
import { useUser } from '@/composables/useUser.js'
import { useApi } from '@/composables/useApi.js'

const { username, updateUser } = useUser()
const { getRecipes, addRecipe, deleteRecipe } = useApi()

const myRecipes = ref([])
const myRecipesLoading = ref(true)

const newTitle = ref('')
const newShort = ref('')
const newTime = ref('')
const newDifficulty = ref('Легко')
const newIngredients = ref('')
const newSteps = ref('')
const addLoading = ref(false)
const deleteLoading = ref(false)

// Загрузка своих рецептов
const loadMyRecipes = async () => {
  if (!username.value) return
  myRecipesLoading.value = true
  const all = await getRecipes(`?author=${username.value}`)
  myRecipes.value = all
  myRecipesLoading.value = false
}

onMounted(() => {
  loadMyRecipes()
})

// Выход
const handleLogout = () => {
  if (confirm('Выйти из аккаунта?')) {
    updateUser(null)
    myRecipes.value = []
  }
}

// Добавление рецепта
const handleAddRecipe = async () => {
  addLoading.value = true
  const ingredients = newIngredients.value.trim().split('\n').map(i => i.trim()).filter(i => i)
  const steps = newSteps.value.trim().split('\n').map(s => s.trim()).filter(s => s)

  const newRec = {
    title: newTitle.value.trim(),
    short: newShort.value.trim(),
    time: Number(newTime.value),
    difficulty: newDifficulty.value,
    image: 'assets/img/example.jpg',  // можно потом улучшить
    ingredients,
    steps,
    author: username.value
  }

  try {
    await addRecipe(newRec)
    alert('Рецепт добавлен!')
    // Сброс формы
    newTitle.value = ''
    newShort.value = ''
    newTime.value = ''
    newDifficulty.value = 'Легко'
    newIngredients.value = ''
    newSteps.value = ''
    await loadMyRecipes()
  } catch (e) {
    alert('Ошибка при добавлении')
  } finally {
    addLoading.value = false
  }
}

// Удаление
const handleDelete = async (id) => {
  if (!confirm('Ты уверен, что хочешь удалить этот рецепт навсегда?')) return
  deleteLoading.value = true
  try {
    await deleteRecipe(id)
    alert('Рецепт успешно удален!')
    await loadMyRecipes()
  } catch (e) {
    alert('Ошибка при удалении')
  } finally {
    deleteLoading.value = false
  }
}
</script>