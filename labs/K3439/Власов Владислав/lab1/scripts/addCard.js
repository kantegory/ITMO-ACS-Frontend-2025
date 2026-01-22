const skills = ['Атлетика', 'Военное дело', 'Осведомлённость', 'Драка', 'Запугивание', 'Внимание', 'Убеждение', 'Стрельба', 'Скрытность', 'Выживание']

skills.forEach(name => {
    const container = document.querySelector(".list-group");
    container.insertAdjacentHTML('afterbegin',
        `
        <li class="skill list-group-item">${name}</li>
        `)
});