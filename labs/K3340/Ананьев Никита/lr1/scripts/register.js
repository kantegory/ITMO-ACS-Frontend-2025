async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const exists = await identifyUser(email);
    if (exists) {
        alert('Пользователь с таким email уже зарегистрирован');
        return;
    }

    try {
        const response = await fetch(
            URL, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({name, email, phone, password, role: DEFAULT_ROLE})
            }
        );

        if (!response.ok) 
            throw new Error(`HTTP error, status: ${response.status}`);

        window.location.href = 'login.html';

    } catch (e) {
        console.error(e);
        alert('Ошибка регистрации');
    }
}
