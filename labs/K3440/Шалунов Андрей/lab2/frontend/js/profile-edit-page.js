import { fetchMyProfile, updateMyProfile } from './user.js';
import { isLoggedIn } from './session.js';
import { logout } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
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


    const form = document.querySelector('form');
    if (!form) return;

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const saveBtn = form.querySelector('.save-btn');
    const errorBox = document.querySelector('[data-error]');
    const modalEl = document.getElementById('saveModal');

    let modal = null;
    if (modalEl && window.bootstrap) {
        modal = new window.bootstrap.Modal(modalEl);
    }

    const showError = (msg) => {
        if (errorBox) {
            errorBox.textContent = msg;
            errorBox.classList.remove('d-none');
        } else {
            alert(msg);
        }
    };

    try {
        const u = await fetchMyProfile();
        if (nameInput) nameInput.value = u.name  || '';
        if (emailInput) emailInput.value = u.email || '';
        if (phoneInput) phoneInput.value = u.phone || '';
    } catch (err) {
        console.error(err);
        showError('Не удалось загрузить данные профиля.');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorBox) errorBox.classList.add('d-none');

        const name = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const phone = phoneInput?.value.trim() || null;

        if (!name || !email) {
            showError('Имя и email обязательны.');
            return;
        }

        if (saveBtn) saveBtn.disabled = true;

        try {
            await updateMyProfile({ name, email, phone });

            if (modal) {
                modal.show();
            } else {
                alert('Профиль обновлён.');
                window.location.href = 'profile.html';
            }
        } catch (err) {
            console.error(err);
            showError(err.message || 'Не удалось сохранить изменения.');
        } finally {
            if (saveBtn) saveBtn.disabled = false;
        }
    });
});