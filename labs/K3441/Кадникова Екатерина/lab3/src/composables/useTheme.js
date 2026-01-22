import { ref, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
    const applyTheme = () => {
        document.body.classList.toggle('dark-theme', isDark.value)
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }

    const toggleTheme = () => {
        isDark.value = !isDark.value
        applyTheme()
    }

    onMounted(() => {
        isDark.value = localStorage.getItem('theme') === 'dark'
        applyTheme()
    })

    return {
        isDark,
        toggleTheme
    }
}