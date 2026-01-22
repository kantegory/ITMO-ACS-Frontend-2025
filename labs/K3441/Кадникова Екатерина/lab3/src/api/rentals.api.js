import { api } from './http';

export const createRental = dto =>
    api.post('/rentals', dto);

export const getMyRentals = () =>
    api.get('/rentals/my-rentals');

export const deleteRental = id =>
    api.delete(`/rentals/${id}`);

export const updateRentalStatus = (id, status) =>
    api.put(`/rentals/${id}/status`, { status });