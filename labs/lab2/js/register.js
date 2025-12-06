import { register } from "./api.js";
import { setCurrentUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const usernameInput = document.getElementById("registerUsername");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const message = document.getElementById("registerMessage");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        message.className = "alert d-none";
        message.textContent = "";

        if (!registerForm.checkValidity()) {
            e.stopPropagation();
            registerForm.classList.add('was-validated');
            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const user = await register(email, password, username);

            setCurrentUser(user);

            message.className = "alert alert-success";
            message.textContent = `Добро пожаловать, ${user.username}! Аккаунт успешно создан.`;

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1000);

        } catch (err) {
            message.className = "alert alert-danger";
            message.textContent = err.message || "Ошибка регистрации. Попробуйте еще раз.";
        }
    });

    usernameInput.addEventListener('input', () => {
        registerForm.classList.remove('was-validated');
    });

    emailInput.addEventListener('input', () => {
        registerForm.classList.remove('was-validated');
    });

    passwordInput.addEventListener('input', () => {
        registerForm.classList.remove('was-validated');
    });
});