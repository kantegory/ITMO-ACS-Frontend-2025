const themeToggleBtn = document.createElement('button');
themeToggleBtn.id = 'themeToggle';
themeToggleBtn.style.position = 'fixed';
themeToggleBtn.style.bottom = '20px';
themeToggleBtn.style.right = '20px';
themeToggleBtn.style.width = '180px';
themeToggleBtn.style.height = '50px';
themeToggleBtn.style.backgroundColor = '#0d6efd';
themeToggleBtn.style.border = 'none';
themeToggleBtn.style.borderRadius = '25px';
themeToggleBtn.style.cursor = 'pointer';
themeToggleBtn.style.zIndex = '1000';
themeToggleBtn.style.display = 'flex';
themeToggleBtn.style.alignItems = 'center';
themeToggleBtn.style.justifyContent = 'flex-start';
themeToggleBtn.style.padding = '0 10px';
themeToggleBtn.style.transition = 'background-color 0.3s, color 0.3s';
themeToggleBtn.style.color = '#fff';
themeToggleBtn.style.fontWeight = '600';
themeToggleBtn.style.fontSize = '1rem';
themeToggleBtn.style.position = 'fixed';

const toggleText = document.createElement('span');
toggleText.innerText = localStorage.getItem('theme') === 'dark' ? 'Светлая тема️' : 'Темная тема';
toggleText.style.flexGrow = '1';
toggleText.style.textAlign = 'center';
toggleText.style.pointerEvents = 'none';
toggleText.style.userSelect = 'none';
themeToggleBtn.appendChild(toggleText);

const toggleCircle = document.createElement('div');
toggleCircle.style.width = '36px';
toggleCircle.style.height = '36px';
toggleCircle.style.backgroundColor = '#fff';
toggleCircle.style.borderRadius = '50%';
toggleCircle.style.transition = 'transform 0.3s';
toggleCircle.style.marginLeft = '5px';
toggleCircle.style.transform = localStorage.getItem('theme') === 'dark' ? 'translateX(130px)' : 'translateX(0)'; // учитываем увеличенную ширину
themeToggleBtn.appendChild(toggleCircle);

document.body.appendChild(themeToggleBtn);

if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleCircle.style.transform = isDark ? 'translateX(130px)' : 'translateX(0)';
    toggleText.innerText = isDark ? 'Светлая тема️' : 'Темная тема';
    themeToggleBtn.style.backgroundColor = isDark ? '#3390ff' : '#0d6efd';
});