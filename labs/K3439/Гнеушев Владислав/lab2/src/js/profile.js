import { syncCurrentUser, updateUserProfile } from './api.js';
import { state } from './state.js';
import { buildEmptyPlan, buildEmptyStats, mapPlanStatus, showFormMessage } from './utils.js';

export async function initProfilePage() {
    const profileNameElement = document.getElementById('userName');
    if (!profileNameElement) {
        return;
    }

    const user = await syncCurrentUser();

    if (!user) {
        alert('Войдите в аккаунт чтобы открыть профиль');
        window.location.href = 'login.html';
        return;
    }

    renderProfile(user);
    initProfileForm(user);
}

function renderProfile(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;

    const stats = user.stats || buildEmptyStats();
    document.getElementById('completedWorkouts').textContent = stats.completedWorkouts ?? 0;
    document.getElementById('burnedCalories').textContent = stats.burnedCalories ?? 0;
    document.getElementById('workoutDays').textContent = stats.workoutDays ?? 0;
    document.getElementById('currentStreak').textContent = stats.currentStreak ?? 0;

    renderWorkoutPlanTable(user.plan);
}

function initProfileForm(user) {
    const editProfileForm = document.getElementById('editProfileForm');
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');

    if (!editProfileForm || !nameInput || !emailInput) {
        return;
    }

    nameInput.value = user.name;
    emailInput.value = user.email;

    editProfileForm.addEventListener('submit', async event => {
        event.preventDefault();

        try {
            const updatedUser = await updateUserProfile({
                id: state.currentUser.id,
                name: nameInput.value.trim(),
                email: emailInput.value.trim()
            });

            renderProfile(updatedUser);
            const modalElement = document.getElementById('editProfileModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
            showFormMessage(editProfileForm, 'Данные обновлены', 'success');
        } catch (error) {
            console.error(error);
            showFormMessage(editProfileForm, 'Не удалось сохранить изменения');
        }
    });
}

function renderWorkoutPlanTable(plan = buildEmptyPlan()) {
    const tableBody = document.getElementById('workoutPlanTable');
    if (!tableBody) {
        return;
    }

    const days = [
        { key: 'monday', label: 'Понедельник' },
        { key: 'tuesday', label: 'Вторник' },
        { key: 'wednesday', label: 'Среда' },
        { key: 'thursday', label: 'Четверг' },
        { key: 'friday', label: 'Пятница' },
        { key: 'saturday', label: 'Суббота' },
        { key: 'sunday', label: 'Воскресенье' }
    ];

    tableBody.innerHTML = '';

    days.forEach(day => {
        const entry = plan?.[day.key];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day.label}</td>
            <td>${entry ? entry.title : '-'}</td>
            <td>${entry ? `${entry.duration} мин` : '-'}</td>
            <td>${entry ? mapPlanStatus(entry.status) : '-'}</td>
        `;
        tableBody.appendChild(row);
    });
}
