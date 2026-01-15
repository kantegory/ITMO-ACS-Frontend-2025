import { ref, onMounted, onUnmounted } from 'vue';

const THEME_STORAGE_KEY = 'preferred-theme';

const theme = ref('light');

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        console.warn('Не удалось прочитать тему из localStorage', error);
        return null;
    }
}

function storeTheme(value) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch (error) {
        console.warn('Не удалось сохранить тему в localStorage', error);
    }
}

function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function applyTheme(value, persist = false) {
    const resolved = value === 'dark' ? 'dark' : 'light';
    theme.value = resolved;
    document.body.dataset.theme = resolved;

    if (persist) {
        storeTheme(resolved);
    }
}

function toggleTheme() {
    const nextTheme = theme.value === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
}

export function useTheme() {
    let mediaQuery = null;
    let handleSystemChange = null;

    onMounted(() => {
        const stored = getStoredTheme();
        const initialTheme = stored || getSystemTheme();
        applyTheme(initialTheme, false);

        if (window.matchMedia) {
            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            handleSystemChange = (event) => {
                if (getStoredTheme()) {
                    return;
                }
                applyTheme(event.matches ? 'dark' : 'light', false);
            };

            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleSystemChange);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleSystemChange);
            }
        }
    });

    onUnmounted(() => {
        if (mediaQuery && handleSystemChange) {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleSystemChange);
            } else if (mediaQuery.removeListener) {
                mediaQuery.removeListener(handleSystemChange);
            }
        }
    });

    return {
        theme,
        toggleTheme
    };
}

const stored = getStoredTheme();
const initialTheme = stored || (typeof window !== 'undefined' ? getSystemTheme() : 'light');
applyTheme(initialTheme, false);
