import { login } from "./api.js";
import { setCurrentUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const message = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        message.className = "alert d-none";
        message.textContent = "";

        if (!loginForm.checkValidity()) {
            e.stopPropagation();
            loginForm.classList.add('was-validated');
            return;
        }

        try {
            const user = await login(emailInput.value.trim(), passwordInput.value);

            setCurrentUser(user);

            message.className = "alert alert-success";
            message.textContent = `Добро пожаловать, ${user.username}!`;

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1000);

        } catch (err) {
            message.className = "alert alert-danger";
            message.textContent = err.message || "Ошибка входа. Проверьте email и пароль.";
        }
    });

    emailInput.addEventListener('input', () => {
        loginForm.classList.remove('was-validated');
    });

    passwordInput.addEventListener('input', () => {
        loginForm.classList.remove('was-validated');
    });
});