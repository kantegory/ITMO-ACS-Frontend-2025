
function showMessage(messageText) {
    const el = document.getElementById('message');
    if (!el) return;

    el.innerText = messageText;
    el.classList.remove('d-none');
    el.classList.add('d-block');

    setTimeout(() => {
        el.classList.add('d-none');
        el.classList.remove('d-block');
    }, 5000);
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password-confirm').value;

    if (!username || !password || !password_confirm) {
        showMessage('Все поля обязательны');
        return;
    }

    const responseJson = await sendRequest(`${BACKEND_URL}/api/register`, 'POST', {
        username, 
        password, 
        password_confirm,
    });

    if (responseJson.success) {
        redirectToLogin();
    } else {
        showMessage(`Ошибка: ${responseJson.detail}`);
    }
}

async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showMessage('Все поля обязательны');
        return;
    }

    const responseJson = await sendRequest(`${BACKEND_URL}/api/login`, 'POST', { 
        username, 
        password,
    });

    if (responseJson.success) {
        saveToken(responseJson.data[TOKEN_KEY]);
        window.location.href = 'user.html';
    } else {
        showMessage(`Ошибка: ${responseJson.detail}`);
    }
}