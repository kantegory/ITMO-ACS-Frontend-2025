import { login } from '../auth/auth.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        message.className = 'alert d-none';
        message.textContent = '';

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        try {
            await login(emailInput.value.trim(), passwordInput.value);

            message.className = 'alert alert-success';
            message.textContent = 'Вход выполнен успешно';

            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 800);

        } catch (err) {
            message.className = 'alert alert-danger';
            message.textContent = err.message || 'Ошибка входа';
        }
    });

    [emailInput, passwordInput].forEach(input =>
        input.addEventListener('input', () =>
            form.classList.remove('was-validated')
        )
    );
});