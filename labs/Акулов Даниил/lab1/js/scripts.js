document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    const levelFilter = document.getElementById('levelFilter');
    const typeFilter = document.getElementById('typeFilter');
    const durationFilter = document.getElementById('durationFilter');
    
    if (levelFilter && typeFilter && durationFilter) {
        levelFilter.addEventListener('change', filterWorkouts);
        typeFilter.addEventListener('change', filterWorkouts);
        durationFilter.addEventListener('change', filterWorkouts);
    }

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

function filterWorkouts() {
    const level = document.getElementById('levelFilter').value;
    const type = document.getElementById('typeFilter').value;
    const duration = document.getElementById('durationFilter').value;

    const cards = document.querySelectorAll('.workout-card');

    cards.forEach(card => {
        const cardLevel = card.dataset.level;
        const cardType = card.dataset.type;
        const cardDuration = parseInt(card.dataset.duration);

        let isLevelMatch = (level === 'all' || cardLevel === level);
        let isTypeMatch = (type === 'all' || cardType === type);
        let isDurationMatch = true;

        if (duration !== 'all') {
            if (duration === 'short') isDurationMatch = cardDuration < 30;
            if (duration === 'medium') isDurationMatch = cardDuration >= 30 && cardDuration <= 60;
            if (duration === 'long') isDurationMatch = cardDuration > 60;
        }

        if (isLevelMatch && isTypeMatch && isDurationMatch) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}

function login(email, password) {
    if (email && password) {
        const user = {
            name: email.split('@')[0],
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}
