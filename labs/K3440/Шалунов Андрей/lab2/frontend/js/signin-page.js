import { loginUser } from './auth.js';
import { isLoggedIn } from './session.js';

document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        window.location.href = 'profile.html';
    }

    const form = document.getElementById('signin-form');
    if (!form) return;

    const emailInput = document.getElementById('signin-email');
    const passwordInput = document.getElementById('signin-password');
    const submitBtn = form.querySelector('.login-btn');
    const errorBox = document.querySelector('[data-error]');

    const modalElement = document.getElementById('loginModal');
    let successModal = null;
    if (modalElement && window.bootstrap) {
        successModal = new bootstrap.Modal(modalElement);
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

        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();

        if (!email || !password) {
            showError('Пожалуйста, введите email и пароль.');
            return;
        }

        if (submitBtn) submitBtn.disabled = true;

        try {
            await loginUser({ email, password });

            if (successModal) {
                successModal.show();
            } else {
                window.location.href = 'profile.html';
            }
            } catch (err) {
                console.error(err);
                showError(err.message || 'Не удалось войти. Проверьте данные.');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});