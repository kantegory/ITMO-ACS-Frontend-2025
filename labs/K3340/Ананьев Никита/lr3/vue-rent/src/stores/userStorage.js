import { defineStore } from 'pinia'
import { userApi } from '@/router';
import { ref, watch } from 'vue'

const DEFAULT_ROLE = 'tenant';

const defaultUserData = () => {
    return {
        name: null, 
        email: null,
        phone: null,
        password: null,
        role: DEFAULT_ROLE,
        city: null
    }
}

const useUserStore = defineStore('users', () => {
    const user = ref(defaultUserData())

    const usersCache = new Map();

    const localUser = localStorage.getItem('user');
    if (localUser) {
        user.value = JSON.parse(localUser);
    }

    async function loadUserById(id) {
        if (usersCache.has(id)) {
            return usersCache.get(id)
        }

        const response = await userApi.getUserById(id)
        if (response.status !== 200 || response.data.length === 0) {
            throw new Error(`Can't find user with id=${id}`)
        }

        usersCache.set(id, response.data[0])
        return response.data[0]
    }

    async function loadUser(email) {
        const response = await userApi.getUserByEmail(email)
        if (response.status === 404 || response.data.length === 0) {
            throw new Error(`Can't find user with email=${email}`)
        }

        user.value = { ...user.value,  ...response.data[0]}
        return response
    }

    async function createUser(userData) {
        const response = await userApi.createUser(userData)

        if (response.status != 201 && !response.ok) 
            throw new Error(`HTTP error during user creation, status: ${response.status}`)

        user.value = { ...user.value,  ...response.data}
    }

    function clearUserData() {
        Object.assign(user, defaultUserData())
        localStorage.removeItem('user')
    }

    watch(user, (newUser) => {
        localStorage.setItem('user', JSON.stringify(newUser));
    }, { deep: true });

    return {DEFAULT_ROLE, user, loadUserById, loadUser, createUser, clearUserData}
})

export default useUserStore
