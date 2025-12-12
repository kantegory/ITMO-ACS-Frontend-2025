const url = 'http://localhost:3000';

function showAlert(message, type = 'danger') {
    const alertElement = document.getElementById('alertMessage');
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.classList.remove('d-none');
                
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 5000);
}

async function register(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password1').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!');
        return;
    }

    try {
        const response = await fetch(`${url}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username 
            })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Registration successful! Redirecting...', 'success');
            
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = 'extra-reg.html';
            }, 1500);
        } else {
            showAlert(data.message || 'Registration failed! Email may already exist.');
        }
    } catch (error) {
        console.error('registration error:', error);
        showAlert('server error, please try again.');
    }
}

async function addInfo(event) {
    event.preventDefault();

    const nameSurname = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${url}/users/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: nameSurname,
                bio: bio
            })
        });

        if (!response.ok) {
            showAlert('Failed to save profile information');
            return;
        }

        const updatedUser = await response.json();
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        showAlert('Profile information saved!', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const loginData = {
            email: email,
            password: password
        };
        
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = await response.text();
            }
            showAlert(errorMessage);
            return;
        }

        showAlert('Success! Redirecting...', 'success');

        const data = await response.json();
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showAlert('server error, please try again.');
    }
}

function logout() {
    localStorage.clear()
    window.location.href = 'index.html'
}

function checkAuth() {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    //автоматический переброс по маршруту: register - extra-reg - login - main
    if ((window.location.pathname.includes('login.html') || 
         window.location.pathname.includes('register.html')) &&
        token && user) {
        window.location.href = 'main.html';
    }
    
    //а тут наоборот выкидывает, если находясь залогиненым, токена не нашлось
    if (window.location.pathname.includes('main.html') && !token) {
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

window.register = register;
window.login = login;
window.logout = logout;
window.checkAuth = checkAuth;