import { defineStore } from 'pinia';
import { api } from '@/api/http';
//import router from '@/router/index.js';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        loading: false,
    }),

    actions: {
        async loadMe() {
            this.loading = true;
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    this.user = JSON.parse(storedUser);
                    return this.user;
                }

                const { data } = await api.get('/users/me');
                this.user = data;
            } catch (err) {
                console.error('Ошибка загрузки пользователя', err);
                this.user = null;
            } finally {
                this.loading = false;
            }
        },

        async updateUser(payload) {
            if (!this.user?.id) return null;

            const { data } = await api.put(`/users/${this.user.id}`, payload);
            this.user = data;

            localStorage.setItem('user', JSON.stringify(data));
            return data;
        },

        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.user = null;
            //router.push('/');
        }
    }
});