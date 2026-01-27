class ApiService {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Аутентификация
    async login(email, password) {
        const users = await this.request('/users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.token = `mock-token-${user.id}`;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        
        throw new Error('Неверный email или пароль');
    }

    async register(userData) {
        const users = await this.request('/users');
        const exists = users.find(u => u.email === userData.email);
        
        if (exists) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const newUser = {
            ...userData,
            id: Date.now(),
            role: 'user',
            avatar: 'https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg'
        };

        return await this.request('/users', {
            method: 'POST',
            body: JSON.stringify(newUser)
        });
    }

    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Рецепты
    async getRecipes(filters = {}) {
        let endpoint = '/recipes?_expand=user';
        
        if (filters.category) {
            endpoint += `&category=${filters.category}`;
        }
        if (filters.difficulty) {
            endpoint += `&difficulty=${filters.difficulty}`;
        }
        if (filters.search) {
            const recipes = await this.request('/recipes');
            return recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                recipe.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        return await this.request(endpoint);
    }

    async getRecipe(id) {
        return await this.request(`/recipes/${id}`);
    }

    async createRecipe(recipeData) {
        const user = this.getCurrentUser();
        
        const newRecipe = {
            ...recipeData,
            author: user.name,
            authorId: user.id,
            likes: 0,
            savedBy: [],
            likedBy: [],
            createdAt: new Date().toISOString()
        };

        return await this.request('/recipes', {
            method: 'POST',
            body: JSON.stringify(newRecipe)
        });
    }

    async updateRecipe(id, recipeData) {
        return await this.request(`/recipes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(recipeData)
        });
    }

    async deleteRecipe(id) {
        return await this.request(`/recipes/${id}`, {
            method: 'DELETE'
        });
    }

    async likeRecipe(recipeId) {
        const recipe = await this.getRecipe(recipeId);
        const user = this.getCurrentUser();
        
        const isLiked = recipe.likedBy?.includes(user.id);
        
        if (isLiked) {
            recipe.likedBy = recipe.likedBy.filter(id => id !== user.id);
            recipe.likes -= 1;
        } else {
            recipe.likedBy = [...(recipe.likedBy || []), user.id];
            recipe.likes += 1;
        }

        return await this.updateRecipe(recipeId, {
            likedBy: recipe.likedBy,
            likes: recipe.likes
        });
    }

    async saveRecipe(recipeId) {
        const recipe = await this.getRecipe(recipeId);
        const user = this.getCurrentUser();
        
        const isSaved = recipe.savedBy?.includes(user.id);
        
        if (isSaved) {
            recipe.savedBy = recipe.savedBy.filter(id => id !== user.id);
        } else {
            recipe.savedBy = [...(recipe.savedBy || []), user.id];
        }

        return await this.updateRecipe(recipeId, {
            savedBy: recipe.savedBy
        });
    }

    async getSavedRecipes() {
        const user = this.getCurrentUser();
        const recipes = await this.getRecipes();
        
        return recipes.filter(recipe => 
            recipe.savedBy?.includes(user.id)
        );
    }

    async getUserRecipes(userId) {
        return await this.request(`/recipes?authorId=${userId}`);
    }

    // Категории
    async getCategories() {
        return await this.request('/categories');
    }

    // Комментарии
    async getComments(recipeId) {
        return await this.request(`/comments?recipeId=${recipeId}`);
    }

    async addComment(recipeId, text) {
        const user = this.getCurrentUser();
        
        const comment = {
            recipeId,
            userId: user.id,
            userName: user.name,
            text,
            date: new Date().toISOString()
        };

        return await this.request('/comments', {
            method: 'POST',
            body: JSON.stringify(comment)
        });
    }

    // Блог
    async getBlogPosts() {
        return await this.request('/blogPosts');
    }

    async getBlogPost(id) {
        return await this.request(`/blogPosts/${id}`);
    }

    // Поиск
    async searchRecipes(query) {
        const recipes = await this.getRecipes();
        
        return recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(query.toLowerCase()) ||
            recipe.description.toLowerCase().includes(query.toLowerCase()) ||
            recipe.category.toLowerCase().includes(query.toLowerCase())
        );
    }
}

const api = new ApiService();