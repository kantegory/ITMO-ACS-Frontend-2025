function initNavigation() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", initNavigation());

logout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "login.html";
};

const logoutButton = document.querySelector("#logoutBtn");

if (logoutButton) {
  logoutButton.addEventListener("click", () => logout());
}

const token = localStorage.getItem("access_token");

const navbarUsernameField = document.querySelector("#userNameNav");

if (navbarUsernameField && token) {
  // TODO: remove duplicated code from profile page
  fetch("http://localhost/api/users/me", {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then((r) =>
    r.json().then((json) => {
      navbarUsernameField.innerHTML = json["username"];
    })
  );
}
