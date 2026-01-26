// Текущий пользователь
let currentUser = null;

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        
        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            currentUser = response.data.user;
            updateUIForLoggedInUser();
            showSection('home');
            alert('Успешный вход!');
        }
    } catch (error) {
        alert('Ошибка входа: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
    }
}

// Обработка регистрации
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    try {
        const response = await api.post('/auth/register', {
            name,
            email,
            password
        });
        
        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            currentUser = response.data.user;
            updateUIForLoggedInUser();
            showSection('home');
            alert('Регистрация успешна!');
        }
    } catch (error) {
        alert('Ошибка регистрации: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
    }
}

// Обработка выхода
function handleLogout() {
    localStorage.removeItem('token');
    currentUser = null;
    authElements.authButtons.style.display = 'block';
    authElements.userMenu.style.display = 'none';
    showSection('home');
}