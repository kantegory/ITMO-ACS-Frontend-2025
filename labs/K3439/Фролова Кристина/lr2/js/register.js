import { AUTH_API } from "./auth.js";

function showAlert(container, message, type = "danger") {
  container.innerHTML = `
    <div class="alert alert-${type}" role="alert">${message}</div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const status = document.createElement("div");
  status.className = "mt-3";
  form.prepend(status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const mail = document.getElementById("regEmail")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const password = document.getElementById("regPassword")?.value;
    const password2 = document.getElementById("regPassword2")?.value;

    if (!password || password !== password2) {
      showAlert(status, "Пароли не совпадают");
      return;
    }

    const payload = {
      password,
      mail,
      firstName,
      lastName,
      phone,
    };

    try {
      const res = await fetch(AUTH_API.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        showAlert(status, `Ошибка регистрации: ${res.status} ${text}`);
        return;
      }

      const user = await res.json();

      showAlert(status, "Аккаунт создан! Сейчас перенаправлю на вход…", "success");

      setTimeout(() => {
        window.location.href = `login.html?email=${encodeURIComponent(user.mail || mail)}`;
      }, 600);
    } catch (err) {
      console.error(err);
      showAlert(status, "Не удалось отправить запрос. Проверь backend и CORS.");
    }
  });
});
