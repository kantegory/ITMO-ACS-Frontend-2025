async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${USERS_URL}?email=${email}`, {method: "GET"});

    if (!response.ok) {
        alert('Произошла ошибка. Попробуйте позднее');
        return; 
    }
        
    const userData = await response.json();

    if (userData.length == 0) {
        alert('Пользователь не найден. Зарегистрируйтесь.');
        return;
    }

    const user = userData[0];

    if (user.password === password) {
        alert('Успешный вход!');
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'main.html';
    } else {
        alert('Неверный пароль!');
    }
}
