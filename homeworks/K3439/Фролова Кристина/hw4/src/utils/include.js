import {isAuthenticated} from "../../js/auth.js";

export async function initIncludes() {
  const includeElements = document.querySelectorAll("[data-include]");

  await Promise.all(
    Array.from(includeElements).map(async (el) => {
      const file = el.getAttribute("data-include");
      if (!file) return;
      const response = await fetch(file);
      if (!response.ok) {
        console.warn("Include not found:", file, response.status);
        return;
      }
      el.innerHTML = await response.text();
    })
  );

  const guestMenu = document.getElementById("guestMenu");
  const userMenu = document.getElementById("userMenu");
  if (!guestMenu || !userMenu) return;

  if (isAuthenticated()) {
    guestMenu.classList.add("d-none");
    userMenu.classList.remove("d-none");
  } else {
    guestMenu.classList.remove("d-none");
    userMenu.classList.add("d-none");
  }
}
