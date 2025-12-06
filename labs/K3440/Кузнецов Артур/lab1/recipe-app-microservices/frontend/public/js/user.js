const userPageState = {
    profileUserId: null,
    profileUser: null,
    authorizedUser: null,
    tabLoaded: {
        recipes: false,
        subscriptions: false,
        followers: false,
        likes: false,
    },
    followersCache: null,
    subscriptionsCache: null,
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
        loadSubscriptionsSummary(),
        loadFollowersSummary(),
        loadLikesSummary(),
    ]);
    await syncSubscriptionButton();
}

async function loadProfileHeader() {
    const response = await sendJsonRequest(`${API_BASE.AUTH}/user/${userPageState.profileUserId}`);
    if (!response.ok) {
        throw new Error(response.data?.message || 'Пользователь не найден');
    }

    const profileUser = response.data;
    userPageState.profileUser = profileUser;

    document.getElementById('profileFullName').innerText = `${profileUser.first_name} ${profileUser.last_name}`;
    document.getElementById('profileSubtitle').innerText = `Пользователь #${profileUser.id}`;

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
        case 'subscriptions':
            loadSubscriptionsTab();
            break;
        case 'followers':
            loadFollowersTab();
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

    const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/user/${userPageState.profileUserId}`);
    if (!response.ok) {
        renderEmptyState(container, 'Не удалось получить список рецептов.');
        showInlineMessage('userAlert', response.data?.message || 'Ошибка загрузки рецептов.');
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
        card.innerHTML = `
            <div class="card h-100 shadow-sm" role="article" aria-labelledby="user-recipe-title-${index}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary" aria-label="Тип блюда: ${escapeHtml(recipe.dishType?.name || 'Не указан')}">${recipe.dishType?.name || 'Не указан'}</span>
                        <small class="text-muted" aria-label="Время приготовления: ${formatMinutesToText(recipe.preparation_time + recipe.cooking_time)}">${formatMinutesToText(recipe.preparation_time + recipe.cooking_time)}</small>
                    </div>
                    <h5 id="user-recipe-title-${index}" class="card-title">${escapeHtml(recipe.title)}</h5>
                    <p class="text-muted flex-grow-1" aria-label="Описание рецепта">${escapeHtml(recipe.description ?? 'Без описания')}</p>
                    <a class="btn btn-outline-primary mt-3" href="${recipeUrl}" 
                       aria-label="Открыть рецепт: ${escapeHtml(recipe.title)}">Открыть</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function loadSubscriptionsTab() {
    const container = document.getElementById('subscriptionsContainer');
    container.innerHTML = createLoadingPlaceholder('Загружаем подписки...');

    const subscriptions = await loadSubscriptionsSummary(true);
    if (!subscriptions) {
        renderEmptyState(container, 'Не удалось получить список подписок.');
        return;
    }

    userPageState.tabLoaded.subscriptions = true;
    await renderUserList(subscriptions, container, 'followingId', 'Пользователь');
}

async function loadFollowersTab() {
    const container = document.getElementById('followersContainer');
    container.innerHTML = createLoadingPlaceholder('Загружаем подписчиков...');

    const followers = await loadFollowersSummary(true);
    if (!followers) {
        renderEmptyState(container, 'Не удалось получить подписчиков.');
        return;
    }

    userPageState.tabLoaded.followers = true;
    await renderUserList(followers, container, 'followerId', 'Пользователь');
}

async function renderUserList(list, container, userIdField, labelPrefix) {
    if (!list.length) {
        renderEmptyState(container, 'Список пуст.');
        return;
    }

    const uniqueIds = [...new Set(list.map((entry) => entry[userIdField]))];
    const userProfiles = await Promise.all(uniqueIds.map((id) => resolveUserProfile(id)));
    const userMap = new Map();
    userProfiles.forEach((profile) => {
        userMap.set(profile.id, `${profile.first_name} ${profile.last_name}`);
    });

    container.innerHTML = '';
    list.forEach((entry, index) => {
        const userName = userMap.get(entry[userIdField]) || `${labelPrefix} #${entry[userIdField]}`;
        const escapedUserName = escapeHtml(userName);
        const userId = entry[userIdField];
        const entryDate = new Date(entry.created_at).toLocaleDateString('ru-RU');
        const userUrl = `user.html?id=${userId}`;
        const card = document.createElement('div');
        card.className = 'card mb-2';
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1" aria-label="Имя пользователя">${escapedUserName}</h6>
                    <p class="text-muted mb-0" aria-label="Идентификатор и дата">
                        <span aria-label="Идентификатор пользователя">ID: ${userId}</span> • 
                        <time datetime="${entry.created_at}" aria-label="Дата: ${entryDate}">${entryDate}</time>
                    </p>
                </div>
                <a class="btn btn-sm btn-outline-primary" href="${userUrl}" 
                   aria-label="Перейти к профилю пользователя ${escapedUserName}">
                    Перейти
                </a>
            </div>
        `;
        card.setAttribute('aria-label', `${labelPrefix} ${index + 1}: ${escapedUserName}`);
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
    }

    userPageState.tabLoaded.likes = true;
    if (!likes.length) {
        renderEmptyState(container, 'Пользователь еще не ставил лайки.');
        return;
    }

    container.innerHTML = '';
    let index = 0;
    for (const like of likes) {
        const recipeTitle = await resolveRecipeTitle(like.recipeId);
        const escapedTitle = escapeHtml(recipeTitle);
        const recipeId = like.recipeId;
        const likeDate = new Date(like.created_at).toLocaleDateString('ru-RU');
        const recipeUrl = `recipe.html?id=${recipeId}`;
        const card = document.createElement('div');
        card.className = 'card mb-2';
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1" aria-label="Название рецепта">${escapedTitle}</h6>
                    <p class="text-muted mb-0" aria-label="Идентификатор рецепта и дата лайка">
                        <span aria-label="Идентификатор рецепта">Рецепт #${recipeId}</span> • 
                        <time datetime="${like.created_at}" aria-label="Дата лайка: ${likeDate}">${likeDate}</time>
                    </p>
                </div>
                <a class="btn btn-sm btn-outline-primary" href="${recipeUrl}" 
                   aria-label="Открыть рецепт ${escapedTitle}">
                    Открыть
                </a>
            </div>
        `;
        card.setAttribute('aria-label', `Лайк ${index + 1}: ${escapedTitle}`);
        container.appendChild(card);
        index++;
    }
}

async function loadSubscriptionsSummary(force = false) {
    if (userPageState.subscriptionsCache && !force) {
        return userPageState.subscriptionsCache;
    }

    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription/following/${userPageState.profileUserId}`);
    if (!response.ok) {
        showInlineMessage('userAlert', response.data?.message || 'Ошибка при получении подписок.');
        return null;
    }

    const list = response.data ?? [];
    userPageState.subscriptionsCache = list;
    updateStatValue('subscriptionsStat', list.length);
    return list;
}

async function loadFollowersSummary(force = false) {
    if (userPageState.followersCache && !force) {
        return userPageState.followersCache;
    }

    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription/followers/${userPageState.profileUserId}`);
    if (!response.ok) {
        showInlineMessage('userAlert', response.data?.message || 'Ошибка при получении подписчиков.');
        return null;
    }

    const list = response.data ?? [];
    userPageState.followersCache = list;
    updateStatValue('followersStat', list.length);
    return list;
}

async function loadLikesSummary(force = false) {
    if (userPageState.likesCache && !force) {
        return userPageState.likesCache;
    }

    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like/user/${userPageState.profileUserId}`);
    if (!response.ok) {
        showInlineMessage('userAlert', response.data?.message || 'Ошибка при получении лайков.');
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
    const response = await sendJsonRequest(`${API_BASE.AUTH}/user/${userId}`);
    if (response.ok) {
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
    const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/${recipeId}`);
    if (response.ok) {
        const title = response.data?.title || `Рецепт #${recipeId}`;
        userPageState.recipeCache.set(recipeId, title);
        return title;
    }
    return `Рецепт #${recipeId}`;
}

