import { API_BASE_URL } from './constants.js';
import { state, persistUser } from './state.js';
import { buildEmptyPlan, buildEmptyStats } from './utils.js';

export async function fetchWorkouts() {
    const response = await fetch(`${API_BASE_URL}/workouts`);
    if (!response.ok) {
        throw new Error('Не удалось получить список тренировок');
    }
    return response.json();
}

export async function fetchWorkoutById(id) {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`);
    if (!response.ok) {
        throw new Error('Не удалось получить тренировку');
    }
    return response.json();
}

export async function fetchBlogPosts() {
    const response = await fetch(`${API_BASE_URL}/blogPosts`);
    if (!response.ok) {
        throw new Error('Не удалось получить статьи');
    }
    return response.json();
}

export async function fetchBlogPostById(id) {
    const response = await fetch(`${API_BASE_URL}/blogPosts/${id}`);
    if (!response.ok) {
        throw new Error('Не удалось получить статью');
    }
    return response.json();
}

export async function loginUser(email, password) {
    if (!email || !password) {
        throw new Error('Введите email и пароль');
    }

    const params = new URLSearchParams({ email, password });
    const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Не удалось выполнить вход');
    }

    const users = await response.json();
    if (!users.length) {
        throw new Error('Неверный email или пароль');
    }

    persistUser(users[0]);
    return users[0];
}

export async function registerUser({ name, email, password }) {
    if (!name || !email || !password) {
        throw new Error('Заполните все поля');
    }

    const duplicateResponse = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`);
    if (!duplicateResponse.ok) {
        throw new Error('Не удалось проверить email');
    }

    const duplicates = await duplicateResponse.json();
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

    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Не удалось завершить регистрацию');
    }

    const newUser = await response.json();
    persistUser(newUser);
    return newUser;
}

export async function updateUserProfile({ id, name, email }) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить профиль');
    }

    const updatedUser = await response.json();
    persistUser(updatedUser);
    return updatedUser;
}

export async function saveWorkoutToPlan(dayKey, workout) {
    const user = state.currentUser;
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

    const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: updatedPlan })
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить план');
    }

    const updatedUser = await response.json();
    persistUser(updatedUser);
}

export async function syncCurrentUser() {
    if (!state.currentUser?.id) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${state.currentUser.id}`);
        if (!response.ok) {
            throw new Error('Не удалось обновить данные пользователя');
        }
        const freshUser = await response.json();
        persistUser(freshUser);
        return freshUser;
    } catch (error) {
        console.warn('Синхронизация профиля недоступна', error);
        return state.currentUser;
    }
}
