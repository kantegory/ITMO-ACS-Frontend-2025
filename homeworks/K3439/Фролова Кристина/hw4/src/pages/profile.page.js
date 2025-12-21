import { setText } from "../ui/profile.ui.js";
import { getMe, getUserById } from "../api/users.api.js";
import { getMyAdvertisements, getAdvertTitle } from "../api/advertisements.api.js";
import { getMyRentals } from "../api/rentals.api.js";
import { getMyMessages, sendMessage } from "../api/messages.api.js";
import { formatDateTime, parseDate } from "../utils/datetime.js";
import { groupMessagesToChats } from "../utils/groupChats.js";

let currentMe = null;
let chatsData = [];
let currentChatId = null;

export function initProfilePage() {
  setupLogout();
  setupChatClickHandler();
  setupChatSendHandler();

  initProfile().catch(err => {
    console.error(err);
    if (String(err.message).includes("Unauthorized")) {
      window.location.href = "login.html";
      return;
    }
    setText("profileName", "Ошибка загрузки профиля");
  });
}

async function initProfile() {
  currentMe = await getMe();

  const fullName = [currentMe.firstName, currentMe.lastName].filter(Boolean).join(" ").trim();
  setText("profileName", fullName || "—");
  setText("profileMail", currentMe.mail || "—");
  setText("profilePhone", currentMe.phone || "—");

  const adverts = await getMyAdvertisements();
  renderMyProperties(adverts);

  const rentals = await getMyRentals();
  await renderRentals(rentals);

  const messages = await getMyMessages();
  chatsData = groupMessagesToChats(messages, currentMe.id);
  await renderChats(chatsData, currentMe);
}

function setupLogout() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#logoutBtn");
    if (!btn) return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/screen/index.html";
  });
}

function setupChatClickHandler() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chat-id]");
    if (!btn) return;
    openChat(btn.getAttribute("data-chat-id"));
  });
}

async function openChat(chatId) {
  currentChatId = chatId;
  const chat = chatsData.find(c => c.id === chatId);
  if (!chat || !currentMe) return;

  const titleEl = document.getElementById("chatModalLabel");
  const contentEl = document.getElementById("chatContent");

  if (titleEl) {
    const otherLabel = await getUserLabel(chat.otherId, currentMe);
    const advertTitle = await getAdvertTitle(chat.advertisementId);
    titleEl.textContent = `Чат: ${otherLabel} • ${advertTitle}`;
  }

  if (contentEl) {
    const blocks = await Promise.all(chat.messages.map(async msg => {
      const time = formatDateTime(msg.createdAt);
      const author = await getUserLabel(msg.senderId, currentMe);
      return `
        <div class="mb-2">
          <strong>${author}:</strong> ${msg.text}<br>
          <small class="text-muted">${time}</small>
        </div>
      `;
    }));
    contentEl.innerHTML = blocks.join("");
  }

  const modalEl = document.getElementById("chatModal");
  if (modalEl && typeof bootstrap !== "undefined") {
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function setupChatSendHandler() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#chatSendBtn");
    if (!btn) return;

    const input = document.getElementById("chatInput");
    const text = (input?.value || "").trim();
    if (!text) return;

    const chat = chatsData.find(c => c.id === currentChatId);
    if (!chat || !currentMe) return;

    btn.disabled = true;
    try {
      const created = await sendMessage({
        receiverId: chat.otherId,
        senderId: currentMe.id,
        advertisementId: chat.advertisementId,
        text,
      });

      const msg = created ?? {
        id: Date.now(),
        senderId: currentMe.id,
        receiverId: chat.otherId,
        advertisementId: chat.advertisementId,
        text,
        createdAt: new Date().toISOString(),
      };

      chat.messages.push(msg);
      chat.messages.sort((a, b) => parseDate(a.createdAt) - parseDate(b.createdAt));
      chat.lastMessage = chat.messages[chat.messages.length - 1];

      if (input) input.value = "";

      await openChat(currentChatId);
      await renderChats(chatsData, currentMe);
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить сообщение");
    } finally {
      btn.disabled = false;
    }
  });
}

async function getUserLabel(userId, me) {
  if (!userId) return "—";
  if (me?.id && userId === me.id) return "Вы";

  const u = await getUserById(userId);
  if (!u) return userId;

  const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return fullName || u.mail || userId;
}

/* Ниже — твои рендеры, можно вынести в ui/*.ui.js, но я оставил рядом чтобы не расползалось */

function renderMyProperties(adverts) {
  const list = document.getElementById("myPropertiesList");
  if (!list) return;

  list.innerHTML = "";
  if (!adverts.length) {
    list.innerHTML = `<div class="text-muted">Пока нет объявлений</div>`;
    return;
  }

  list.innerHTML = adverts.map(a => {
    const title = a.title || "Объявление";
    const location = a.property?.location || "";
    const price = (a.pricePerPeriod ?? 0).toLocaleString("ru-RU");

    return `
      <a class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
         href="property.html?id=${encodeURIComponent(a.id)}">
        <div class="me-3">
          <div class="fw-semibold">${title}</div>
          <div class="text-muted small">${location}</div>
        </div>
        <div class="text-nowrap fw-semibold">${price} ₽</div>
      </a>
    `;
  }).join("");
}

async function renderRentals(rentals) {
  const list = document.getElementById("rentingList");
  if (!list) return;

  list.innerHTML = "";
  if (!rentals.length) {
    list.innerHTML = `<div class="text-muted">Пока нет аренд</div>`;
    return;
  }

  const items = await Promise.all(rentals.map(async r => {
    const title = await getAdvertTitle(r.advertisementId);
    const total = (r.totalPrice ?? 0).toLocaleString("ru-RU");
    const start = formatDateTime(r.startDate);
    const end = formatDateTime(r.endDate);
    const status = r.status || "—";

    return `
      <a class="list-group-item list-group-item-action"
         href="property.html?id=${encodeURIComponent(r.advertisementId)}">
        <div class="d-flex justify-content-between align-items-center">
          <div class="fw-semibold">${title}</div>
          <span class="badge text-bg-secondary">${status}</span>
        </div>
        <div class="small text-muted">Период: ${start} — ${end}</div>
        <div class="fw-semibold mt-1">${total} ₽</div>
      </a>
    `;
  }));

  list.innerHTML = items.join("");
}

async function renderChats(chats, me) {
  const list = document.getElementById("messagesList");
  if (!list) return;

  list.innerHTML = "";
  if (!chats.length) {
    list.innerHTML = `<div class="text-muted">Пока нет сообщений</div>`;
    return;
  }

  const items = await Promise.all(chats.map(async c => {
    const lastText = c.lastMessage?.text ?? "";
    const lastTime = formatDateTime(c.lastMessage?.createdAt);
    const otherLabel = await getUserLabel(c.otherId, me);
    const advertTitle = await getAdvertTitle(c.advertisementId);

    return `
      <button type="button" class="list-group-item list-group-item-action" data-chat-id="${c.id}">
        <div class="d-flex justify-content-between">
          <div class="fw-semibold">${advertTitle}</div>
          <div class="small text-muted">${lastTime}</div>
        </div>
        <div class="small text-muted">Собеседник: ${otherLabel}</div>
        <div class="mt-1">${lastText}</div>
        <div class="small text-muted mt-1">Сообщений: ${c.messages.length}</div>
      </button>
    `;
  }));

  list.innerHTML = items.join("");
}
