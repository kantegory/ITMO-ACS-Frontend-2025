import { login } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const message = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const user = await login(emailInput.value.trim(), passwordInput.value);

            message.className = "alert alert-success";
            message.textContent = `Добро пожаловать, ${user.username}!`;

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 500);

        } catch (err) {
            message.className = "alert alert-danger";
            message.textContent = err.message;
        }
    });
});