let userDB = JSON.parse(localStorage.getItem('userDB')) || {};

function getUserByEmail(email) {
    return userDB[email] || null;
}

function addUser(userData) {
    userDB[userData.email] = userData;
    localStorage.setItem('userDB', JSON.stringify(userDB));
    console.log('curr users db:', userDB);
}

function showAlert(message, type = 'danger') {
    const alertElement = document.getElementById('alertMessage');
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.classList.remove('d-none');
                
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 5000);
}

function register(event) {
    event.preventDefault();

    const name = document.getElementById('username').value;
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

    if (getUserByEmail(email)) {
        showAlert('User with this email already exists!');
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password
    };
                
    addUser(newUser);
                
    showAlert('Registration successful! Redirecting to login...', 'success');
                
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

async function login(event) {
    event.preventDefault()

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = getUserByEmail(email);
    
    if (!user) {
        showAlert('No user with this email address was found. Sign up!');
        return;
    }
    
    if (user.password !== password) {
        showAlert('Wrong password!');
        return;
    }
    
    showAlert('Success! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('cur db of users:', userDB);
});