import { register, getCurrentUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const usernameInput = document.getElementById("registerUsername");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const message = document.getElementById("registerMessage");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const user = await register(email, password, username);

            message.classList.add("alert", "alert-success");
            message.textContent = `Добро пожаловать, ${user.username}!`;

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 500);
        } catch (err) {
            message.classList.remove("d-none", "alert-success");
            message.classList.add("alert", "alert-danger");
            message.textContent = err.message;
        }
    });
});