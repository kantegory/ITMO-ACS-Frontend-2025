import axios from 'axios';
import { API_BASE_URL, _persistUser } from './useAuth';
import { useAuth } from './useAuth';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

function buildEmptyStats() {
    return {
        completedWorkouts: 0,
        burnedCalories: 0,
        workoutDays: 0,
        currentStreak: 0
    };
}

function buildEmptyPlan() {
    return {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null
    };
}

export function useApi() {
    const { currentUser } = useAuth();

    async function fetchWorkouts(filters = {}) {
        try {
            const { data } = await apiClient.get('workouts', { params: filters });
            return data;
        } catch (error) {
            throw new Error('Не удалось получить список тренировок');
        }
    }

    async function fetchWorkoutById(id) {
        try {
            const { data } = await apiClient.get(`workouts/${id}`);
            return data;
        } catch (error) {
            throw new Error('Не удалось получить тренировку');
        }
    }

    async function fetchBlogPosts(filters = {}) {
        try {
            const { data } = await apiClient.get('blogPosts', { params: filters });
            return data;
        } catch (error) {
            throw new Error('Не удалось получить статьи');
        }
    }

    async function fetchBlogPostById(id) {
        try {
            const { data } = await apiClient.get(`blogPosts/${id}`);
            return data;
        } catch (error) {
            throw new Error('Не удалось получить статью');
        }
    }

    async function loginUser(email, password) {
        if (!email || !password) {
            throw new Error('Введите email и пароль');
        }

        let users;
        try {
            const response = await apiClient.get('users', { params: { email, password } });
            users = response.data;
        } catch (error) {
            throw new Error('Не удалось выполнить вход');
        }
        if (!users.length) {
            throw new Error('Неверный email или пароль');
        }

        _persistUser(users[0]);
        return users[0];
    }

    async function registerUser({ name, email, password }) {
        if (!name || !email || !password) {
            throw new Error('Заполните все поля');
        }

        let duplicates;
        try {
            const response = await apiClient.get('users', { params: { email } });
            duplicates = response.data;
        } catch (error) {
            throw new Error('Не удалось проверить email');
        }
        if (duplicates.length) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const payload = {
            name,
            email,
            password,
            stats: buildEmptyStats(),
            plan: buildEmptyPlan()
        };

        let newUser;
        try {
            const response = await apiClient.post('users', payload);
            newUser = response.data;
        } catch (error) {
            throw new Error('Не удалось завершить регистрацию');
        }
        _persistUser(newUser);
        return newUser;
    }

    async function updateUserProfile({ id, name, email }) {
        try {
            const { data: updatedUser } = await apiClient.patch(`users/${id}`, { name, email });
            _persistUser(updatedUser);
            return updatedUser;
        } catch (error) {
            throw new Error('Не удалось обновить профиль');
        }
    }

    async function saveWorkoutToPlan(dayKey, workout) {
        const user = currentUser.value;
        if (!user) {
            throw new Error('Нет авторизованного пользователя');
        }

        const existingPlan = user.plan || buildEmptyPlan();
        const updatedPlan = {
            ...existingPlan,
            [dayKey]: {
                workoutId: workout.id,
                title: workout.title,
                duration: workout.duration,
                status: 'scheduled'
            }
        };

        try {
            const { data: updatedUser } = await apiClient.patch(`users/${user.id}`, { plan: updatedPlan });
            _persistUser(updatedUser);
        } catch (error) {
            throw new Error('Не удалось обновить план');
        }
    }

    async function syncCurrentUser() {
        if (!currentUser.value?.id) {
            return null;
        }

        try {
            const { data: freshUser } = await apiClient.get(`users/${currentUser.value.id}`);
            _persistUser(freshUser);
            return freshUser;
        } catch (error) {
            console.warn('Синхронизация профиля недоступна', error);
            return currentUser.value;
        }
    }

    return {
        fetchWorkouts,
        fetchWorkoutById,
        fetchBlogPosts,
        fetchBlogPostById,
        loginUser,
        registerUser,
        updateUserProfile,
        saveWorkoutToPlan,
        syncCurrentUser,
        buildEmptyStats,
        buildEmptyPlan
    };
}
