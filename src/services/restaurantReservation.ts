// src/services/restaurantReservation.service.ts
import api from './api';
import { RestaurantReservation, RestaurantReservationWithDetails } from './types';

interface CreateRestaurantReservationPayload {
  restaurantId: number;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  note?: string;
  confirmationMethod?: 'email' | 'phone';
}

/**
 * Creates a reservation for a restaurant.
 */
const create = async (payload: CreateRestaurantReservationPayload): Promise<{ message: string; reservation: RestaurantReservation }> => {
    const response = await api.post('/reservations/restaurants', payload);
    return response.data;
};

/**
 * Lists all restaurant reservations for the current user.
 */
const listMyReservations = async (): Promise<RestaurantReservationWithDetails[]> => {
    const response = await api.get<RestaurantReservationWithDetails[]>('/reservations/restaurants/me');
    return response.data;
};

/**
 * Updates the status of a specific restaurant reservation.
 * @param reservationId - The ID of the reservation to update.
 * @param status - The new status.
 */
const updateStatus = async (reservationId: number, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<{ message: string, reservation: RestaurantReservation }> => {
    const response = await api.patch(`/reservations/restaurants/${reservationId}`, { status });
    return response.data;
};

/**
 * Cancels (deletes) a restaurant reservation.
 * @param reservationId - The ID of the reservation to cancel.
 */
const cancel = async (reservationId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/reservations/restaurants/${reservationId}`);
    return response.data;
};

export const restaurantReservationService = {
    create,
    listMyReservations,
    updateStatus,
    cancel,
}; 