import { defineStore } from 'pinia';
import { getMyRentals, updateRentalStatus } from '@/api/rentals.api';

export const useRentalStore = defineStore('rentals', {
    state: () => ({
        list: [],
        loading: false
    }),

    actions: {
        async loadMy() {
            this.loading = true;
            try {
                const { data } = await getMyRentals();
                this.list = data;
            } finally {
                this.loading = false;
            }
        },

        async updateStatus(id, status) {
            await updateRentalStatus(id, status);
            await this.loadMy();
        }
    }
});