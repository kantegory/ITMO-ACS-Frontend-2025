import { ref } from 'vue';

export function useTheme() {
  const currentTheme = ref(localStorage.getItem('theme') || 'light');
  document.documentElement.setAttribute('data-theme', currentTheme.value);

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme.value);
    localStorage.setItem('theme', currentTheme.value);
  };

  return { currentTheme, toggleTheme };
}
