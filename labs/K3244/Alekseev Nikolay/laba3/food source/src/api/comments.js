// src/api/comments.js
class CommentsApi {
  constructor(instance) {
    this.API = instance
  }

  // получить комментарии к рецепту (recipeId = id прокси-рецепта в db.json)
  getByRecipe = async (recipeId) => {
    return this.API({
      url: "/comments",
      params: {
        recipeId,
        _expand: "user",
        _sort: "createdAt",
        _order: "desc"
      }
    })
  }

  // создать комментарий
  create = async (data) => {
    return this.API({
      method: "POST",
      url: "/comments",
      data,
      headers: { "Content-Type": "application/json" }
    })
  }

  // (опционально) удалить комментарий
  remove = async (id) => {
    return this.API({
      method: "DELETE",
      url: `/comments/${id}`
    })
  }
}

export default CommentsApi
