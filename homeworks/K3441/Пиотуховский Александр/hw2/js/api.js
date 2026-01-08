const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = localStorage.getItem('access_token');
    }

    getAuthHeader() {
        this.token = localStorage.getItem('access_token');
        if (this.token) {
            return {'Authorization': `Bearer ${this.token}`};
        }
        return {};
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader()
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 204) {
                return null;
            }

            if (response.status === 401) {
                console.log('Token invalid');
                this.logout();
                window.location.href = 'login.html';
                throw new Error('Authentication required');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({detail: 'Unknown error'}));
                throw new Error(error.detail || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({email, password})
        });

        if (data.access_token) {
            this.token = data.access_token;
            localStorage.setItem('access_token', data.access_token);
        }

        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('current_user');
    }

    isLoggedIn() {
        return !!this.token;
    }

    async getUsers() {
        return this.request('/user');
    }

    async getUser(id) {
        return this.request(`/user/${id}`);
    }

    async findUser(params) {
        return this.request('/user/find', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    async getCurrentUser() {
        if (!this.token) return null;

        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const user = await this.getUser(payload.user_id);
            localStorage.setItem('current_user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    async getUserFavoriteRecipes(userId) {
        return this.request(`/user/${userId}/recipe_favorites`);
    }

    async getUserFavoritePosts(userId) {
        return this.request(`/user/${userId}/post_favorites`);
    }

    async getUserFollowers(userId) {
        return this.request(`/user/${userId}/followers`);
    }

    async getUserFollowing(userId) {
        return this.request(`/user/${userId}/following`);
    }

    async subscribeToUser(targetUserId, currentUserId) {
        return this.request(`/user/${targetUserId}/subscribe`, {
            method: 'POST',
            body: JSON.stringify({userId: currentUserId})
        });
    }

    async unsubscribeFromUser(targetUserId, currentUserId) {
        return this.request(`/user/${targetUserId}/subscribe`, {
            method: 'DELETE',
            body: JSON.stringify({userId: currentUserId})
        });
    }

    async updateUser(userId, userData) {
        return this.request(`/user/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async getRecipes(authorId = null) {
        const url = authorId ? `/recipe?authorId=${authorId}` : '/recipe';
        return this.request(url);
    }

    async getRecipe(id) {
        return this.request(`/recipe/${id}`);
    }

    async createRecipe(recipeData) {
        return this.request('/recipe', {
            method: 'POST',
            body: JSON.stringify(recipeData)
        });
    }

    async updateRecipe(id, recipeData) {
        return this.request(`/recipe/${id}`, {
            method: 'PUT',
            body: JSON.stringify(recipeData)
        });
    }

    async deleteRecipe(id) {
        return this.request(`/recipe/${id}`, {
            method: 'DELETE'
        });
    }

    async addRecipeToFavorites(recipeId, userId) {
        return this.request(`/recipe/${recipeId}/favorite`, {
            method: 'POST',
            body: JSON.stringify({userId})
        });
    }

    async removeRecipeFromFavorites(recipeId, userId) {
        return this.request(`/recipe/${recipeId}/favorite`, {
            method: 'DELETE',
            body: JSON.stringify({userId})
        });
    }

    async getPosts(authorId = null) {
        const url = authorId ? `/post?authorId=${authorId}` : '/post';
        return this.request(url);
    }

    async getPost(id) {
        return this.request(`/post/${id}`);
    }

    async createPost(postData) {
        return this.request('/post', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    }

    async updatePost(id, postData) {
        return this.request(`/post/${id}`, {
            method: 'PUT',
            body: JSON.stringify(postData)
        });
    }

    async deletePost(id) {
        return this.request(`/post/${id}`, {
            method: 'DELETE'
        });
    }

    async addPostToFavorites(postId, userId) {
        return this.request(`/post/${postId}/favorite`, {
            method: 'POST',
            body: JSON.stringify({userId})
        });
    }

    async removePostFromFavorites(postId, userId) {
        return this.request(`/post/${postId}/favorite`, {
            method: 'DELETE',
            body: JSON.stringify({userId})
        });
    }

    async getComments(commentableType, commentableId) {
        return this.request(`/comments?commentableType=${commentableType}&commentableId=${commentableId}`);
    }

    async createComment(commentData) {
        return this.request('/comments', {
            method: 'POST',
            body: JSON.stringify(commentData)
        });
    }

    async updateComment(id, content) {
        return this.request(`/comments/${id}`, {
            method: 'PUT',
            body: JSON.stringify({content})
        });
    }

    async deleteComment(id) {
        return this.request(`/comments/${id}`, {
            method: 'DELETE'
        });
    }

    async getDishTypes() {
        return this.request('/dish_type');
    }

    async getDishType(id) {
        return this.request(`/dish_type/${id}`);
    }

    async getIngredients() {
        return this.request('/ingredient');
    }

    async getIngredient(id) {
        return this.request(`/ingredient/${id}`);
    }

    async getRoles() {
        return this.request('/role');
    }

    async getPermissions() {
        return this.request('/permissions');
    }
}

window.api = new ApiClient();
