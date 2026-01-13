import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    function setUser(newUser, newToken) {
        user.value = newUser
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('currentUser')
        localStorage.removeItem('token')
    }

    async function login(email, password) {
        const result = await authApi.login(email, password)
        if (result.success) {
            setUser(result.user, result.token)
        }
        return result
    }
    
    async function register(email, password, name) {
        const result = await authApi.register(email, password, name)
        if (result.success) {
            setUser(result.user, result.token)
        }
        return result
    }

    async function check() {
        const result = await authApi.check()
        if (result.success) {
            setUser(result.user, result.token)
        }
        return result
    }

    return { user, token, login, register, logout }
})
