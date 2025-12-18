import { AUTH_API } from "../api/auth.api.js";
import { saveTokens } from "../api/auth.storage.js";

export function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const status = document.createElement("div");
  status.className = "mt-3";
  form.prepend(status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.innerHTML = "";

    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    try {
      const res = await fetch(AUTH_API.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        showAlert(status, txt || `Ошибка регистрации: ${res.status}`);
        return;
      }

      const body = await res.json();
      saveTokens(body);

      window.location.href = "profile.html";
    } catch (err) {
      console.error(err);
      showAlert(status, "Ошибка сети");
    }
  });
}

function showAlert(container, message, type = "danger") {
  container.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}
