// src/services/eventReservation.service.ts
import api from './api';
import { EventReservation, EventReservationWithDetails } from './types';

interface CreateEventReservationPayload {
  plannerId: number;
  numberOfGuests: number;
  note?: string;
  confirmationMethod: 'email' | 'phone';
}

/**
 * Creates a reservation for an event. Requires organizer or admin role.
 */
const create = async (payload: CreateEventReservationPayload): Promise<{ message: string; reservation: EventReservation }> => {
    const response = await api.post('/reservations/events', payload);
    return response.data;
};

/**
 * Lists all event reservations for the current user. Requires organizer or admin role.
 */
const listMyReservations = async (): Promise<EventReservationWithDetails[]> => {
    const response = await api.get<EventReservationWithDetails[]>('/reservations/events/me');
    return response.data;
};

/**
 * Updates the status of a specific event reservation.
 * @param reservationId - The ID of the reservation to update.
 * @param status - The new status.
 */
const updateStatus = async (reservationId: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<{ message: string, reservation: EventReservation }> => {
    const response = await api.patch(`/reservations/events/${reservationId}`, { status });
    return response.data;
};

/**
 * Cancels (deletes) an event reservation.
 * @param reservationId - The ID of the reservation to cancel.
 */
const cancel = async (reservationId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/reservations/events/${reservationId}`);
    return response.data;
};

export const eventReservationService = {
    create,
    listMyReservations,
    updateStatus,
    cancel,
};