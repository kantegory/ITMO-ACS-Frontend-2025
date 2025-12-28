import { ref, onMounted, computed } from "vue";

export function useTheme() {
  const theme = ref(localStorage.getItem("theme") ?? "light");

  const changeTheme = (newTheme) => {
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);

    const themeLink = document.querySelector(".theme");
    if (themeLink) {
      themeLink.href = `src/assets/${newTheme}.css`;
      themeLink.media = "all";
    }
  };

  onMounted(() => {
    changeTheme(theme.value);
  });

  return {
    theme,
    toggleTheme: () => changeTheme(theme.value === "dark" ? "light" : "dark"),
  };
}
