import { fetchAdvertisements } from "../api/advertisements.api.js";
import { advertsToCards } from "../ui/listingCards.mapper.js";
import { renderCards } from "../ui/cards.ui.js";

export function initListingPage() {
  const form = document.getElementById("filterForm");
  const resultsContainer = document.getElementById("results");

  if (!resultsContainer) return;

  async function loadAdverts() {
    resultsContainer.innerHTML = "<p>Загружаем объявления...</p>";

    const filters = {
      location: document.getElementById("location")?.value?.trim() || "",
      typeUi: document.getElementById("type")?.value || "",
      minPrice: document.getElementById("priceFrom")?.value || "",
      maxPrice: document.getElementById("priceTo")?.value || "",
    };

    try {
      const data = await fetchAdvertisements(filters);
      const cards = advertsToCards(data);
      renderCards(cards);
    } catch (e) {
      console.error(e);
      resultsContainer.innerHTML =
        '<p class="text-danger">Не удалось загрузить объявления. Попробуйте обновить страницу позже.</p>';
    }
  }

  loadAdverts();

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      loadAdverts();
    });
  }
}
