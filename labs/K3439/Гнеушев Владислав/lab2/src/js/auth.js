import { loginUser, registerUser } from './api.js';
import { showFormMessage } from './utils.js';

export function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async event => {
            event.preventDefault();
            const email = loginForm.querySelector('#email')?.value.trim();
            const password = loginForm.querySelector('#password')?.value.trim();

            try {
                await loginUser(email, password);
                showFormMessage(loginForm, 'Успешный вход! Перенаправляем...', 'success');
                setTimeout(() => window.location.href = 'profile.html', 800);
            } catch (error) {
                console.error(error);
                showFormMessage(loginForm, error.message);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async event => {
            event.preventDefault();
            const name = registerForm.querySelector('#regName')?.value.trim();
            const email = registerForm.querySelector('#regEmail')?.value.trim();
            const password = registerForm.querySelector('#regPassword')?.value.trim();
            const confirmPassword = registerForm.querySelector('#regPasswordConfirm')?.value.trim();

            if (password !== confirmPassword) {
                showFormMessage(registerForm, 'Пароли не совпадают');
                return;
            }

            try {
                await registerUser({ name, email, password });
                showFormMessage(registerForm, 'Регистрация прошла успешно! Перенаправляем...', 'success');
                setTimeout(() => window.location.href = 'profile.html', 800);
            } catch (error) {
                console.error(error);
                showFormMessage(registerForm, error.message);
            }
        });
    }
}

export function initForgotPasswordFlow() {
    const forgotLink = document.getElementById('forgotPasswordLink');
    const forgotModalElement = document.getElementById('forgotPasswordModal');
    const forgotForm = document.getElementById('forgotPasswordForm');

    if (!forgotLink || !forgotModalElement || !forgotForm) {
        return;
    }

    const forgotModal = new bootstrap.Modal(forgotModalElement);

    forgotLink.addEventListener('click', event => {
        event.preventDefault();
        forgotModal.show();
    });

    forgotForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('resetEmail')?.value.trim();

        if (!email) {
            showFormMessage(forgotForm, 'Введите email');
            return;
        }

        showFormMessage(forgotForm, 'Если email зарегистрирован, мы отправим инструкцию.', 'success');
        setTimeout(() => forgotModal.hide(), 1500);
    });
}
