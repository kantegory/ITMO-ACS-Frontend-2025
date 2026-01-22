import { ref } from "vue";

const KEY = "theme";
const theme = ref(localStorage.getItem(KEY) || "dark");

function applyTheme(value) {
  theme.value = value;
  document.documentElement.setAttribute("data-theme", value);
  localStorage.setItem(KEY, value);
}

applyTheme(theme.value);

export function useTheme() {
  const toggleTheme = () => {
    applyTheme(theme.value === "dark" ? "light" : "dark");
  };

  const buttonText = () => (theme.value === "dark" ? "Light" : "Dark");

  return { theme, toggleTheme, buttonText };
}
