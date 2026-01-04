import { AUTH_API, saveTokens } from "./auth.js";

function showAlert(container, message, type = "danger") {
  container.innerHTML = `
    <div class="alert alert-${type}" role="alert">${message}</div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const emailFromQuery = params.get("email");
  if (emailFromQuery) {
    const emailInput = document.getElementById("loginEmail");
    if (emailInput) emailInput.value = emailFromQuery;
  }

  const status = document.createElement("div");
  status.className = "mt-3";
  form.prepend(status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    const payload = { email, password };

    try {
      const res = await fetch(AUTH_API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        showAlert(status, `Ошибка входа: ${res.status} ${text}`);
        return;
      }
      const tokens = await res.json();
      saveTokens(tokens);

      showAlert(status, "Успешный вход! Перенаправляю…", "success");

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
    } catch (err) {
      console.error(err);
      showAlert(status, "Не удалось войти. Проверь backend и CORS.");
    }
  });
});
