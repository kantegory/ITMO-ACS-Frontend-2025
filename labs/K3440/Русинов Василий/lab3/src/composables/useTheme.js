import { ref, watchEffect } from "vue";

const theme = ref(localStorage.getItem("theme") || "light");

export function useTheme() {

  function applyTheme(value) {
    if (value === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    }
  }

  function toggleTheme() {
    theme.value = theme.value === "dark" ? "light" : "dark";
  }

  watchEffect(() => {
    applyTheme(theme.value);
  });

  return {
    theme,
    toggleTheme
  };
}
