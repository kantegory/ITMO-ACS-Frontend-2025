const searchPageState = {
    dishTypes: [],
    difficulties: [],
    ingredients: [],
    lastFilters: {},
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    if (form) form.addEventListener('submit', handleSearchFormSubmit);
    initializeSearchFilters().then(() => loadRecipes());
});

async function initializeSearchFilters() {
    const dishTypesRequest = sendJsonRequest(`${API_BASE.RECIPE}/dish-type`);
    const difficultiesRequest = sendJsonRequest(`${API_BASE.RECIPE}/recipe-difficulty`);
    const ingredientsRequest = sendJsonRequest(`${API_BASE.RECIPE}/ingredient`);

    try {
        const [dishTypesResponse, difficultiesResponse, ingredientsResponse] = await Promise.all([
            dishTypesRequest,
            difficultiesRequest,
            ingredientsRequest,
        ]);

        if (dishTypesResponse.ok) {
            searchPageState.dishTypes = dishTypesResponse.data ?? [];
            fillSelectWithOptions('dishTypeFilter', searchPageState.dishTypes, 'Выберите тип блюда');
        }

        if (difficultiesResponse.ok) {
            searchPageState.difficulties = difficultiesResponse.data ?? [];
            fillSelectWithOptions('difficultyFilter', searchPageState.difficulties, 'Уровень сложности');
        }

        if (ingredientsResponse.ok) {
            searchPageState.ingredients = ingredientsResponse.data ?? [];
            fillSelectWithOptions('ingredientFilter', searchPageState.ingredients, 'Ингредиенты', true);
        }
    } catch (error) {
        console.error('Не удалось загрузить фильтры', error);
        showInlineMessage('searchAlert', 'Не удалось загрузить справочники. Попробуйте обновить страницу.');
    }
}

function fillSelectWithOptions(selectId, items, placeholder, isMultiple = false) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    const initialOption = document.createElement('option');
    initialOption.value = '';
    initialOption.innerText = placeholder;
    if (isMultiple) {
        initialOption.disabled = true;
        initialOption.hidden = true;
    } else {
        selectElement.innerHTML = '';
    }
    selectElement.appendChild(initialOption);

    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.innerText = item.name;
        selectElement.appendChild(option);
    });
}

function collectSearchFilters() {
    const titleFilter = document.getElementById('titleFilter').value.trim();
    const dishTypeFilter = document.getElementById('dishTypeFilter').value;
    const difficultyFilter = document.getElementById('difficultyFilter').value;
    const ingredientSelect = document.getElementById('ingredientFilter');
    const selectedIngredients = ingredientSelect ? Array.from(ingredientSelect.selectedOptions).map((option) => option.value) : [];

    return {
        title: titleFilter || null,
        dishTypeId: dishTypeFilter || null,
        difficultyId: difficultyFilter || null,
        ingredientIds: selectedIngredients || [],
    };
}

async function loadRecipes(filters = {}) {
    const listContainer = document.getElementById('recipesList');
    const summaryElement = document.getElementById('searchSummary');
    if (!listContainer || !summaryElement) return;

    searchPageState.lastFilters = filters;
    listContainer.innerHTML = createLoadingPlaceholder('Ищем рецепты...');
    hideInlineMessage('searchAlert');

    const queryParams = new URLSearchParams();
    if (filters.title) queryParams.append('title', filters.title);
    if (filters.dishTypeId) queryParams.append('dishTypeId', filters.dishTypeId);
    if (filters.difficultyId) queryParams.append('difficultyId', filters.difficultyId);
    if (filters.ingredientIds && filters.ingredientIds.length) {
        queryParams.append('ingredientIds', filters.ingredientIds.join(','));
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE.RECIPE}/recipe${queryString ? `?${queryString}` : ''}`;
    const response = await sendJsonRequest(url, 'GET');

    if (!response.ok) {
        renderEmptyState(listContainer, 'Не удалось загрузить рецепты. Попробуйте позже.');
        summaryElement.innerText = '';
        showInlineMessage('searchAlert', response.data?.message || 'Ошибка при загрузке рецептов.');
        return;
    }

    const recipes = response.data ?? [];

    summaryElement.innerText = `Найдено рецептов: ${recipes.length}`;
    renderRecipes(recipes);
}

function renderRecipes(recipes) {
    const listContainer = document.getElementById('recipesList');
    if (!listContainer) return;

    if (recipes.length === 0) {
        renderEmptyState(listContainer, 'По заданным условиям ничего не найдено.');
        return;
    }

    listContainer.innerHTML = '';
    recipes.forEach((recipe) => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge bg-secondary">${recipe.dishType?.name || 'Без категории'}</span>
                        </div>
                        <small class="text-muted">${formatMinutesToText(recipe.preparation_time + recipe.cooking_time)}</small>
                    </div>
                    <h5 class="card-title">${escapeHtml(recipe.title)}</h5>
                    <p class="card-text text-muted flex-grow-1">${escapeHtml(recipe.description ?? 'Без описания')}</p>
                    <p class="mb-3 text-muted">Сложность: ${recipe.recipeDifficulty?.name || '-'}</p>
                    <a class="btn btn-primary mt-auto align-self-start" href="recipe.html?id=${recipe.id}">Открыть</a>
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function handleSearchFormSubmit(event) {
    event.preventDefault();
    const filters = collectSearchFilters();
    loadRecipes(filters);
}
