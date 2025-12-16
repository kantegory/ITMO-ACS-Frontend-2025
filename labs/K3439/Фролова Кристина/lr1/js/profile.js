const myPropertiesData = [
  {
    link: "property.html",
    title: "Студия 28 м²",
    statusClass: "text-success",
    statusText: "Сдаётся",
    address: "Москва, м. Бауманская · 45 000 ₽/мес.",
    details: "Обновлено: 12.11.2025"
  },
  {
    link: "property.html",
    title: "Квартира 2-к 56 м²",
    statusClass: "text-muted",
    statusText: "Сдана",
    address: "Санкт-Петербург, Приморский район · 70 000 ₽/мес.",
    details: "Арендатор до 01.09.2026"
  }
];
const rentingData = [
  {
    link: "property.html",
    title: "Комната 14 м²",
    statusClass: "text-success",
    statusText: "Активный договор",
    address: "Санкт-Петербург, Васильевский остров · 20 000 ₽/мес.",
    details: "Аренда до: 31.08.2026"
  }
];
const historyData = [
  {
    title: "Договор аренды — Комната 14 м²",
    details: "заключён 01.09.2024"
  },
  {
    title: "Аренда квартиры 2-к",
    details: "статус: завершена"
  }
];
const chatsData = [
  {
    id: "chat1",
    title: "Диалог с владельцем студии (Москва)",
    preview: "Диалог с владельцем студии (Москва)",
    messages: [
      {
        author: "Вы",
        text: "Добрый день, квартира ещё свободна?",
        time: "10.11.2025 14:32"
      },
      {
        author: "Владелец",
        text: "Да, можете приехать на просмотр завтра в 18:00.",
        time: "10.11.2025 14:40"
      },
      {
        author: "Вы",
        text: "Отлично, буду!",
        time: "10.11.2025 14:42"
      }
    ]
  },
  {
    id: "chat2",
    title: "Диалог с арендодателем комнаты (СПб)",
    preview: "Диалог с арендодателем комнаты (СПб)",
    messages: [
      {
        author: "Вы",
        text: "Здравствуйте! Можно с животными?",
        time: "05.11.2025 19:10"
      },
      {
        author: "Арендодатель",
        text: "Можно, если животное приучено к лотку :)",
        time: "05.11.2025 19:15"
      }
    ]
  }
];
document.addEventListener("DOMContentLoaded", () => {
  initAccountPage().catch(err => console.error("Ошибка инициализации ЛК:", err));
});
async function initAccountPage() {
  await renderObjectLists();
  renderHistory();
  renderMessages();
  setupChatClickHandler();
}
async function renderObjectLists() {
  const templateHtml = await fetch("../component/profile-property-item.html").then(r => r.text());
  renderObjectList("myPropertiesList", myPropertiesData, templateHtml);
  renderObjectList("rentingList", rentingData, templateHtml);
}

function renderObjectList(containerId, data, templateHtml) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  data.forEach(item => {
    let html = templateHtml;
    html = html.replaceAll("{link}", item.link);
    html = html.replaceAll("{title}", item.title);
    html = html.replaceAll("{statusClass}", item.statusClass);
    html = html.replaceAll("{statusText}", item.statusText);
    html = html.replaceAll("{address}", item.address);
    html = html.replaceAll("{details}", item.details);
    container.insertAdjacentHTML("beforeend", html);
  });
}

function renderHistory() {
  const list = document.getElementById("historyList");
  if (!list) return;
  list.innerHTML = "";
  historyData.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <strong>${item.title}</strong>
      — <span class="text-muted">${item.details}</span>
    `;
    list.appendChild(li);
  });
}

function renderMessages() {
  const list = document.getElementById("messagesList");
  if (!list) return;
  list.innerHTML = "";
  chatsData.forEach(chat => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "list-group-item list-group-item-action";
    btn.setAttribute("data-bs-toggle", "modal");
    btn.setAttribute("data-bs-target", "#chatModal");
    btn.setAttribute("data-chat-id", chat.id);
    btn.textContent = chat.preview;
    list.appendChild(btn);
  });
}

function setupChatClickHandler() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chat-id]");
    if (!btn) return;
    const chatId = btn.getAttribute("data-chat-id");
    openChat(chatId);
  });
}

function openChat(chatId) {
  const chat = chatsData.find(c => c.id === chatId);
  if (!chat) return;
  const titleEl = document.getElementById("chatModalLabel");
  const contentEl = document.getElementById("chatContent");
  if (titleEl) {
    titleEl.textContent = chat.title;
  }
  if (contentEl) {
    contentEl.innerHTML = chat.messages.map(msg => `
      <div class="mb-2">
        <strong>${msg.author}:</strong> ${msg.text}<br>
        <small class="text-muted">${msg.time}</small>
      </div>
    `).join("");
  }
  const modalEl = document.getElementById("chatModal");
  if (modalEl && typeof bootstrap !== "undefined") {
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.show();
  }
}
