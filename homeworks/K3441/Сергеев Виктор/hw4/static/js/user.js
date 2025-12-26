const userPageState = {
    profileUserId: null,
    profileUser: null,
    authorizedUser: null,
    tabLoaded: {
        recipes: false,
        likes: false,
    },
    recipesCache: null,
    likesCache: null,
    userCache: new Map(),
    recipeCache: new Map(),
};

document.addEventListener('DOMContentLoaded', () => {
    initUserPage().catch((error) => {
        console.error(error);
        showInlineMessage('userAlert', error.message || 'Неизвестная ошибка');
    });
});

async function initUserPage() {
    const requestedIdParamRaw = getQueryParam('id');
    const requestedIdParam = requestedIdParamRaw && requestedIdParamRaw.trim() !== '' ? requestedIdParamRaw : null;
    const profileMode = getQueryParam('mode');
    const requestedId = requestedIdParam !== null ? Number(requestedIdParam) : null;

    userPageState.authorizedUser = await fetchCurrentUserOrNull();

    if (requestedIdParam !== null) {
        if (!Number.isFinite(requestedId) || requestedId <= 0) {
            showInlineMessage('userAlert', 'Некорректный идентификатор пользователя.');
            return;
        }
        userPageState.profileUserId = requestedId;
    } else if (profileMode === 'me') {
        if (!requireAuthOrRedirect()) return;
        userPageState.authorizedUser = userPageState.authorizedUser || await fetchCurrentUserOrNull();
        if (!userPageState.authorizedUser) return;
        userPageState.profileUserId = userPageState.authorizedUser.id;
    } else if (userPageState.authorizedUser) {
        userPageState.profileUserId = userPageState.authorizedUser.id;
    } else {
        showInlineMessage('userAlert', 'Укажите пользователя через параметр ?id= или авторизуйтесь.');
        return;
    }

    await loadProfileHeader();
    setupTabs();
    await Promise.all([
        loadLikesSummary(),
    ]);
}

async function loadProfileHeader() {
    const response = await sendRequest(`${BACKEND_URL}/api/user/${userPageState.profileUserId}`);
    if (!response.success) {
        throw new Error(response.error || 'Пользователь не найден');
    }

    const profileUser = response.data;
    userPageState.profileUser = profileUser;

    const profileNameElement = document.getElementById('profileUsername');
    profileNameElement.innerHTML = `
        <svg class="me-2" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <use href="#user"></use>
        </svg>
        <span>${profileUser.username}</span>
    `;

    const actionContainer = document.getElementById('profileActions');
    if (actionContainer && userPageState.authorizedUser?.id === profileUser.id) {
        const createLink = document.getElementById('createRecipeLink');
        if (createLink) createLink.classList.remove('d-none');
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('[data-profile-tab]');
    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-profile-tab');
            activateTab(targetTab);
        });
    });

    activateTab('recipes');
}

