function redirectToLogin() {
    window.location.href = 'login.html';
}

function isAuthenticated() {
    return Boolean(readToken());
}

function requireAuthOrRedirect() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }
    return true;
}

async function fetchCurrentUser() {
    const response = await sendJsonRequest(`${API_BASE.AUTH}/user/me`);
    if (!response.ok) {
        const errorMessage = response.data?.message || 'Не удалось получить информацию о пользователе';
        throw new Error(errorMessage);
    }
    return response.data;
}

async function fetchCurrentUserOrNull() {
    if (!isAuthenticated()) return null;
    try {
        return await fetchCurrentUser();
    } catch (error) {
        console.warn('Не удалось загрузить профиль пользователя', error);
        saveToken(null);
        return null;
    }
}

