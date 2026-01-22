import { defineStore } from 'pinia'
import { propertiesApi } from '@/router';
import { ref } from 'vue';

export class PropertyNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'Property Not Found Error';
        this.stack = (new Error()).stack;
    }
}

export const usePropertyStore = defineStore('properties', () => {
    const properties = ref([])
    const propertyById = new Map()

    async function loadProperties(filters) {
        const response = await propertiesApi.getFilteredProperties(filters)

        properties.value = response.data
        return response
    }

    async function loadSingleProperty(id) {
        if (propertyById.has(id)) {
            return propertyById.get(id)
        }

        const response = await propertiesApi.getProperyById(id)
        console.log("REQUEST ID", id, "RESPOSNE:", response.data)

        if (response.data.length !== 0) {
            propertyById.set(id, response.data[0])

            return response.data[0]
        }

        throw new PropertyNotFound(`Property with id=${id} not found.`)
    }

    return {properties, loadProperties, loadSingleProperty}
})
