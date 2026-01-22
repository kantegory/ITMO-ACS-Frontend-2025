<template>
    <div class="error-page">
        <div class="error-card">
            <div class="error-code">{{ props.code }}</div>
            <h1>{{ error.title }}</h1>
            <p>{{ error.description }}</p>

            <div class="actions">
                <button class="back-main" @click="router.push('/main')">
                    На главную
                </button>
                <button class="back" @click="router.back()">
                    Назад
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    code: {
        type: Number,
        default: 404
    }
})

const router = useRouter()

const errorMap = {
    400: {
        title: 'Неверный запрос',
        description: 'Запрос содержит ошибку или устаревшие данные.'
    },
    404: {
        title: 'Страница не найдена',
        description: 'Возможно, она была удалена или вы перешли по неверной ссылке.'
    },
    500: {
        title: 'Ошибка сервера',
        description: 'Мы уже работаем над этим. Попробуйте позже.'
    }
}

const error = computed(() =>
    errorMap[props.code] || errorMap[404]
)
</script>

<style scoped>
.error-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-page);
    color: var(--text-main);
}

.error-card {
    background: var(--bg-surface);
    padding: 48px;
    border-radius: 20px;
    text-align: center;
    max-width: 420px;
    width: 100%;
    box-shadow: var(--shadow-main);
}

.error-code {
    font-size: 96px;
    font-weight: 700;
    color: var(--green-accent);
    line-height: 1;
    margin-bottom: 16px;
}

h1 {
    color: var(--green-main);
    margin-bottom: 12px;
}

p {
    opacity: 0.85;
    margin-bottom: 32px;
}

.actions {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.back-main {
    background: var(--green-accent);
    color: var(--bg-surface);
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    cursor: pointer;
}

.back {
    background: transparent;
    border: 1px solid var(--border-main);
    color: var(--text-main);
    border-radius: 12px;
    padding: 12px 20px;
    cursor: pointer;
}

.back-main:hover {
    background: var(--green-btn-hover);
}

.back:hover {
    background: var(--bg-hover);
}
</style>