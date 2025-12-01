export default class User {
  constructor({ id, name, savedRecipes = [], myRecipes = [] }) {
    this.id = id
    this.name = name
    this.savedRecipes = savedRecipes
    this.myRecipes = myRecipes
  }

  saveRecipe(recipeId) {
    if (!this.savedRecipes.includes(recipeId)) {
      this.savedRecipes.push(recipeId)
    }
  }

  unsaveRecipe(recipeId) {
    this.savedRecipes = this.savedRecipes.filter(id => id !== recipeId)
  }

  isRecipeSaved(recipeId) {
    return this.savedRecipes.includes(recipeId)
  }

  getMyRecipes(allRecipes) {
    return allRecipes.filter(r => r.authorId === this.id)
  }

  getSavedRecipes(allRecipes) {
    return allRecipes.filter(r => this.savedRecipes.includes(r.id))
  }
}
