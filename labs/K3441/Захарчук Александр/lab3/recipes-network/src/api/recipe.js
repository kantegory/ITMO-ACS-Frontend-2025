import apiClient from ".";

class RecipeService {
  constructor(client) {
    this.client = client;
    this.prefix = "/recipes";
  }

  async getAll(filter, userId) {
    if (filter) {
      return await this.client.get(this.prefix, { params: { filter } });
    }
    if (userId) {
      return await this.client.get(this.prefix, { params: { userId } });
    }
    return await this.client.get(this.prefix);
  }

  async getById(id) {
    return await this.client.get(`${this.prefix}/${id}`);
  }

  async getIngredients() {
    return await this.client.get("ingredients");
  }

  async create(recipeData) {
    return await this.client.post(this.prefix, recipeData);
  }
}

const recipeService = new RecipeService(apiClient);
export default recipeService;
