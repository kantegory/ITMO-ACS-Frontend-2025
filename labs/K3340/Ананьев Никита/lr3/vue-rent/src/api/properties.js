import { buildQuery } from "@/utils/queryBuilder"

class PropertiesApi {
    constructor(instance) {
        this.API = instance
        this.base = '/properties'
    }

    getProperyById = async (id) => {
        return this.API({
            url: `${this.base}?id=${id}`
        })
    }

    getFilteredProperties = async (filters) => {
        const queryString = buildQuery(filters)

        return this.API({
            url: `${this.base}${queryString}`
        })
    }
}

export {
    PropertiesApi
}