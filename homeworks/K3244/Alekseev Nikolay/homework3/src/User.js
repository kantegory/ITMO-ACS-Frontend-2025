export default class User {
  constructor({ id, name, savedRecipes = [], myRecipes = [], likedRecipes = [], subscriptions = [], theme = "light" }) {
    this.id = id
    this.name = name
    this.savedRecipes = savedRecipes
    this.myRecipes = myRecipes
    this.likedRecipes = likedRecipes
    this.subscriptions = subscriptions
    this.theme = theme  
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

  likeRecipe(recipeId) {
    if (!this.likedRecipes.includes(recipeId)) this.likedRecipes.push(recipeId)
  }

  unlikeRecipe(recipeId) {
    this.likedRecipes = this.likedRecipes.filter(id => id !== recipeId)
  }

  isRecipeLiked(recipeId) {
    return this.likedRecipes.includes(recipeId)
  }

  subscribe(authorId) {
    if (!this.subscriptions.includes(authorId)) this.subscriptions.push(authorId)
  }

  unsubscribe(authorId) {
    this.subscriptions = this.subscriptions.filter(id => id !== authorId)
  }

  isSubscribed(authorId) {
    return this.subscriptions.includes(authorId)
  }

  getMyRecipes(allRecipes) {
    return allRecipes.filter(r => r.authorId === this.id)
  }

  getSavedRecipes(allRecipes) {
    return allRecipes.filter(r => this.savedRecipes.includes(r.id))
  }
}
