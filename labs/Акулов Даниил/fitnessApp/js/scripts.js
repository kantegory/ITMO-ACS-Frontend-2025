document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');

    if (user && authLinks && userLinks) {
        authLinks.classList.add('d-none');
        userLinks.classList.remove('d-none');
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) usernameDisplay.textContent = user.name;
    } else if (authLinks && userLinks) {
        authLinks.classList.remove('d-none');
        userLinks.classList.add('d-none');
    }
}

document.addEventListener('WorkoutCardsLoaded', function() {
    const levelFilter = document.getElementById('levelFilter');
    const typeFilter = document.getElementById('typeFilter');

    if (levelFilter && typeFilter) {
        levelFilter.addEventListener('change', filterWorkouts);
        typeFilter.addEventListener('change', filterWorkouts);
    }
})
function filterWorkouts() {
    const level = document.getElementById('levelFilter').value;
    const type = document.getElementById('typeFilter').value;

    const cards = document.querySelectorAll('.workout-card');

    cards.forEach(card => {
        const cardLevel = card.dataset.level;
        const cardType = card.dataset.type;

        let isLevelMatch = (level === 'all' || cardLevel === level);
        let isTypeMatch = (type === 'all' || cardType === type);

        if (isLevelMatch && isTypeMatch) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}

function getPrettyDate(iso){
    const date = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth()+1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}