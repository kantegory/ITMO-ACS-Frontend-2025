import { ref, onMounted } from "vue";

const STORAGE_KEY = "theme";

function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

export function useTheme() {
    const theme = ref("light");

    function setTheme(next) {
        theme.value = next;
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    function toggleTheme() {
        setTheme(theme.value === "dark" ? "light" : "dark");
    }

    onMounted(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const initial = stored || getSystemTheme();
        setTheme(initial);
    });

    return { theme, setTheme, toggleTheme };
}