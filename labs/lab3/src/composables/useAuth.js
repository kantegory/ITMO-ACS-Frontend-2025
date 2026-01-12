import { ref, computed } from 'vue';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const token = ref(localStorage.getItem(TOKEN_KEY));
const user = ref(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
);

export function useAuth() {
    let isAuthenticated = computed(() => !!token.value && !!user.value);

    function setSession({ token: t, user: u }) {
        if (t) {
            token.value = t;
            localStorage.setItem(TOKEN_KEY, t);
        }
        if (u) {
            user.value = u;
            localStorage.setItem(USER_KEY, JSON.stringify(u));
        }
    }

    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        isAuthenticated = false;
    }

    return {
        token,
        user,
        isAuthenticated,
        setSession,
        logout
    };
}