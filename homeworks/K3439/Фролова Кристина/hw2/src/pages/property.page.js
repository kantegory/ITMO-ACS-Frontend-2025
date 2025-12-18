import { getQueryParam } from "../utils/query.js";
import { getAdvertisementById } from "../api/advertisements.api.js";
import { getUserById } from "../api/users.api.js";
import { getMeId, sendMessage } from "../api/messages.api.js";
import {
  renderAdvert,
  renderAdvertError,
  renderNoId,
  renderOwner,
  renderOwnerMissing,
  renderOwnerError,
} from "../ui/propertyDetails.ui.js";

let currentAdvertId = null;
let currentOwnerId = null;
let currentMeId = null;

export function initPropertyPage() {
  setupContactSendHandler();

  (async () => {
    currentMeId = await getMeId().catch(() => null);
    await loadAdvert();
  })();
}

async function loadAdvert() {
  const id = getQueryParam("id");
  currentAdvertId = id;

  if (!id) {
    renderNoId();
    return;
  }

  try {
    const advert = await getAdvertisementById(id);
    currentOwnerId = advert.property?.ownerId || null;

    if (currentOwnerId) {
      try {
        const owner = await getUserById(currentOwnerId);
        renderOwner(owner);
      } catch (e) {
        console.error(e);
        renderOwnerError();
      }
    } else {
      renderOwnerMissing();
    }

    renderAdvert(advert);
  } catch (e) {
    console.error(e);
    renderAdvertError("Не удалось загрузить данные. Попробуйте обновить страницу позже.");
  }
}

function setupContactSendHandler() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#contactSendButton");
    if (!btn) return;

    const input = document.getElementById("contactMessage");
    const text = (input?.value || "").trim();
    if (!text) return;

    if (!currentMeId) {
      window.location.href = "login.html";
      return;
    }
    if (!currentAdvertId || !currentOwnerId) {
      alert("Не удалось определить получателя. Обнови страницу.");
      return;
    }

    btn.disabled = true;
    try {
      await sendMessage({
        receiverId: currentOwnerId,
        senderId: currentMeId,
        advertisementId: Number(currentAdvertId),
        text,
      });

      const modalEl = document.getElementById("contactModal");
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();
      if (input) input.value = "";
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить сообщение владельцу");
    } finally {
      btn.disabled = false;
    }
  });
}
