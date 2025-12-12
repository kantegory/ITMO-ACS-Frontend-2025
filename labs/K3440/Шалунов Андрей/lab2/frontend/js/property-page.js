import { apiGet, apiPost, apiPut } from './api.js';
import { isLoggedIn, getCurrentUser } from './session.js';
import { logout } from './auth.js';
import { sendMessage } from './messages.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn()) {
        window.location.href = 'signin.html';
        return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.href = 'signin.html';
        });
    }

    const params = new URLSearchParams(window.location.search);
    const propertyId = Number(params.get('id'));

    const titleEl = document.querySelector('[data-property-title]');
    const breadcrumbEl = document.querySelector('[data-property-breadcrumb]');
    const addressEl = document.querySelector('[data-property-address]');
    const priceEl = document.querySelector('[data-property-price]');
    const typeEl = document.querySelector('[data-property-type]');
    const statusEl = document.querySelector('[data-property-status]');
    const ownerNameEl = document.querySelector('[data-owner-name]');
    const ownerPhoneEl = document.getElementById('ownerPhone');
    const descriptionEl = document.querySelector('[data-property-description]');

    const rentalTermsListEl = document.querySelector('[data-property-rental-terms]');
    const featuresListEl = document.querySelector('[data-property-features]');

    const mainPhoto = document.getElementById('mainPhoto');
    const thumbsContainer = document.querySelector('[data-gallery-thumbs]');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');

    const showPhoneBtn = document.getElementById('showPhoneBtn');
    const bookingForm = document.getElementById('bookingForm');
    const bookingStartInput = document.getElementById('bookingStart');
    const bookingEndInput = document.getElementById('bookingEnd');
    const bookingTotalEl = document.getElementById('bookingTotal');
    const bookingErrorEl = document.getElementById('bookingError');
    const bookingBtn = document.getElementById('createBookingBtn');

    const messageForm = document.getElementById('messageForm');
    const messageSubjectInput = document.getElementById('messageSubject');
    const messageTextInput = document.getElementById('messageText');
    const messageError = document.getElementById('messageError');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    const messageModalEl = document.getElementById('messageModal');
    const successModalEl = document.getElementById('successModal');
    const successTextEl = document.getElementById('successText');

    let messageModal = null;
    let successModal = null;

    if (messageModalEl && window.bootstrap) {
        messageModal = new window.bootstrap.Modal(messageModalEl);
    }
    if (successModalEl && window.bootstrap) {
        successModal = new window.bootstrap.Modal(successModalEl);
    }

    const TYPE_LABELS = {
        flat: 'Квартира',
        house: 'Дом',
        room: 'Комната'
    };

    let photos = [];
    let currentIndex = 0;
    let propertyOwnerId = null;
    let propertyPricePerDay = null;
    let propertyTitle = 'Объявление';
    let propertyStatus = 'available';

    function renderMainPhoto() {
        if (!mainPhoto || photos.length === 0) return;
        mainPhoto.src = photos[currentIndex] || 'https://via.placeholder.com/800x500?text=Нет+фото';
    }

    function renderThumbs() {
        if (!thumbsContainer) return;
        thumbsContainer.innerHTML = '';
        photos.forEach((url, index) => {
            const col = document.createElement('div');
            col.className = 'col-4';
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Фото объекта';
            img.className = 'img-fluid rounded js-thumb';
            if (index === currentIndex) img.classList.add('active-thumb');
            img.addEventListener('click', () => {
                currentIndex = index;
                renderMainPhoto();
                renderThumbs();
            });
            col.appendChild(img);
            thumbsContainer.appendChild(col);
        });
    }

    function fillListFromMultiline(listEl, text) {
        if (!listEl) return;
        listEl.innerHTML = '';
        if (!text) {
            const li = document.createElement('li');
            li.className = 'text-muted small';
            li.textContent = 'Информация не указана.';
            listEl.appendChild(li);
            return;
        }
        text
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)
            .forEach(itemText => {
                const li = document.createElement('li');
                li.textContent = itemText;
                listEl.appendChild(li);
            });
    }

    async function loadProperty() {
        if (!propertyId) return;
        try {
            const p = await apiGet(`/properties/${propertyId}`, { auth: true });

            propertyTitle = p.title || 'Объявление';
            propertyPricePerDay = p.price_per_day != null ? Number(p.price_per_day) : null;
            propertyOwnerId = p.owner?.user_id ?? p.owner_id ?? null;
            propertyStatus = p.status || 'available';

            if (titleEl) titleEl.textContent = propertyTitle;
            if (breadcrumbEl) breadcrumbEl.textContent = propertyTitle;
            if (addressEl) addressEl.textContent = p.location || 'Адрес не указан';
            if (priceEl) priceEl.textContent = propertyPricePerDay ? `${propertyPricePerDay} ₽ / день` : 'Цена уточняется';
            if (typeEl) typeEl.textContent = TYPE_LABELS[p.type] || p.type || '-';
            if (statusEl) statusEl.textContent = propertyStatus === 'occupied' ? 'Занято' : 'Свободно';
            if (ownerNameEl) ownerNameEl.textContent = p.owner?.name || '-';
            if (ownerPhoneEl && p.owner?.phone) ownerPhoneEl.dataset.phoneFull = p.owner.phone;
            if (descriptionEl) descriptionEl.textContent = p.description || 'Описание пока не добавлено.';

            fillListFromMultiline(rentalTermsListEl, p.rental_terms);
            fillListFromMultiline(featuresListEl, p.features);

            if (propertyStatus === 'occupied' && bookingBtn) {
                bookingBtn.disabled = true;
                bookingBtn.textContent = 'Недоступно для бронирования';
                bookingBtn.classList.add('btn-secondary');
            }
        } catch (err) {
            console.error('property load error', err);
        }
    }

    async function loadPhotos() {
        if (!propertyId) return;
        try {
            const data = await apiGet(`/photos/by-property/${propertyId}`, { auth: true });
            photos = Array.isArray(data) ? data.map(ph => ph.photo_url).filter(Boolean) : [];
            if (photos.length === 0) {
                photos = ['https://via.placeholder.com/800x500?text=Нет+фото'];
            }
            currentIndex = 0;
            renderMainPhoto();
            renderThumbs();
        } catch (err) {
            console.error('photos load error', err);
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (photos.length === 0) return;
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;
            renderMainPhoto();
            renderThumbs();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (photos.length === 0) return;
            currentIndex = (currentIndex + 1) % photos.length;
            renderMainPhoto();
            renderThumbs();
        });
    }

    if (showPhoneBtn && ownerPhoneEl) {
        showPhoneBtn.addEventListener('click', () => {
            const fullPhone = ownerPhoneEl.dataset.phoneFull;
            if (fullPhone) {
                ownerPhoneEl.textContent = fullPhone;
                ownerPhoneEl.classList.remove('text-muted');
            }
            showPhoneBtn.disabled = true;
            showPhoneBtn.textContent = 'Номер показан';
        });
    }

    if (sendMessageBtn && messageForm && messageTextInput) {
        sendMessageBtn.addEventListener('click', async e => {
            e.preventDefault();
            const text = messageTextInput.value.trim();
            const subject = messageSubjectInput?.value.trim() || '';
            if (!text) {
                messageError?.classList.remove('d-none');
                return;
            }
            messageError?.classList.add('d-none');
            if (!propertyOwnerId) {
                messageError.textContent = 'Не удалось определить владельца.';
                messageError.classList.remove('d-none');
                return;
            }
            const fullText = subject ? `${subject}\n\n${text}` : text;
            try {
                await sendMessage({ propertyId, recipientId: propertyOwnerId, text: fullText });
                messageForm.reset();
                successTextEl.textContent = 'Сообщение отправлено владельцу.';
                messageModal?.hide();
                successModal?.show();
            } catch (err) {
                console.error('send message error', err);
                messageError.textContent = 'Ошибка при отправке сообщения.';
                messageError.classList.remove('d-none');
            }
        });
    }

    function updateBookingTotal() {
        if (!bookingTotalEl) return;
        bookingTotalEl.textContent = '—';
        delete bookingTotalEl.dataset.total;

        const startVal = bookingStartInput?.value;
        const endVal = bookingEndInput?.value;
        if (!startVal || !endVal || !propertyPricePerDay) return;

        const start = new Date(startVal);
        const end = new Date(endVal);
        const diffMs = end.getTime() - start.getTime();
        const days = diffMs / (1000 * 60 * 60 * 24);
        if (days <= 0) return;

        const total = Math.round(days * propertyPricePerDay);
        bookingTotalEl.textContent = `${total} ₽`;
        bookingTotalEl.dataset.total = String(total);
    }

    bookingStartInput?.addEventListener('change', updateBookingTotal);
    bookingEndInput?.addEventListener('change', updateBookingTotal);

    if (bookingForm && bookingBtn) {
        bookingForm.addEventListener('submit', async e => {
            e.preventDefault();
            bookingErrorEl?.classList.add('d-none');
            const me = getCurrentUser();
            const renterId = me?.user_id;
            if (!renterId || !propertyId) {
                bookingErrorEl.textContent = 'Ошибка определения данных.';
                bookingErrorEl.classList.remove('d-none');
                return;
            }

            const start_at = bookingStartInput.value;
            const end_at = bookingEndInput.value;
            const total_price = Number(bookingTotalEl.dataset.total);

            if (!start_at || !end_at || !Number.isFinite(total_price)) {
                bookingErrorEl.textContent = 'Проверьте даты и цену.';
                bookingErrorEl.classList.remove('d-none');
                return;
            }

            bookingBtn.disabled = true;
            try {
                await apiPost(
                    '/bookings',
                    { property_id: propertyId, renter_id: renterId, start_at, end_at, total_price, deal_status: 'pending' },
                    { auth: true }
                );

                await apiPut(`/properties/${propertyId}`, { status: 'occupied' }, { auth: true });

                bookingForm.reset();
                bookingTotalEl.textContent = '—';
                delete bookingTotalEl.dataset.total;

                successTextEl.textContent = 'Бронирование создано. Объект теперь занят.';
                successModal?.show();
                bookingBtn.disabled = true;
                bookingBtn.textContent = 'Недоступно для бронирования';
                bookingBtn.classList.add('btn-secondary');
            } catch (err) {
                console.error('create booking error', err);
                bookingErrorEl.textContent = 'Не удалось создать бронирование.';
                bookingErrorEl.classList.remove('d-none');
            } finally {
                bookingBtn.disabled = false;
            }
        });
    }

    loadProperty();
    loadPhotos();
});