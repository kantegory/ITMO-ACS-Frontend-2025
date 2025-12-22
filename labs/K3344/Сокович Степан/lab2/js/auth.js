async function initNavbar() {
    const token = localStorage.getItem('token');
    
    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const profileNav = document.getElementById('profileNav');
    const logoutNav = document.getElementById('logoutNav');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (loginNav && registerNav && profileNav && logoutNav) {
        if (token) {
            try {
                const user = await authAPI.getCurrentUser();
                if (user) {
                    loginNav.style.display = 'none';
                    registerNav.style.display = 'none';
                    profileNav.style.display = 'block';
                    logoutNav.style.display = 'block';
                    
                    if (usernameDisplay) {
                        usernameDisplay.textContent = user.email || user.username;
                    }
                } else {
                    localStorage.removeItem('token');
                    loginNav.style.display = 'block';
                    registerNav.style.display = 'block';
                    profileNav.style.display = 'none';
                    logoutNav.style.display = 'none';
                }
            } catch (error) {
                console.error('Error initializing navbar:', error);
                localStorage.removeItem('token');
                loginNav.style.display = 'block';
                registerNav.style.display = 'block';
                profileNav.style.display = 'none';
                logoutNav.style.display = 'none';
            }
        } else {
            loginNav.style.display = 'block';
            registerNav.style.display = 'block';
            profileNav.style.display = 'none';
            logoutNav.style.display = 'none';
        }
    }
}

async function loginUser(email, password) {
    try {
        const result = await authAPI.login(email, password);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user.id);
        await initNavbar();
        return result;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function registerUser(email, password) {
    try {
        const result = await authAPI.register(email, password);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user.id);
        await initNavbar();
        return result;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

async function logoutUser(redirectTo = 'index.html') {
    try {
        await authAPI.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = redirectTo;
    }
}

function isAuthenticated() {
    return !!localStorage.getItem('token');
}

document.addEventListener('DOMContentLoaded', async () => {
    await initNavbar();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});
