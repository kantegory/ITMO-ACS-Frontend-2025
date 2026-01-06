import { useRouter } from 'vue-router';
import { useApi } from './useApi';

export function useRecipe() {
    const router = useRouter();
    const { sendRequest, BACKEND_URL } = useApi();

    async function loadDictionaries() {
        const [tagsResponse, ingredientsResponse] = await Promise.all([
            sendRequest(`${BACKEND_URL}/api/tag`),
            sendRequest(`${BACKEND_URL}/api/ingredient`),
        ]);

        if (!tagsResponse.success || !ingredientsResponse.success) {
            throw new Error("Не удалось загрузить справочные данные.");
        }

        return {
            tags: tagsResponse.data ?? [],
            ingredients: ingredientsResponse.data ?? [],
        };
    }

    async function loadRecipeDetails(recipeId) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipe/${recipeId}`);
        if (!response.success) {
            throw new Error(response.error || 'Рецепт не найден');
        }
        return response.data;
    }

    async function loadRecipeIngredients(recipeId) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipeingredient/?recipe_id=${recipeId}`)
        if (!response.success) {
            throw new Error(response.error || 'Ингредиенты не найдены')
        }
        const ingredientsData = response.data ?? []
        return ingredientsData
    }

    async function loadRecipeTags(recipeId) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipetag/?recipe_id=${recipeId}`)
        if (!response.success) {
            throw new Error(response.error || 'Теги не найдены')
        }
        const tagsData = response.data ?? []
        return tagsData
    }

    async function loadRecipeSteps(recipeId) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipestep/?recipe_id=${recipeId}`)
        if (!response.success) {
            throw new Error(response.error || 'Шаги приготовления не найдены')
        }
        const stepsData = response.data ?? []
        return stepsData
    }
    
    async function syncRecipeIngredients(recipeId, entries) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipeingredient/?recipe_id=${recipeId}`)
        const ingredients = response.data ?? []
        const existingRecipeIngredientIds = ingredients.map((entry) => entry.id)
        if (existingRecipeIngredientIds.length) {
            for (const id of existingRecipeIngredientIds) {
                await sendRequest(`${BACKEND_URL}/api/recipeingredient/${id}`, "DELETE");
            }
        }

        for (const entry of entries) {
            entry.recipe_id = recipeId;
            await sendRequest(`${BACKEND_URL}/api/recipeingredient/`, "POST", entry);
        }
    }

    async function syncRecipeTags(recipeId, entries) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipetag/?recipe_id=${recipeId}`)
        const tags = response.data ?? []
        const existingRecipeTagIds = tags.map((entry) => entry.id)
        if (existingRecipeTagIds.length) {
            for (const id of existingRecipeTagIds) {
                await sendRequest(`${BACKEND_URL}/api/recipetag/${id}`, "DELETE");
            }
        }

        for (const entry of entries) {
            entry.recipe_id = recipeId;
            await sendRequest(`${BACKEND_URL}/api/recipetag/`, "POST", entry);
        }
    }

    async function syncRecipeSteps(recipeId, entries) {
        const response = await sendRequest(`${BACKEND_URL}/api/recipestep/?recipe_id=${recipeId}`)
        const steps = response.data ?? []
        const existingRecipeStepIds = steps.map((entry) => entry.id)
        if (existingRecipeStepIds.length) {
            for (const id of existingRecipeStepIds) {
                await sendRequest(`${BACKEND_URL}/api/recipestep/${id}`, "DELETE");
            }
        }

        for (const step of entries) {
            step.recipe_id = recipeId;
            await sendRequest(`${BACKEND_URL}/api/recipestep/`, "POST", step);
        }
    }

    async function saveRecipe(recipeData, ingredients, tags, steps, recipeId = null) {
        const endpoint = recipeId
            ? `${BACKEND_URL}/api/recipe/${recipeId}`
            : `${BACKEND_URL}/api/recipe`;
        const method = recipeId ? 'PATCH' : 'POST';

        const response = await sendRequest(endpoint, method, recipeData);
        if (!response.success) {
            throw new Error(response.data?.message || 'Не удалось сохранить рецепт.');
        }
        
        const createdRecipe = response.data;
        const targetRecipeId = recipeId
        ? recipeId
        : createdRecipe?.id;
        
        console.log(recipeId)
        console.log(createdRecipe)
        console.log(targetRecipeId)
    
        if (!targetRecipeId) {
            throw new Error('Сервис не вернул идентификатор рецепта.');
        }

        await syncRecipeIngredients(targetRecipeId, ingredients)
        await syncRecipeTags(targetRecipeId, tags)
        await syncRecipeSteps(targetRecipeId, steps)

        return targetRecipeId;
    }

    return {
        loadDictionaries,
        loadRecipeDetails,
        loadRecipeIngredients,
        loadRecipeTags,
        loadRecipeSteps,
        saveRecipe,
    };
}