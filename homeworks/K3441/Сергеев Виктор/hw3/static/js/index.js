document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
});

async function loadRecipes(filters = {}) {
    const listContainer = document.getElementById('recipesList');
    const summaryElement = document.getElementById('searchSummary');
    if (!listContainer || !summaryElement) return;

    listContainer.innerHTML = createLoadingPlaceholder('Ищем рецепты...');
    hideInlineMessage('indexAlert');
    
    const url = `${BACKEND_URL}/api/recipe`;
    const response = await sendRequest(url, 'GET');

    if (!response.success) {
        renderEmptyState(listContainer, 'Не удалось загрузить рецепты. Попробуйте позже.');
        summaryElement.innerText = '';
        showInlineMessage('indexAlert', response.error || 'Ошибка при загрузке рецептов.');
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
        renderEmptyState(listContainer, 'Ни одного рецепта ещё не создано.');
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
