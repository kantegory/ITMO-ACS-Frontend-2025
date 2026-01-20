import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

export async function fetchProperties(filters = {}) {
    const params = new URLSearchParams();

    if (filters.type && filters.type !== 'all') {
        params.set('type', filters.type);
    }

    if (filters.city && filters.city !== 'all') {
        params.set('city', filters.city);
    }

    if (filters.minPrice !== undefined && filters.minPrice !== '') {
        params.set('minPrice', String(filters.minPrice));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
        params.set('maxPrice', String(filters.maxPrice));
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiGet(`/properties${queryString}`, { auth: true });
}

export function fetchPropertyById(id) {
    return apiGet(`/properties/${id}`, { auth: true });
}

export function createProperty(data) {
    return apiPost('/properties', data, { auth: true });
}

export function updateProperty(id, data) {
    return apiPut(`/properties/${id}`, data, { auth: true });
}

export function deleteProperty(id) {
    return apiDelete(`/properties/${id}`, { auth: true });
}