import { AUTH_API } from "../api/auth.api.js";
import { saveTokens } from "../api/auth.storage.js";

export function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const emailFromQuery = params.get("email");
  if (emailFromQuery) {
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.value = emailFromQuery;
  }

  const status = document.createElement("div");
  status.className = "mt-3";
  form.prepend(status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.innerHTML = "";

    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    try {
      const res = await fetch(AUTH_API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        showAlert(status, txt || `Ошибка входа: ${res.status}`);
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
