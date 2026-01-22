import { fetchWorkoutById, fetchWorkouts, saveWorkoutToPlan, syncCurrentUser } from './api.js';
import { state } from './state.js';
import { renderPlaceholder } from './utils.js';

export async function initWorkoutsPage() {
    const container = document.getElementById('workoutsContainer');
    if (!container) {
        return;
    }

    renderPlaceholder(container, 'Загружаем тренировки...');

    try {
        state.workouts = await fetchWorkouts();
        renderWorkouts(state.workouts);
        initWorkoutFilters();
    } catch (error) {
        console.error(error);
    }
}

export async function initWorkoutDetailPage() {
    const titleElement = document.getElementById('workoutTitle');
    if (!titleElement) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const workoutId = parseInt(urlParams.get('id'), 10);

    if (!Number.isFinite(workoutId)) {
        titleElement.textContent = 'Тренировка не найдена';
        return;
    }

    try {
        const workout = await fetchWorkoutById(workoutId);
        renderWorkoutDetail(workout);
        initAddToPlanModal(workout);
    } catch (error) {
        console.error(error);
        titleElement.textContent = 'Не удалось загрузить тренировку';
    }
}

function initWorkoutFilters() {
    const levelSelect = document.getElementById('filterLevel');
    const typeSelect = document.getElementById('filterType');
    const durationSelect = document.getElementById('filterDuration');

    [levelSelect, typeSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', applyWorkoutFilters);
        }
    });
}

function applyWorkoutFilters() {
    if (!state.workouts.length) {
        return;
    }

    const levelFilter = document.getElementById('filterLevel')?.value || 'all';
    const typeFilter = document.getElementById('filterType')?.value || 'all';
    const durationFilter = document.getElementById('filterDuration')?.value || 'all';

    let filtered = [...state.workouts];

    if (levelFilter !== 'all') {
        filtered = filtered.filter(workout => workout.level === levelFilter);
    }

    if (typeFilter !== 'all') {
        filtered = filtered.filter(workout => workout.type === typeFilter);
    }

    if (durationFilter !== 'all') {
        const durationValue = parseInt(durationFilter, 10);
        filtered = filtered.filter(workout => {
            if (durationValue === 60) {
                return workout.duration >= durationValue;
            }
            return workout.duration === durationValue;
        });
    }

    renderWorkouts(filtered);
}

function renderWorkouts(workoutsToRender) {
    const container = document.getElementById('workoutsContainer');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (!workoutsToRender.length) {
        container.innerHTML = '<p class="text-muted">Тренировки не найдены. Попробуйте изменить фильтры.</p>';
        return;
    }

    const levelNames = {
        beginner: 'Начинающий',
        intermediate: 'Средний',
        advanced: 'Продвинутый'
    };

    const typeNames = {
        cardio: 'Кардио',
        strength: 'Силовые',
        yoga: 'Йога',
        stretch: 'Растяжка'
    };

    workoutsToRender.forEach(workout => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card workout-card" onclick="goToWorkout(${workout.id})">
                <div class="card-body">
                    <h5 class="card-title">${workout.title}</h5>
                    <p class="card-text">
                        <strong>Уровень:</strong> ${levelNames[workout.level] || '-'}<br>
                        <strong>Тип:</strong> ${typeNames[workout.type] || '-'}<br>
                        <strong>Продолжительность:</strong> ${workout.duration} мин
                    </p>
                    <a href="workout-detail.html?id=${workout.id}" class="btn btn-primary">Подробнее</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function goToWorkout(id) {
    window.location.href = `workout-detail.html?id=${id}`;
}

function renderWorkoutDetail(workout) {
    const levelNames = {
        beginner: 'Начинающий',
        intermediate: 'Средний',
        advanced: 'Продвинутый'
    };

    const typeNames = {
        cardio: 'Кардио',
        strength: 'Силовые',
        yoga: 'Йога',
        stretch: 'Растяжка'
    };

    document.getElementById('workoutTitle').textContent = workout.title;
    document.getElementById('workoutLevel').textContent = `Уровень: ${levelNames[workout.level] || '-'}`;
    document.getElementById('workoutType').textContent = `Тип: ${typeNames[workout.type] || '-'}`;
    document.getElementById('workoutDuration').textContent = `Продолжительность: ${workout.duration} минут`;
    document.getElementById('workoutDescription').textContent = workout.description;
    document.getElementById('workoutVideo').src = workout.video;

    const accordion = document.getElementById('instructionsAccordion');
    accordion.innerHTML = '';

    workout.instructions?.forEach((inst, index) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                    ${inst.step}. ${inst.title}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}">
                <div class="accordion-body">
                    ${inst.description}
                </div>
            </div>
        `;
        accordion.appendChild(item);
    });

    const equipmentList = document.getElementById('equipmentList');
    equipmentList.innerHTML = '';
    workout.equipment?.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        equipmentList.appendChild(li);
    });
}

function initAddToPlanModal(workout) {
    const addToPlanBtn = document.getElementById('addToPlanBtn');
    const confirmBtn = document.getElementById('confirmAddToPlanBtn');
    const workoutTitleDisplay = document.getElementById('workoutTitleDisplay');
    const dayOfWeekSelect = document.getElementById('dayOfWeek');
    const modalElement = document.getElementById('addToPlanModal');

    if (!addToPlanBtn || !confirmBtn || !workoutTitleDisplay || !dayOfWeekSelect || !modalElement) {
        return;
    }

    const addToPlanModal = new bootstrap.Modal(modalElement);

    addToPlanBtn.addEventListener('click', () => {
        workoutTitleDisplay.value = workout.title;
        dayOfWeekSelect.value = '';
        addToPlanModal.show();
    });

    confirmBtn.addEventListener('click', async () => {
        if (!dayOfWeekSelect.value) {
            alert('Пожалуйста, выберите день недели');
            return;
        }

        const user = await syncCurrentUser();
        if (!user) {
            alert('Авторизуйтесь, чтобы составлять план');
            window.location.href = 'login.html';
            return;
        }

        try {
            await saveWorkoutToPlan(dayOfWeekSelect.value, workout);
            addToPlanModal.hide();
            alert('Тренировка добавлена в план');
        } catch (error) {
            console.error(error);
            alert('Не удалось сохранить тренировку в план');
        }
    });
}

window.goToWorkout = goToWorkout;
