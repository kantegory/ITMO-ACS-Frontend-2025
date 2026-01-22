<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
    <symbol id="circle-half" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
    </symbol>
    <symbol id="moon-stars-fill" viewBox="0 0 16 16">
      <path
        d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
      />
      <path
        d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"
      />
    </symbol>
    <symbol id="sun-fill" viewBox="0 0 16 16">
      <path
        d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707z"
      />
    </symbol>
  </svg>
  <header class="py-3 mb-4 border-bottom">
    <nav class="d-flex flex-wrap justify-content-center">
      <a
        href="/"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <!-- <img class="bi me-2" width="40" height="32" src="/static/img/logo.svg" alt="Logo" /> -->
        <span class="fs-4">website.title</span>
      </a>
      <ul class="nav nav-pills">
        <li class="nav-item">
          <a href="/" class="nav-link link-body-emphasis" aria-current="page">Главная</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link link-body-emphasis">Купить</a>
        </li>
        <li class="nav-item">
          <a href="/pages/tutorial" class="nav-link link-body-emphasis">Инструкция</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link link-body-emphasis">Применения</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle link-body-emphasis"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Статьи
          </a>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="/pages/pavlok">Сравнение</a>
            </li>
            <li>
              <a class="dropdown-item" href="/pages/strap">Ремешок</a>
            </li>
          </ul>
        </li>
        <li class="nav-item" id="login-item">
          <a v-if="isAuthenticated" href="/profile" class="nav-link link-body-emphasis">Профиль</a>
          <a v-else href="/login" class="nav-link link-body-emphasis">Войти</a>
        </li>
        <li class="nav-item dropdown">
          <button
            class="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center link-body-emphasis"
            id="bd-theme"
            type="button"
            aria-expanded="false"
            data-bs-toggle="dropdown"
            data-bs-display="static"
            aria-label="Toggle theme (auto)"
          >
            <svg class="bi my-1 theme-icon-active" width="1em" height="1em">
              <use :href="activeThemeIcon"></use>
            </svg>
            <span class="d-lg-none ms-2" id="bd-theme-text">Toggle theme</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
            <li>
              <button
                type="button"
                class="dropdown-item d-flex align-items-center"
                :class="{ active: theme === 'light' }"
                @click="setTheme('light')"
                :aria-pressed="theme === 'light'"
              >
                <svg class="bi me-2 opacity-50" width="1em" height="1em">
                  <use href="#sun-fill"></use>
                </svg>
                Light
              </button>
            </li>
            <li>
              <button
                type="button"
                class="dropdown-item d-flex align-items-center"
                :class="{ active: theme === 'dark' }"
                @click="setTheme('dark')"
                :aria-pressed="theme === 'dark'"
              >
                <svg class="bi me-2 opacity-50" width="1em" height="1em">
                  <use href="#moon-stars-fill"></use>
                </svg>
                Dark
              </button>
            </li>
            <li>
              <button
                type="button"
                class="dropdown-item d-flex align-items-center"
                :class="{ active: theme === 'auto' }"
                @click="setTheme('auto')"
                :aria-pressed="theme === 'auto'"
              >
                <svg class="bi me-2 opacity-50" width="1em" height="1em">
                  <use href="#circle-half"></use>
                </svg>
                Auto
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isAuthenticated: false,
      theme: "auto",
    };
  },
  computed: {
    activeThemeIcon() {
      if (this.theme === "light") return "#sun-fill";
      if (this.theme === "dark") return "#moon-stars-fill";
      return "#circle-half";
    },
  },
  methods: {
    getStoredTheme() {
      return localStorage.getItem("theme");
    },
    setStoredTheme(theme) {
      localStorage.setItem("theme", theme);
    },
    getPreferredTheme() {
      const storedTheme = this.getStoredTheme();
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    setTheme(theme) {
      this.theme = theme;
      this.setStoredTheme(theme);

      if (theme === "auto") {
        document.documentElement.setAttribute(
          "data-bs-theme",
          window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        );
      } else {
        document.documentElement.setAttribute("data-bs-theme", theme);
      }
    },
    updateAuthStatus() {
      this.isAuthenticated = !!localStorage.getItem("access_token");
    },
  },
  mounted() {
    this.updateAuthStatus();

    const storedTheme = this.getStoredTheme() || "auto";
    this.setTheme(storedTheme);

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      const storedTheme = this.getStoredTheme();
      if (storedTheme !== "light" && storedTheme !== "dark") {
        this.setTheme("auto");
      }
    });
  },
};
</script>
