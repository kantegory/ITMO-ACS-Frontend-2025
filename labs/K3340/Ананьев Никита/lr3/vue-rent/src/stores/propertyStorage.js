import { defineStore } from 'pinia'
import { propertiesApi } from '@/router';
import { ref, computed } from 'vue';

const usePropertyStore = defineStore('properties', () => {
    const properties = ref([])

    async function loadProperties(filters) {
        const response = await propertiesApi.getFilteredProperties(filters)

        properties.value = response.data
        return response
    }

    return {properties, loadProperties}
})

export default usePropertyStore 