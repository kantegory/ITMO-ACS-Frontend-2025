import { ref, computed } from 'vue';

export function useWorkoutFilters() {
    const levelFilter = ref('all');
    const typeFilter = ref('all');
    const durationFilter = ref('all');

    const workoutQuery = computed(() => {
        const params = {};

        if (levelFilter.value !== 'all') {
            params.level = levelFilter.value;
        }

        if (typeFilter.value !== 'all') {
            params.type = typeFilter.value;
        }

        if (durationFilter.value !== 'all') {
            const durationValue = parseInt(durationFilter.value, 10);
            if (durationValue === 60) {
                params.duration_gte = durationValue;
            } else {
                params.duration = durationValue;
            }
        }

        return params;
    });

    return {
        levelFilter,
        typeFilter,
        durationFilter,
        workoutQuery
    };
}

export function useBlogFilters() {
    const searchQuery = ref('');
    const categoryFilter = ref('all');

    const blogQuery = computed(() => {
        const params = {};

        if (categoryFilter.value !== 'all') {
            params.category = categoryFilter.value;
        }

        if (searchQuery.value.trim()) {
            params.q = searchQuery.value.trim();
        }

        return params;
    });

    return {
        searchQuery,
        categoryFilter,
        blogQuery
    };
}

export const levelNames = {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
};

export const typeNames = {
    cardio: 'Кардио',
    strength: 'Силовые',
    yoga: 'Йога',
    stretch: 'Растяжка'
};

export const categoryNames = {
    nutrition: 'Питание',
    health: 'Здоровье',
    motivation: 'Мотивация'
};

export const dayLabels = [
    { key: 'monday', label: 'Понедельник' },
    { key: 'tuesday', label: 'Вторник' },
    { key: 'wednesday', label: 'Среда' },
    { key: 'thursday', label: 'Четверг' },
    { key: 'friday', label: 'Пятница' },
    { key: 'saturday', label: 'Суббота' },
    { key: 'sunday', label: 'Воскресенье' }
];

export function mapPlanStatus(status) {
    const statusMap = {
        scheduled: 'Запланировано',
        completed: 'Выполнено'
    };
    return statusMap[status] || 'В процессе';
}