function activateTab(tabName) {
    const tabButtons = document.querySelectorAll('[data-profile-tab]');
    const tabPanels = document.querySelectorAll('.profile-tab-panel');

    tabButtons.forEach((button) => {
        const isActive = button.getAttribute('data-profile-tab') === tabName;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    tabPanels.forEach((panel) => {
        const isActive = panel.id === `panel-${tabName}`;
        panel.classList.toggle('show', isActive);
        panel.classList.toggle('active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    if (!userPageState.tabLoaded[tabName]) {
        loadTabData(tabName);
    }
}

function loadTabData(tabName) {
    switch (tabName) {
        case 'recipes':
            loadRecipesTab();
            break;
        case 'likes':
            loadLikesTab();
            break;
        default:
            break;
    }
}

async function loadRecipesTab() {
    const container = document.getElementById('recipesContainer');
    if (!container) return;
    container.innerHTML = createLoadingPlaceholder('Загружаем рецепты...');

    const response = await sendRequest(`${BACKEND_URL}/api/recipe/?author_id=${userPageState.profileUserId}`);
    if (!response.success) {
        renderEmptyState(container, 'Не удалось получить список рецептов.');
        showInlineMessage('userAlert', response.error || 'Ошибка загрузки рецептов.');
        return;
    }

    const recipes = response.data ?? [];
    userPageState.recipesCache = recipes;
    updateStatValue('recipesStat', recipes.length);
    userPageState.tabLoaded.recipes = true;
    renderRecipeCards(container, recipes);
}

function renderRecipeCards(container, recipes) {
    if (!recipes.length) {
        renderEmptyState(container, 'Пока нет опубликованных рецептов.');
        return;
    }

    container.innerHTML = '';
    recipes.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.className = 'col';
        card.setAttribute('role', 'listitem');
        const recipeUrl = `recipe.html?id=${recipe.id}`;
        const cookingTime = formatMinutesToText(recipe.cooking_time);
        const title = escapeHtml(recipe.title);
        const description = escapeHtml(recipe.description ?? 'Без описания');
        const difficulty = recipe.difficulty || '-';
        card.innerHTML = `
            <div class="card h-100 shadow-sm" role="article" aria-labelledby="recipeTitle${index}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <small class="text-muted" aria-label="Время приготовления">${cookingTime}</small>
                    </div>
                    <h5 id="recipeTitle${index}" class="card-title">${title}</h5>
                    <p class="card-text text-muted flex-grow-1" aria-label="Описание рецепта">${description}</p>
                    <p class="mb-3 text-muted" aria-label="Сложность рецепта">Сложность: ${difficulty}</p>
                    <a class="btn btn-primary mt-auto align-self-start" href="${recipeUrl}"
                        aria-label="Открыть рецепт: ${title}">Открыть</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function loadLikesTab() {
    const container = document.getElementById('likesContainer');
    container.innerHTML = createLoadingPlaceholder('Загружаем лайки...');

    const likes = await loadLikesSummary(true);
    if (!likes) {
        renderEmptyState(container, 'Не удалось получить лайки пользователя.');
        return;
    }1

    userPageState.tabLoaded.likes = true;
    if (!likes.length) {
        renderEmptyState(container, 'Пользователь еще не ставил лайки.');
        return;
    }

    container.innerHTML = '';
    for (const like of likes) {
        const recipeTitle = await resolveRecipeTitle(like.recipe.id);
        const card = document.createElement('div');
        card.className = 'card mb-2';
        card.setAttribute('role', 'listitem');
        const title = escapeHtml(recipeTitle);
        const description = like.recipe?.description ?? "Описание отсутствует";
        const recipeUrl = `recipe.html?id=${like.recipe.id}`;
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h6 id= class="mb-1" aria-label="Название рецепта">${title}</h6>
                    <p class="text-muted mb-0" aria-label="Описание рецепта">${description}</p>
                </div>
                <a class="btn btn-sm btn-outline-primary" href="${recipeUrl}"
                    aria-label="Открыть рецепт: ${title}">Открыть</a>
            </div>
        `;
        container.appendChild(card);
    }
}

async function loadLikesSummary(force = false) {
    if (userPageState.likesCache && !force) {
        return userPageState.likesCache;
    }

    const response = await sendRequest(`${BACKEND_URL}/api/like/?user_id=${userPageState.profileUserId}`);
    if (!response.success) {
        showInlineMessage('userAlert', response.error || 'Ошибка при получении лайков.');
        return null;
    }

    const list = response.data ?? [];
    userPageState.likesCache = list;
    updateStatValue('likesStat', list.length);
    return list;
}

function updateStatValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.innerText = value;
}

async function resolveUserProfile(userId) {
    if (userPageState.userCache.has(userId)) {
        return userPageState.userCache.get(userId);
    }
    const response = await sendRequest(`${BACKEND_URL}/api/user/${userId}`);
    if (response.success) {
        userPageState.userCache.set(userId, response.data);
        return response.data;
    }
    const fallback = { id: userId, first_name: 'Пользователь', last_name: `#${userId}` };
    userPageState.userCache.set(userId, fallback);
    return fallback;
}

async function resolveRecipeTitle(recipeId) {
    if (userPageState.recipeCache.has(recipeId)) {
        return userPageState.recipeCache.get(recipeId);
    }
    const response = await sendRequest(`${BACKEND_URL}/api/recipe/${recipeId}`);
    if (response.success) {
        const title = response.data?.title || `Рецепт #${recipeId}`;
        userPageState.recipeCache.set(recipeId, title);
        return title;
    }
    return `Рецепт #${recipeId}`;
}
