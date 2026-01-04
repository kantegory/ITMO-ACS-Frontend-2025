import {API_BASE} from "./config.js";
import {authFetch} from "./auth.js";

let chatsData = [];

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "—";
}

function waitForElement(id, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const t = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        clearInterval(t);
        resolve(el);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(t);
        reject(new Error(`Element #${id} not found (include not loaded?)`));
      }
    }, 50);
  });
}

async function loadMe() {
  const res = await authFetch(`${API_BASE}/users/me`);
  console.log("me status:", res.status);

  if (res.status === 401) {
    throw new Error("Unauthorized: please login");
  }
  if (!res.ok) throw new Error(`Me load failed: ${res.status}`);

  return await res.json();
}

async function loadMyAdvertisements() {
  const res = await authFetch(`${API_BASE}/advertisements/me`);
  if (!res.ok) throw new Error(`My adverts load failed: ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : body.content ?? [];
}

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

async function initProfile() {
  await waitForElement("profileName");

  const me = await loadMe();

  const fullName = [me.firstName, me.lastName].filter(Boolean).join(" ").trim();
  setText("profileName", fullName || "—");
  setText("profileMail", me.mail || "—");
  setText("profilePhone", me.phone || "—");

  const adverts = await loadMyAdvertisements();
  renderMyProperties(adverts);
  try {
    const rentals = await loadMyRentals();
    await renderRentals(rentals);
  } catch (e) {
    console.error(e);
    const list = document.getElementById("rentingList");
    if (list) list.innerHTML = `<div class="text-danger">Не удалось загрузить аренды</div>`;
  }

  try {
    currentMe = me;
    const messages = await loadMyMessages();
    chatsData = groupMessagesToChats(messages, me.id);
    await renderChats(chatsData, me);
  } catch (e) {
    console.error(e);
    const list = document.getElementById("messagesList");
    if (list) list.innerHTML = `<div class="text-danger">Не удалось загрузить сообщения</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
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
});

let currentMe = null;

function setupChatClickHandler() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chat-id]");
    if (!btn) return;
    openChat(btn.getAttribute("data-chat-id"), currentMe);
  });
}


async function openChat(chatId, me) {
  currentChatId = chatId;
  const chat = chatsData.find(c => c.id === chatId);
  if (!chat) return;

  const titleEl = document.getElementById("chatModalLabel");
  const contentEl = document.getElementById("chatContent");

  if (titleEl) {
    const otherLabel = await getUserLabel(chat.otherId, me);
    const advertTitle = await getAdvertTitle(chat.advertisementId);
    titleEl.textContent = `Чат: ${otherLabel} • ${advertTitle}`;
  }

  if (contentEl) {
    const blocks = await Promise.all(chat.messages.map(async msg => {
      const time = formatDateTime(msg.createdAt);
      const author = await getUserLabel(msg.senderId, me);
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
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.show();
  }
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("#logoutBtn");
  if (!btn) return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  window.location.href = "/screen/index.html";
});

async function loadMyRentals() {
  const res = await authFetch(`${API_BASE}/rentals/me`);
  if (!res.ok) throw new Error(`My rentals load failed: ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : body.content ?? [];
}

async function loadMyMessages() {
  const res = await authFetch(`${API_BASE}/messages/me`);
  if (!res.ok) throw new Error(`My messages load failed: ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : body.content ?? [];
}


function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("ru-RU");
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


function renderMessages(messages) {
  const list = document.getElementById("messagesList");
  if (!list) return;

  list.innerHTML = "";

  if (!messages.length) {
    list.innerHTML = `<div class="text-muted">Пока нет сообщений</div>`;
    return;
  }

  list.innerHTML = messages.map(m => {
    const time = formatDateTime(m.createdAt);
    return `
      <div class="list-group-item">
        <div class="d-flex justify-content-between">
          <div class="fw-semibold">Чат по объявлению: ${m.advertisementId}</div>
          <div class="small text-muted">${time}</div>
        </div>
        <div class="small text-muted">От: ${m.senderId}</div>
        <div class="small text-muted">Кому: ${m.receiverId}</div>
        <div class="mt-2">${m.text ?? ""}</div>
      </div>
    `;
  }).join("");
}

function parseDate(d) {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}

function groupMessagesToChats(messages, myUserId) {
  const map = new Map();

  for (const m of messages) {
    const otherId = (m.senderId === myUserId) ? m.receiverId : m.senderId;
    const key = `${m.advertisementId}:${otherId}`;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        advertisementId: m.advertisementId,
        otherId,
        messages: []
      });
    }
    map.get(key).messages.push(m);
  }

  const chats = Array.from(map.values());

  for (const c of chats) {
    c.messages.sort((a, b) => parseDate(a.createdAt) - parseDate(b.createdAt));
    c.lastMessage = c.messages[c.messages.length - 1];
  }

  chats.sort((a, b) => parseDate(b.lastMessage?.createdAt) - parseDate(a.lastMessage?.createdAt));
  return chats;
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
  <button type="button"
          class="list-group-item list-group-item-action"
          data-chat-id="${c.id}">
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

const usersCache = new Map();

async function fetchUserById(userId) {
  if (!userId) return null;
  if (usersCache.has(userId)) return usersCache.get(userId);

  const res = await authFetch(`${API_BASE}/users/${encodeURIComponent(userId)}`);
  if (!res.ok) {
    usersCache.set(userId, null);
    return null;
  }

  const user = await res.json();
  usersCache.set(userId, user);
  return user;
}

async function getUserLabel(userId, me) {
  if (!userId) return "—";
  if (me?.id && userId === me.id) return "Вы";

  const u = await fetchUserById(userId);
  if (!u) return userId; // fallback

  const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return fullName || u.mail || userId;
}


let currentChatId = null;

async function sendMessage({receiverId, senderId, advertisementId, text}) {
  const res = await authFetch(`${API_BASE}/messages`, {
    method: "POST",
    body: JSON.stringify({receiverId, senderId, advertisementId, text}),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Send failed: ${res.status} ${errText}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? await res.json() : null;
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

      input.value = "";

      await openChat(currentChatId, currentMe);
      await renderChats(chatsData, currentMe);
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить сообщение");
    } finally {
      btn.disabled = false;
    }
  });
}

const advertsCache = new Map();

async function fetchAdvertById(advertId) {
  if (advertId == null) return null;
  const key = String(advertId);

  if (advertsCache.has(key)) return advertsCache.get(key);

  const res = await authFetch(`${API_BASE}/advertisements/${encodeURIComponent(advertId)}`);
  if (!res.ok) {
    advertsCache.set(key, null);
    return null;
  }

  const advert = await res.json();
  advertsCache.set(key, advert);
  return advert;
}

async function getAdvertTitle(advertId) {
  const advert = await fetchAdvertById(advertId);
  return advert?.title || `Объявление #${advertId}`;
}
