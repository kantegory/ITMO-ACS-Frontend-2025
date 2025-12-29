import { defineStore } from 'pinia'
import { UserApi } from '@/api/users'

const useUserStore = defineStore('notes', {
    state: () => ({
        user: NaN
    }),

    actions: {
        async loadUser(email) {
            const response = await UserApi.getUserByEmail(email)
            if (response.status === 404) {
                throw new Error(`Can't find user with email=${email}`)
            }

            this.user = response.data
            return response
        },

        async createUser(userData) {
            const response = await UserApi.createUser(userData)
            if (!response.ok) 
                throw new Error(`HTTP error during user creation, status: ${response.status}`)

            this.user = response.data
        }
    }
})

export default useUserStore
