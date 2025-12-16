import {isAuthenticated} from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = isAuthenticated();
  const includeElements = document.querySelectorAll("[data-include]");
  const promises = Array.from(includeElements).map(async (el) => {
    const file = el.getAttribute("data-include");
    if (!file) return;
    const response = await fetch(file);
    el.innerHTML = await response.text();
  });

  Promise.all(promises).then(() => {
    const guestMenu = document.getElementById("guestMenu");
    const userMenu = document.getElementById("userMenu");
    if (!guestMenu || !userMenu) {
      console.warn("guestMenu или userMenu не найдены в DOM");
      return;
    }
    if (isLoggedIn) {
      guestMenu.classList.add("d-none");
      userMenu.classList.remove("d-none");
    } else {
      guestMenu.classList.remove("d-none");
      userMenu.classList.add("d-none");
    }
  });
});
