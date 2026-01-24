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
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!firstName || !lastName || !email || !password) {
        showMessage('Все поля обязательны');
        return;
    }

    const { ok, status, data } = await sendJsonRequest(`${API_BASE.AUTH}/auth/register`, 'POST', {
        email, password, first_name: firstName, last_name: lastName,
    });

    if (ok) {
        saveToken(data.token);
        window.location.href = 'user.html?mode=me';
    } else {
        showMessage(data?.message || `Ошибка: ${status}`);
    }
}

async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Email и пароль обязательны');
        return;
    }

    const { ok, status, data } = await sendJsonRequest(`${API_BASE.AUTH}/auth/login`, 'POST', { email, password });

    if (ok) {
        saveToken(data.token);
        window.location.href = 'user.html?mode=me';
    } else {
        showMessage(data?.message || `Ошибка: ${status}`);
    }
}
