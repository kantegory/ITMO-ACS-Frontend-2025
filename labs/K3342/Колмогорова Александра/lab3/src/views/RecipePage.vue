<template>
  <Navbar />
    <div class="container mt-4">
      <p v-if="error" class="text-danger text-center">{{ error }}</p>
      <p v-if="loading" class="text-muted text-center">Загрузка...</p>

      <recipe-full
        v-if="recipe"
        :recipe="recipe"
        :user="user"
        :is-stared="isStared"
        :comments="comments"
        @favorite="toggleStar"
        @add-comment="addComment"
      />

      <div v-else-if="!loading && !error" class="text-center">
        <p class="text-muted">Рецепт не найден</p>
      </div>
    </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import Navbar from '@/components/Navbar.vue'
import RecipeFull from '@/components/RecipeFull.vue'

import useRecipe from '@/composables/useRecipe'
import useRecipeLocalState from '@/composables/useRecipeLocalState'

export default {
  name: 'RecipePage',

  components: {
    Navbar,
    RecipeFull
  },

  setup() {
    const route = useRoute()
    const { recipe, loading, error, loadRecipeById } = useRecipe()
    
    onMounted(() => {
      if (route.params.id) {
        loadRecipeById(route.params.id)
      }
    })

    const localState = useRecipeLocalState(
      route.params.id,
      recipe.value?.author || ''
    )

    return {
      recipe,
      loading,
      error,
      user: localState.user,
      isStared: localState.isStared,
      comments: localState.comments,
      toggleStar: localState.toggleStar,
      addComment: localState.addComment
    }
  }
}
</script>