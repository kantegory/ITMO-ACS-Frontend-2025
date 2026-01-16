import { useApi } from './useApi';

export function useSocial() {
    const { sendRequest, BACKEND_URL } = useApi();

    async function loadUser(userId) {
        const response = await sendRequest(`${BACKEND_URL}/api/user/${userId}`);
        if (!response.success) {
            throw new Error(response.data?.message || 'Пользователь не найден');
        }
        return response.data;
    }

    async function loadUserRecipes(userId) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipe/?author_id=${userId}`);
        if (!response.success) {
            throw new Error(response.data?.message || 'Не удалось загрузить рецепты');
        }
        return response.data ?? [];
    }

    async function loadUserLikes(userId) {
        const response = await sendRequest(`${BACKEND_URL}/api/like/user/${userId}`);
        if (!response.success) {
            throw new Error(response.data?.message || 'Не удалось загрузить лайки');
        }
        return response.data ?? [];
    }

    async function resolveRecipeTitle(recipeId) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipe/${recipeId}`);
        if (response.success) {
            return response.data?.title || `Рецепт #${recipeId}`;
        }
        return `Рецепт #${recipeId}`;
    }

    return {
        loadUser,
        loadUserRecipes,
        loadUserLikes,
        resolveRecipeTitle,
    };
}
