import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { TOKEN_KEY, useApi } from './useApi';

const authState = reactive({
    currentUser: null,
    isLoading: false,
});

export function useAuth() {
    const router = useRouter();
    const { saveToken, readToken, sendRequest, BACKEND_URL } = useApi();

    const isAuthenticated = computed(() => Boolean(readToken()));

    function redirectToLogin() {
        router.push('/login');
    }

    function requireAuth() {
        if (!isAuthenticated.value) {
            redirectToLogin();
            return false;
        }
        return true;
    }

    async function fetchCurrentUser() {
        if (!isAuthenticated.value) return null;

        authState.isLoading = true;
        try {
            const response = await sendRequest(`${BACKEND_URL}/api/user/me`);
            if (response.success) {
                authState.currentUser = response.data;
                return response.data;
            } else {
                saveToken(null);
                authState.currentUser = null;
                return null;
            }
        } catch (error) {
            console.warn('Не удалось получить информацию о пользователе:', error);
            saveToken(null);
            authState.currentUser = null;
            return null;
        } finally {
            authState.isLoading = false;
        }
    }

    async function login(username, password) {
        authState.isLoading = true;
        try {
            const response = await sendRequest(`${BACKEND_URL}/api/login`, 'POST', {
                username,
                password,
            });
            if (response.success) {
                saveToken(response.data[TOKEN_KEY]);
                await fetchCurrentUser();
                return { success: true };
            } else {
                return { success: false, error: response.data?.message || 'Ошибка входа' };
            }
        } catch (error) {
            return { success: false, error: 'Ошибка сети' };
        } finally {
            authState.isLoading = false;
        }
    }

    async function register(username, password, password_confirm) {
        authState.isLoading = true;
        try {
            const response = await sendRequest(`${BACKEND_URL}/api/register`, 'POST', {
                username,
                password,
                password_confirm,
            });
            if (response.success) {
                saveToken(response.data[TOKEN_KEY]);
                await fetchCurrentUser();
                return { success: true };
            } else {
                return { success: false, error: response.data?.message || 'Ошибка регистрации' };
            }
        } catch (error) {
            return { success: false, error: 'Ошибка сети' };
        } finally {
            authState.isLoading = false;
        }
    }

    function logout() {
        saveToken(null);
        authState.currentUser = null;
        router.push('/login');
    }

    async function init() {
        if (isAuthenticated.value) {
            await fetchCurrentUser();
        }
    }

    return {
        currentUser: computed(() => authState.currentUser),
        isLoading: computed(() => authState.isLoading),
        isAuthenticated,
        requireAuth,
        redirectToLogin,
        fetchCurrentUser,
        login,
        register,
        logout,
        init,
    };
}