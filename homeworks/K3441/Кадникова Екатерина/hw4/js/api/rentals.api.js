import { request } from '../core/http.js';

export async function createRental(dto) {
    return request('/rentals', 'POST', dto);
}

export async function getMyRentals() {
    return request('/rentals/my-rentals', 'GET');
}

export async function deleteRental(id) {
    return request(`/rentals/${id}`, 'DELETE');
}

export async function updateRentalStatus(id, status) {
    return request(`/rentals/${id}/status`, 'PUT', { status });
}