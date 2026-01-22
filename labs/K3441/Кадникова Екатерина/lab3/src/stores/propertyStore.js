import { defineStore } from 'pinia';
import { getUserProperties, updateProperty, deleteProperty } from '@/api/properties.api';

export const usePropertyStore = defineStore('properties', {
    state: () => ({
        list: [],
        loading: false,
    }),

    actions: {
        async loadUserProperties(userId) {
            this.loading = true;
            try {
                this.list = await getUserProperties(userId);
            } finally {
                this.loading = false;
            }
        },

        async saveProperty(id, data) {
            await updateProperty(id, data);
            await this.loadUserProperties(this.list[0]?.ownerId);
        },

        async remove(id) {
            await deleteProperty(id);
            this.list = this.list.filter(p => p.id !== id);
        }
    }
});