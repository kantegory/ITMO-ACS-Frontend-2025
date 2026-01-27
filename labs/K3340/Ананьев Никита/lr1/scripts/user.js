document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('navLinks');
    const user = JSON.parse(localStorage.getItem('user'));

    nav.innerHTML = '<a href="#">О компании</a>';

    if (!user) {
        nav.innerHTML += `
            <a href="login.html">Войти</a>
            <a href="register.html">Регистрация</a>
        `;
    } else {
        nav.innerHTML += `
            <a href="#">Сдать в аренду</a>
            <a href="#">Чаты</a>
            <a href="profile.html">${user.email}</a>
        `;
    }
});

async function identifyUserByEmail(email) {
    let exists = false;

    await fetch(`${USERS_URL}?email=${email}`)
        .then((response) => {
            return response.json();    
        })
        .then((data) => {
            exists = (data.length > 0) ? true : false;
        })
    
    return exists;
}

async function getUserById(id) {
    return fetch(`${USERS_URL}?id=${id}`)
        .then((response) => response.json())
        .then((data) => data[0])
        .catch((error) => {
            console.error('Error fetching user:', error);
            return undefined;
        });
}
