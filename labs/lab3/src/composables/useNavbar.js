import { computed } from 'vue';
import { useAuth } from './useAuth';
import { useRouter, useRoute } from 'vue-router';

export function useNavbar() {
    const auth = useAuth();
    const router = useRouter();
    const route = useRoute();

    const isAuth = computed(() => auth.isAuthenticated.value);
    const user = computed(() => auth.user.value);

    async function doLogout() {
        auth.logout();
        await router.push('/login');
    }

    const menuItems = computed(() => {
        if (!isAuth.value) {
            return [
                { name: 'login', label: 'Вход', to: '/login', icon: 'icon-box-arrow-in-right' },
                { name: 'register', label: 'Регистрация', to: '/register', icon: 'icon-person-plus' }
            ];
        }

        return [
            { name: 'profile', label: 'Профиль', to: '/profile', icon: 'icon-person-badge' },
            { name: 'logout', label: 'Выйти', action: () => doLogout(), icon: 'icon-box-arrow-right' }
        ];
    });

    function isActive(path) {
        return route.path === path;
    }

    return {
        isAuth,
        user,
        menuItems,
        isActive,
        doLogout
    };
}