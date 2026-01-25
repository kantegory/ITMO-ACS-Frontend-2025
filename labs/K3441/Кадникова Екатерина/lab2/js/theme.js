const themeToggle = document.createElement('div');
themeToggle.className = 'theme-toggle';

const label = document.createElement('span');
label.className = 'label';

const circle = document.createElement('div');
circle.className = 'circle';

const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
icon.classList.add('icon');

const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
icon.appendChild(use);
circle.appendChild(icon);

themeToggle.appendChild(label);
themeToggle.appendChild(circle);
document.body.appendChild(themeToggle);

const isDark = localStorage.getItem('theme') === 'dark';
document.body.classList.toggle('dark-theme', isDark);
themeToggle.classList.toggle('dark', isDark);

label.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
use.setAttribute('href', isDark
    ? '../assets/icons.svg#icon-moon'
    : '../assets/icons.svg#icon-sun'
);

themeToggle.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark-theme');
    themeToggle.classList.toggle('dark', dark);

    localStorage.setItem('theme', dark ? 'dark' : 'light');

    label.textContent = dark ? 'Светлая тема' : 'Тёмная тема';
    use.setAttribute(
        'href',
        dark
            ? '../assets/icons.svg#icon-moon'
            : '../assets/icons.svg#icon-sun'
    );
});