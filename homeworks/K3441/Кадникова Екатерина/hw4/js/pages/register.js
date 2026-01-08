import { register } from '../auth/auth.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const message = document.getElementById('registerMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        message.className = 'alert d-none';
        message.textContent = '';

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        try {
            await register(
                emailInput.value.trim(),
                passwordInput.value,
                usernameInput.value.trim()
            );

            message.className = 'alert alert-success';
            message.textContent = 'Аккаунт успешно создан';

            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 800);

        } catch (err) {
            message.className = 'alert alert-danger';
            message.textContent = err.message || 'Ошибка регистрации';
        }
    });

    [usernameInput, emailInput, passwordInput].forEach(input =>
        input.addEventListener('input', () =>
            form.classList.remove('was-validated')
        )
    );
});