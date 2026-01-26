<template>
  <div>
    <div class="profile-header p-4 rounded mb-4">
      <div class="row">
        <div class="col-md-3">
          <img :src="imageSrc" class="rounded-circle img-fluid" alt="Аватар">
        </div>
        <div class="col-md-9">
          <h2>{{ user.name }}</h2>
          <p class="text-muted">{{ user.email }}</p>
          <div class="d-flex gap-2">
            <span class="badge bg-primary">Рецептов: {{ recipeCount }}</span>
            <span class="badge bg-success">Подписчиков: 0</span>
            <span class="badge bg-info">Подписан: 0</span>
          </div>
        </div>
      </div>
    </div>
    
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'saved' }" href="#" @click.prevent="activeTab = 'saved'">
          Сохраненные рецепты
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'published' }" href="#" @click.prevent="activeTab = 'published'">
          Мои публикации
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'publish' }" href="#" @click.prevent="openPublishModal">
          Опубликовать рецепт
        </a>
      </li>
    </ul>
    
    <div v-if="activeTab === 'saved'" class="tab-content">
      <RecipeList :recipes="savedRecipes" />
    </div>
    
    <div v-if="activeTab === 'published'" class="tab-content">
      <RecipeList :recipes="publishedRecipes" />
    </div>
    
    <div v-if="activeTab === 'publish'" class="tab-content">
      <RecipeForm @recipe-published="onRecipePublished" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import RecipeList from './RecipeList.vue'
import RecipeForm from './RecipeForm.vue'

export default {
  name: 'Profile',
  components: {
    RecipeList,
    RecipeForm
  },
  setup() {
    const user = ref({})
    const savedRecipes = ref([])
    const publishedRecipes = ref([])
    const recipeCount = ref(0)
    const activeTab = ref('saved')
    const imageSrc = 'https://cdn-icons-png.flaticon.com/512/4345/4345581.png'
    
    const { getCurrentUser, getUserSavedRecipes, getUserPublishedRecipes } = useApi()
    
    const loadProfileData = async () => {
      try {
        user.value = await getCurrentUser()
        
        // Загрузка сохраненных рецептов
        savedRecipes.value = await getUserSavedRecipes(user.value.id)
        
        // Загрузка опубликованных рецептов
        publishedRecipes.value = await getUserPublishedRecipes(user.value.id)
        recipeCount.value = publishedRecipes.value.length
      } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error.message)
      }
    }
    
    const openPublishModal = () => {
      activeTab.value = 'publish'
    }
    
    const onRecipePublished = () => {
      // После публикации рецепта переключаемся на вкладку "мои публикации"
      activeTab.value = 'published'
      loadProfileData() // Обновляем данные
    }
    
    onMounted(loadProfileData)
    
    return {
      user,
      savedRecipes,
      publishedRecipes,
      recipeCount,
      activeTab,
      imageSrc,
      openPublishModal,
      onRecipePublished
    }
  }
}
</script>