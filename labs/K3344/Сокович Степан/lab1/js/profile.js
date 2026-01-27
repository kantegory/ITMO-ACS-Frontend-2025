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
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.textContent.trim();
            profileContent.innerHTML = panes[tabName];
        });
    });
});


window.addEventListener('DOMContentLoaded', () => {
    const bookingModalEl = document.createElement('div');
    bookingModalEl.classList.add('modal', 'fade');
    bookingModalEl.id = 'bookingModal';
    bookingModalEl.tabIndex = -1;
    bookingModalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Детали бронирования</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="bookingModalBody">
                    Здесь будет информация о бронировании.
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(bookingModalEl);

    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));

    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            const title = cardBody.querySelector('strong').textContent;
            const dates = cardBody.querySelector('div').nextSibling?.textContent || '';

            document.getElementById('bookingModalBody').innerHTML = `
                <p><strong>Объект:</strong> ${title}</p>
                <p><strong>Срок аренды:</strong> ${dates}</p>
            `;

            bookingModal.show();
        });
    });
});

