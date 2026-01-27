async function loadProfile() {
    try {
        const user = await authAPI.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = user.email || user.username;
        }

        const profileInfo = document.getElementById('profileInfo');
        if (profileInfo) {
            profileInfo.textContent = `Краткая информация: ${user.email || ''}, ${user.phone || ''}`;
        }

        await loadBookings(user.id);
    } catch (error) {
        console.error('Error loading profile:', error);
        window.location.href = 'login.html';
    }
}

async function loadBookings(userId) {
    try {
        const bookings = await bookingsAPI.getByUserId(userId);
        const bookingsContainer = document.getElementById('bookingsContainer');
        
        if (!bookingsContainer) return;

        const oldCards = bookingsContainer.querySelectorAll('.card.mb-2[role="listitem"]');
        oldCards.forEach(card => card.remove());

        if (bookings.length === 0) {
            const noBookings = document.createElement('p');
            noBookings.className = 'text-muted';
            noBookings.textContent = 'У вас нет активных бронирований';
            noBookings.setAttribute('role', 'status');
            noBookings.setAttribute('aria-live', 'polite');
            bookingsContainer.appendChild(noBookings);
            return;
        }

        for (const booking of bookings) {
            try {
                const listing = await listingsAPI.getById(booking.listingId);
                const bookingCard = createBookingCard(booking, listing);
                bookingsContainer.appendChild(bookingCard);
            } catch (error) {
                console.error(`Error loading listing ${booking.listingId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

function createBookingCard(booking, listing) {
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.setAttribute('role', 'listitem');
    
    const startDate = new Date(booking.startDate).toLocaleDateString('ru-RU');
    const endDate = new Date(booking.endDate).toLocaleDateString('ru-RU');
    
    card.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
            <div>
                <strong>${listing.title}</strong><br>
                <span aria-label="Период аренды с ${startDate} по ${endDate}">${startDate} — ${endDate}</span>
            </div>
            <div>
                <button class="btn btn-outline-secondary btn-sm me-1 btn-view-booking" 
                        data-booking-id="${booking.id}"
                        data-listing-id="${listing.id}"
                        aria-label="Просмотреть детали бронирования: ${listing.title}">
                    <svg class="icon icon-eye" aria-hidden="true"><use href="#icon-eye"></use></svg> Просмотреть
                </button>
            </div>
        </div>
    `;

    const viewBtn = card.querySelector('.btn-view-booking');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showBookingDetails(booking, listing);
        });
    }

    return card;
}

function showBookingDetails(booking, listing) {
    const modalBody = document.getElementById('bookingModalBody');
    if (!modalBody) {
        createBookingModal();
    }

    const modalBodyEl = document.getElementById('bookingModalBody');
    const startDate = new Date(booking.startDate).toLocaleDateString('ru-RU');
    const endDate = new Date(booking.endDate).toLocaleDateString('ru-RU');
    
    modalBodyEl.innerHTML = `
        <p><strong>Объект:</strong> ${listing.title}</p>
        <p><strong>Описание:</strong> ${listing.description}</p>
        <p><strong>Тип:</strong> ${getTypeName(listing.type)}</p>
        <p><strong>Цена:</strong> ${listing.price.toLocaleString('ru-RU')} ₽ / мес</p>
        <p><strong>Район:</strong> ${listing.location}</p>
        <p><strong>Срок аренды:</strong> ${startDate} — ${endDate}</p>
        ${listing.rooms ? `<p><strong>Комнат:</strong> ${listing.rooms}</p>` : ''}
        ${listing.area ? `<p><strong>Площадь:</strong> ${listing.area} м²</p>` : ''}
    `;

    const modalElement = document.getElementById('bookingModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function createBookingModal() {
    const bookingModalEl = document.createElement('div');
    bookingModalEl.classList.add('modal', 'fade');
    bookingModalEl.id = 'bookingModal';
    bookingModalEl.tabIndex = -1;
    bookingModalEl.setAttribute('role', 'dialog');
    bookingModalEl.setAttribute('aria-labelledby', 'bookingModalTitle');
    bookingModalEl.setAttribute('aria-describedby', 'bookingModalBody');
    bookingModalEl.setAttribute('aria-hidden', 'true');
    bookingModalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="bookingModalTitle">Детали бронирования</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть модальное окно"></button>
                </div>
                <div class="modal-body" id="bookingModalBody" role="document">
                    Здесь будет информация о бронировании.
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(bookingModalEl);
}

function getTypeName(type) {
    const types = {
        'apartment': 'Квартира',
        'house': 'Дом',
        'studio': 'Студия'
    };
    return types[type] || type;
}

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.list-group-item');
    const profileContent = document.querySelector('.col-md-9');

    const profilePane = profileContent.innerHTML;
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
            if (tabName === 'Профиль') {
                loadProfile();
            } else {
                profileContent.innerHTML = panes[tabName];
            }
        });
    });

    loadProfile();
});
