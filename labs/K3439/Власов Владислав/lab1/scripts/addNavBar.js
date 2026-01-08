document.querySelector('header').insertAdjacentHTML('afterbegin', 
    `<nav class="navbar navbar-expand-lg navbar-light mb-5 mx-auto" aria-label="Основная навигация" style="background-color: #D4C17F;">
        <form class="container-fluid justify-content-start">
            <button id="navbar-btn-characters" class="btn btn-outline-dark me-2" type="button">Персонажи</button>
            <button id="navbar-btn-skills" class="btn btn-outline-dark me-2" type="button">Навыки</button>
            <button id="navbar-btn-edges" class="btn disabled btn-outline-dark me-2" type="button">Черты</button>
            <button id="navbar-btn-items" class="btn disabled btn-outline-dark me-2" type="button">Предметы</button>
        </form>
        <form class="container-fluid justify-content-end">
            <button id="navbar-btn-changeTheme" class="btn btn-outline-dark me-2" type="button">Сменить тему</button>
            <a class="nav-link" aria-current="page" href="profile.html">Профиль</a>
            <a class="nav-link" aria-current="page" href="sign-in.html">Выйти</a>
        </form>
    </nav>`
);

const currentFile = window.location.pathname.split('/').pop();

switch (currentFile) {
    case 'characters.html':
        document.getElementById("navbar-btn-characters").classList.add('active')
        break;
    case 'skills.html':
        document.getElementById("navbar-btn-skills").classList.add('active')
        break;
}