import {ref} from 'vue'
import api from '../api/http'


const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))


export function useAuth() {
    const login = async (email, password) => {
        const {data} = await api.get('/users', {params: {email}})
        const u = data[0]
        if (!u || u.password !== password) throw new Error('Неверный email или пароль')
        const token = 'mock-token-' + u.id
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(u))
        user.value = u
        return u
    }


    const register = async (name, email, password) => {
        const {data} = await api.get('/users', {params: {email}})
        if (data.length) throw new Error('Пользователь уже существует')
        const res = await api.post('/users', {name, email, password})
        const u = res.data
        const token = 'mock-token-' + u.id
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(u))
        user.value = u
        return u
    }


    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        user.value = null
    }


    return {user, login, register, logout}
}