async function syncSubscriptionButton() {
    const button = document.getElementById('followButton');
    if (!button) return;

    const viewer = userPageState.authorizedUser;
    if (!viewer || viewer.id === userPageState.profileUserId) {
        button.classList.add('d-none');
        return;
    }

    button.classList.remove('d-none');
    button.disabled = true;
    button.innerHTML = createLoadingPlaceholder('Обновляем...');

    const followers = await loadFollowersSummary(true);
    const existingSubscription = (followers || []).find((entry) => entry.followerId === viewer.id);

    button.disabled = false;
    if (existingSubscription) {
        button.dataset.subscriptionId = existingSubscription.id;
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-outline-danger');
        button.innerText = 'Отписаться';
        button.setAttribute('aria-label', 'Отписаться от пользователя');
        button.setAttribute('aria-pressed', 'true');
        button.onclick = () => handleUnsubscribe(existingSubscription.id);
    } else {
        button.dataset.subscriptionId = '';
        button.classList.add('btn-outline-primary');
        button.classList.remove('btn-outline-danger');
        button.innerText = 'Подписаться';
        button.setAttribute('aria-label', 'Подписаться на пользователя');
        button.setAttribute('aria-pressed', 'false');
        button.onclick = handleSubscribe;
    }
    if (followers && userPageState.tabLoaded.followers) {
        const followersContainer = document.getElementById('followersContainer');
        if (followersContainer) {
            await renderUserList(followers, followersContainer, 'followerId', 'Пользователь');
        }
    }
}

async function handleSubscribe() {
    if (!requireAuthOrRedirect()) return;
    const button = document.getElementById('followButton');
    button.disabled = true;
    button.innerHTML = createLoadingPlaceholder('Отправляем запрос...');

    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription`, 'POST', {
        followingId: userPageState.profileUserId,
    });

    if (!response.ok) {
        button.disabled = false;
        button.innerText = 'Подписаться';
        showInlineMessage('userAlert', response.data?.message || 'Не удалось подписаться.');
        return;
    }

    await syncSubscriptionButton();
    hideInlineMessage('userAlert');
}

async function handleUnsubscribe(subscriptionId) {
    if (!requireAuthOrRedirect()) return;
    const button = document.getElementById('followButton');
    button.disabled = true;
    button.innerHTML = createLoadingPlaceholder('Отменяем...');

    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/subscription/${subscriptionId}`, 'DELETE');
    if (response.ok) {
        await syncSubscriptionButton();
        hideInlineMessage('userAlert');
        return;
    }

    button.disabled = false;
    button.innerText = 'Отписаться';
    showInlineMessage('userAlert', response.data?.message || 'Не удалось отменить подписку.');
}

