class CommentsApi {
  constructor(instance) {
    this.API = instance
  }

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

  // удалить комментарий
  remove = async (id) => {
    return this.API({
      method: "DELETE",
      url: `/comments/${id}`
    })
  }
}

export default CommentsApi
