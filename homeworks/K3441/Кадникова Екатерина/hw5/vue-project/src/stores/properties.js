import { defineStore } from 'pinia'
import { propertiesApi } from '@/api'

const usePropertiesStore = defineStore('properties', {
    state: () => ({
        properties: []
    }),

    actions: {
        async loadProperties() {
            const response = await propertiesApi.getAll()
            this.properties = response.data
            return response
        },

        async createProperty(data) {
            const response = await propertiesApi.createProperty(data)
            await this.loadProperties()
            return response
        }
    }
})

export default usePropertiesStore