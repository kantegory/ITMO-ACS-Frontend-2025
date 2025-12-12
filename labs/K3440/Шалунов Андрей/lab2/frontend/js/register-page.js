import { registerUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    if (!form) return;

    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const phoneInput = document.getElementById('reg-phone');
    const submitBtn = form.querySelector('.register-btn');
    const errorBox = document.querySelector('[data-error]');
    const successModalEl = document.getElementById('registerModal');

    let successModal = null;
    if (successModalEl && window.bootstrap) {
        successModal = new window.bootstrap.Modal(successModalEl);
    }

    const showError = (msg) => {
        if (errorBox) {
            errorBox.textContent = msg;
            errorBox.classList.remove('d-none');
        } else {
            alert(msg);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorBox) errorBox.classList.add('d-none');

        const name = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();
        const phone = (phoneInput?.value.trim() || '') || null;

        if (!name || !email || !password) {
            showError('Заполните имя, email и пароль.');
            return;
        }

        if (submitBtn) submitBtn.disabled = true;

        try {
            await registerUser({ name, email, password, phone });

            if (successModal) {
                successModal.show();
            } else {
                alert('Аккаунт создан. Теперь вы можете войти.');
                window.location.href = 'signin.html';
            }
        } catch (err) {
            console.error(err);
            showError(err.message || 'Не удалось зарегистрироваться.');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});