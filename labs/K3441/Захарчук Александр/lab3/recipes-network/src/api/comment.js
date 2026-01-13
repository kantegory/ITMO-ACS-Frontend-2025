import apiClient from ".";

class CommentService {
  constructor(client) {
    this.client = client;
    this.prefix = "/comments";
  }

  async getByRecipeId(recipeId) {
    return await this.client.get(`${this.prefix}/recipe/${recipeId}`);
  }

  async create(recipeId, commentText) {
    return await this.client.post(this.prefix, {recipe_id: recipeId, text: commentText});
  }
}

const commentService = new CommentService(apiClient);
export default commentService;
