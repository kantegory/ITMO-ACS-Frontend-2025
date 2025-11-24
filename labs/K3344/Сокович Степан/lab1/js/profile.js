window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.list-group-item');
    const profileContent = document.querySelector('.col-md-9');

    const profilePane = profileContent.innerHTML; // изначальный контент профиля
    const rentalsPane = `
        <h5>Активные бронирования</h5>
        <p>Здесь будут ваши аренды</p>
    `;
    const myListingsPane = `
        <h5>Ваши объявления</h5>
        <p>Здесь будут ваши объявления</p>
    `;
    const messagesPane = `
        <h5>Сообщения</h5>
        <p>Здесь будут ваши сообщения</p>
    `;

    const panes = {
        'Профиль': profilePane,
        'Мои аренды': rentalsPane,
        'Мои объявления': myListingsPane,
        'Сообщения': messagesPane
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            // Снять active со всех вкладок
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.textContent.trim();
            profileContent.innerHTML = panes[tabName];
        });
    });
});
