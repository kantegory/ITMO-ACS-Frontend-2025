export function buildEmptyStats() {
    return {
        completedWorkouts: 0,
        burnedCalories: 0,
        workoutDays: 0,
        currentStreak: 0
    };
}

export function buildEmptyPlan() {
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

export function renderPlaceholder(container, message) {
    if (!container) {
        return;
    }
    container.innerHTML = `<div class="alert alert-info">${message}</div>`;
}

export function showFormMessage(form, message, type = 'error') {
    if (!form) {
        return;
    }

    let feedback = form.querySelector('.form-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback mt-2';
        form.appendChild(feedback);
    }

    feedback.textContent = message;
    feedback.classList.remove('text-danger', 'text-success');
    feedback.classList.add(type === 'error' ? 'text-danger' : 'text-success');
}

export function mapPlanStatus(status) {
    const statusMap = {
        scheduled: 'Запланировано',
        completed: 'Выполнено'
    };
    return statusMap[status] || 'В процессе';
}
