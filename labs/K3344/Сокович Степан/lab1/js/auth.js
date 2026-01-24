function initNavbar() {
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');

    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const profileNav = document.getElementById('profileNav');
    const logoutNav = document.getElementById('logoutNav');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (loginNav && registerNav && profileNav && logoutNav) {
        if (loggedIn === 'true') {
            loginNav.style.display = 'none';
            registerNav.style.display = 'none';
            profileNav.style.display = 'block';
            logoutNav.style.display = 'block';
        } else {
            loginNav.style.display = 'block';
            registerNav.style.display = 'block';
            profileNav.style.display = 'none';
            logoutNav.style.display = 'none';
        }
    }

    if (usernameDisplay && username) {
        usernameDisplay.textContent = username;
    }
}

function loginUser(email) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', email);
    initNavbar();
}

function logoutUser(redirectTo = 'index.html') {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = redirectTo;
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});
