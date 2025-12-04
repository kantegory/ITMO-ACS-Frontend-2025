import { fetchMyProfile } from './user.js';
import { isLoggedIn, getCurrentUser } from './session.js';
import { logout } from './auth.js';
import { apiGet } from './api.js';
import { fetchMyChats } from './messages.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!isLoggedIn()) {
        window.location.href = 'signin.html';
        return;
    }

    const errorBox = document.querySelector('[data-error]');
    const nameEl = document.querySelector('[data-profile-name]');
    const emailEl = document.querySelector('[data-profile-email]');
    const phoneEl = document.querySelector('[data-profile-phone]');
    const rentalsContainer = document.querySelector('[data-rentals-list]');
    const ownedContainer = document.querySelector('[data-owned-list]');
    const dealsBody = document.querySelector('[data-deals-body]');
    const messagesList = document.querySelector('[data-messages-list]');
    const logoutBtn = document.getElementById('logout-btn');

    const showError = (msg) => {
        if (errorBox) {
            errorBox.textContent = msg;
            errorBox.classList.remove('d-none');
        } else {
            alert(msg);
        }
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.href = 'signin.html';
        });
    }

    let myId = null;

    try {
        const fromStorage = getCurrentUser();
        myId = fromStorage?.user_id ?? null;

        const u = await fetchMyProfile();

        if (nameEl)  nameEl.textContent  = u.name ?? '-';
        if (emailEl) emailEl.textContent = u.email ?? '-';
        if (phoneEl) phoneEl.textContent = u.phone || '-';

        if (!myId) {
            myId = u.user_id ?? null;
        }
    } catch (err) {
        console.error('profile load error', err);
        showError('Не удалось загрузить профиль. Авторизуйтесь ещё раз.');
    }

    try {
        const bookings = await apiGet('/bookings', { auth: true });

        const rentals = [];
        const owned   = [];

        (bookings || []).forEach((b) => {
            const renterId = b.renter_id ?? b.renterId ?? b.renter?.user_id;

            const property = b.property ?? {};
            const ownerId =
                property.owner?.user_id ??
                property.owner_id ??
                property.ownerId ??
                null;

            const title =
                property.title ??
                `Объект #${b.property_id ?? b.propertyId ?? '—'}`;
            const location = property.location ?? '—';
            const price =
                b.total_price ??
                b.price_per_day ??
                property.price_per_day ??
                0;
            const status = b.deal_status ?? b.status ?? '—';

            let kind = null;
            if (myId && renterId === myId) kind = 'rent';
            if (myId && ownerId === myId)  kind = kind || 'own';

            if (!kind) return;

            const item = { title, location, price, status, kind };

            if (kind === 'rent') {
                rentals.push(item);
            } else if (kind === 'own') {
                owned.push(item);
            }
        });

        const renderCard = (item) => {
            const div = document.createElement('div');
            div.className = 'card mb-3';
            div.innerHTML = `
                <div class="card-body">
                    <h6 class="card-title">${item.title}</h6>
                    <p class="mb-1">Цена: ${item.price} ₽</p>
                    <p class="mb-1">Адрес: ${item.location}</p>
                    <p class="mb-0">Статус: ${item.status}</p>
                </div>
            `;
            return div;
        };

        if (rentalsContainer) {
            rentalsContainer.innerHTML = '';
            if (rentals.length === 0) {
                rentalsContainer.innerHTML =
                    '<p class="text-muted small mb-0">Нет активных арендуемых объектов.</p>';
            } else {
                rentals.forEach((r) => rentalsContainer.appendChild(renderCard(r)));
            }
        }

        if (ownedContainer) {
            ownedContainer.innerHTML = '';
            if (owned.length === 0) {
                ownedContainer.innerHTML =
                    '<p class="text-muted small mb-0">Нет объектов, которые вы сдаёте.</p>';
            } else {
                owned.forEach((o) => ownedContainer.appendChild(renderCard(o)));
            }
        }

        if (dealsBody) {
            dealsBody.innerHTML = '';

            const allDeals = [...rentals, ...owned];

            if (allDeals.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td colspan="5" class="text-muted small">Сделок пока нет.</td>';
                dealsBody.appendChild(tr);
            } else {
                allDeals.forEach((d) => {
                    const typeLabel = d.kind === 'rent' ? 'Аренда' : 'Сдача';
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${typeLabel}</td>
                        <td>${d.title}</td>
                        <td>${d.price} ₽</td>
                        <td>${d.location}</td>
                        <td>${d.status}</td>
                    `;
                    dealsBody.appendChild(tr);
                });
            }
        }
    } catch (err) {
        console.error('bookings load error', err);
    }

    try {
        const chats = await fetchMyChats();

        if (messagesList) {
            messagesList.innerHTML = '';

            if (!chats || chats.length === 0) {
                messagesList.innerHTML =
                    '<li class="list-group-item text-muted small">Чатов пока нет.</li>';
            } else {
                for (const chat of chats) {
                    const li = document.createElement('li');
                    li.className =
                        'list-group-item d-flex justify-content-between align-items-start mb-3';

                    const user1 = chat.user1;
                    const user2 = chat.user2;
                    let otherUser = null;

                    if (myId && user1 && user1.user_id === myId) {
                        otherUser = user2;
                    } else if (myId && user2 && user2.user_id === myId) {
                        otherUser = user1;
                    } else {
                        otherUser = user1 || user2;
                    }

                    const otherName = otherUser?.name ?? 'Собеседник';

                    let propertyTitle =
                        chat.property?.title ??
                        `Объект #${chat.property_id ?? '—'}`;

                    if (!chat.property?.title && chat.property_id) {
                        try {
                            const property = await apiGet(
                                `/properties/${chat.property_id}`,
                                { auth: true }
                            );
                            propertyTitle =
                                property?.title ?? `Объект #${chat.property_id}`;
                        } catch (e) {
                            console.warn('Не удалось загрузить название объекта', e);
                        }
                    }

                    const last = chat.lastMessage ?? null;
                    const lastText = last?.text ?? '(сообщений пока нет)';
                    const date = last?.sent_at
                        ? new Date(last.sent_at).toLocaleDateString('ru-RU')
                        : '';

                    li.innerHTML = `
                        <div class="me-3">
                            <div class="fw-bold">${otherName}</div>
                            <div class="small text-muted mb-1">${propertyTitle}</div>
                            <div>${lastText}</div>
                        </div>
                        <small class="text-muted">${date}</small>
                    `;

                    messagesList.appendChild(li);
                }
            }
        }
    } catch (err) {
        console.error('chats load error', err);
        if (messagesList) {
            messagesList.innerHTML =
                '<li class="list-group-item text-muted small">Не удалось загрузить чаты.</li>';
        }
    }
});