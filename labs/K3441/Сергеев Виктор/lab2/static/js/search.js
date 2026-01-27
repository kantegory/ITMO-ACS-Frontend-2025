const searchPageState = {
    tags: [],
    lastFilters: {},
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    if (form) form.addEventListener('submit', handleSearchFormSubmit);
    initializeSearchFilters().then(() => loadRecipes());
});

async function initializeSearchFilters() {
    const tagsRequest = sendRequest(`${BACKEND_URL}/api/tag`);

    try {
        const tagsResponse = await tagsRequest;

        if (tagsResponse.success) {
            searchPageState.tags = tagsResponse.data ?? [];
            fillSelectWithOptions('tagFilter', searchPageState.tags, 'Выберите теги');
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
    const titleFilter = document.getElementById('titleFilter').value.trim().toLowerCase();
    const tagFilter = document.getElementById('tagFilter').value;

    return {
        title: titleFilter,
        tagId: tagFilter || null,
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
    if (filters.tagId) queryParams.append('tag_id', filters.tagId);
    if (filters.title) queryParams.append('title', filters.title);

    const queryString = queryParams.toString();
    const url = `${BACKEND_URL}/api/recipe${queryString ? `/filter?${queryString}` : ''}`;
    const response = await sendRequest(url, 'GET');

    if (!response.success) {
        renderEmptyState(listContainer, 'Не удалось загрузить рецепты. Попробуйте позже.');
        summaryElement.innerText = '';
        showInlineMessage('searchAlert', response.error || 'Ошибка при загрузке рецептов.');
        return;
    }

    const recipes = (response.data ?? []);

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
                        <small class="text-muted">${formatMinutesToText(recipe.cooking_time)}</small>
                    </div>
                    <h5 class="card-title">${escapeHtml(recipe.title)}</h5>
                    <p class="card-text text-muted flex-grow-1">${escapeHtml(recipe.description ?? 'Без описания')}</p>
                    <p class="mb-3 text-muted">Сложность: ${recipe.difficulty || '-'}</p>
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