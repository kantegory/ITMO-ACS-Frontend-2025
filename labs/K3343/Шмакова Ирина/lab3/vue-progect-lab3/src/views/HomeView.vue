<template>
  <BaseLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Книга рецептов</h1>
      <button 
        v-if="userStore.isAuthenticated"
        class="btn btn-success"
        @click="$router.push('/create')"
      >
        Добавить рецепт
      </button>
    </div>

    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div 
        class="col" 
        v-for="recipe in recipes" 
        :key="recipe.id"
      >
        <RecipeCard 
          :id="recipe.id"
          :title="recipe.title"
          :description="recipe.description"
          :difficulty="recipe.difficulty"
          :type="recipe.type"
          :image="recipe.image"
        />
      </div>
    </div>

    <!-- соо если рецептов нет -->
    <div v-if="recipesStore.recipes.length === 0" class="alert alert-info mt-4">
      Рецептов пока нет. Будьте первым, кто добавит рецепт!
    </div>
  </BaseLayout>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { computed } from 'vue'
import BaseLayout from '@/layout/BaseLayout.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { useUserStore } from '@/stores/user'
import useRecipesStore from '@/stores/recipes'


export default {
  name: 'HomeView',
  
  components: { BaseLayout, RecipeCard },

  setup() {    
    const recipesStore = useRecipesStore()
    const userStore = useUserStore()

    return {
      recipesStore,
      userStore
    }
  },

  computed: {
    ...mapState(useRecipesStore, ['recipes'])
  },

  methods: {
    ...mapActions(useRecipesStore, ['loadRecipes'])
  },

  mounted() {
    this.loadRecipes()
  }
}
</script>
