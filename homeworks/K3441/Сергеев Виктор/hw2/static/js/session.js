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
    const response = await sendRequest(`${BACKEND_URL}/api/user/me`);
    if (!response.success) {
        const errorMessage = response.error || 'Не удалось получить информацию о пользователе';
        throw new Error(errorMessage);
    }
    return response.data;
}

async function fetchCurrentUserOrNull() {
    if (!isAuthenticated()) return null;
    try {
        return await fetchCurrentUser();
    } catch (error) {
        saveToken(null);
        return null;
    }
}