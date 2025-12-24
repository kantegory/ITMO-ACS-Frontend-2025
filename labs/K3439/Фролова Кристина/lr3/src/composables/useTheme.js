import { ref, computed, watchEffect } from "vue";

const THEME_KEY = "theme";
const theme = ref(localStorage.getItem(THEME_KEY) || "dark");

export function useTheme() {
  const isDark = computed(() => theme.value === "dark");
  const iconHref = computed(() => (isDark.value ? "#icon-light" : "#icon-moon"));

  function toggleTheme() {
    theme.value = isDark.value ? "light" : "dark";
  }

  watchEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme.value);
    localStorage.setItem(THEME_KEY, theme.value);
  });

  return { theme, isDark, iconHref, toggleTheme };
}
