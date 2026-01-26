<template>
  <div class="card mb-4">
    <img :src="imageSrc" class="card-img-top" alt="Рецепт" id="recipeImage">
    <div class="card-body">
      <h1 class="card-title">{{ recipe.title }}</h1>
      <div class="d-flex justify-content-between mb-3">
        <div>
          <span class="badge bg-secondary">{{ recipe.type }}</span>
          <span class="badge bg-info ms-2">{{ recipe.difficulty }}</span>
        </div>
        <div>
          <button class="btn btn-outline-primary me-2" @click="toggleLikeHandler">
            <i class="bi bi-heart"></i> Нравится ({{ recipe.likes }})
          </button>
          <button class="btn btn-outline-success" @click="saveRecipeHandler">Сохранить</button>
        </div>
      </div>
      
      <h5>Ингредиенты:</h5>
      <ul class="list-group list-group-flush mb-4">
        <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="list-group-item">
          {{ ingredient }}
        </li>
      </ul>
      
      <h5>Шаги приготовления:</h5>
      <div>
        <div v-for="(step, index) in recipe.instructions" :key="index" class="mb-3">
          <h6>Шаг {{ index + 1 }}</h6>
          <p>{{ step }}</p>
        </div>
      </div>
      
      <div v-if="recipe.videoUrl" class="mt-4">
        <h5>Видео-инструкция:</h5>
        <div class="ratio ratio-16x9">
          <iframe :src="recipe.videoUrl" title="Видео рецепта"></iframe>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Комментарии -->
  <div class="card">
    <div class="card-header">
      <h5>Комментарии</h5>
    </div>
    <div class="card-body comment-section">
      <div v-if="comments.length === 0" class="text-muted">Комментариев пока нет</div>
      <div v-else>
        <div v-for="comment in comments" :key="comment.id" class="border-bottom pb-2 mb-2">
          <strong>{{ comment.author }}</strong>
          <p class="mb-1">{{ comment.text }}</p>
          <small class="text-muted">{{ new Date(comment.date).toLocaleString() }}</small>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="input-group">
        <input v-model="newComment" type="text" class="form-control" placeholder="Оставьте комментарий...">
        <button class="btn btn-primary" @click="addCommentHandler">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../composables/useApi'

export default {
  name: 'RecipeDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const recipe = ref({})
    const comments = ref([])
    const newComment = ref('')
    const imageSrc = 'https://cdn-icons-png.flaticon.com/512/4345/4345581.png'
    
    const { getRecipeById, getCommentsByRecipeId, addComment, toggleLike, saveRecipe, getCurrentUser } = useApi()
    
    const loadRecipe = async () => {
      try {
        recipe.value = await getRecipeById(props.id)
      } catch (error) {
        console.error('Ошибка загрузки рецепта:', error.message)
      }
    }
    
    const loadComments = async () => {
      try {
        comments.value = await getCommentsByRecipeId(props.id)
      } catch (error) {
        console.error('Ошибка загрузки комментариев:', error.message)
      }
    }
    
    const addCommentHandler = async () => {
      if (!newComment.value.trim()) return
      
      try {
        await addComment(props.id, newComment.value)
        newComment.value = ''
        await loadComments()
      } catch (error) {
        console.error('Ошибка добавления комментария:', error.message)
      }
    }
    
    const toggleLikeHandler = async () => {
      try {
        await toggleLike(props.id)
        recipe.value.likes += 1
      } catch (error) {
        console.error('Ошибка лайка:', error.message)
      }
    }
    
    const saveRecipeHandler = async () => {
      try {
        const user = await getCurrentUser()
        await saveRecipe(user.id, props.id)
        alert('Рецепт сохранен!')
      } catch (error) {
        console.error('Ошибка сохранения:', error.message)
      }
    }
    
    onMounted(async () => {
      await loadRecipe()
      await loadComments()
    })
    
    return {
      recipe,
      comments,
      newComment,
      imageSrc,
      addCommentHandler,
      toggleLikeHandler,
      saveRecipeHandler
    }
  }
}
</script>