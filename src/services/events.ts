// src/services/event.service.ts
import api from './api';
import { Event, FullEvent, Planner, EventWithPlanner } from './types';

// Based on the Joi schema in eventController.js
export interface EventPayload {
  title: string;
  slug?: string;
  description: string;
  tags?: string;
  latitude?: number | null;
  longitude?: number | null;
  address: string;
  city: string;
  category: string;
  date_debut: string; // ISO Date string
  date_fin: string; // ISO Date string
  price: number;
  nombre_place: number;
  userId: string; // This should come from auth state on the frontend
}

interface EventCreationResponse {
    success: boolean;
    message: string;
    data: {
        event: Event;
        planning: Planner;
    };
}

/**
 * Creates a new event. Requires organizer role.
 * @param data - The payload containing all event and planning details.
 */
const createEvent = async (data: EventPayload): Promise<EventCreationResponse> => {
  const response = await api.post('/events', data);
  return response.data;
};

/**
 * Updates an existing event. Requires ownership of the event.
 * @param eventId - The ID of the event to update.
 * @param data - The payload containing the fields to update.
 */
const updateEvent = async (eventId: string, data: Partial<EventPayload>): Promise<any> => {
  const response = await api.put(`/events/${eventId}`, data);
  return response.data;
};

/**
 * Fetches all events.
 */
const getAllEvents = async (): Promise<FullEvent[]> => {
  const response = await api.get<{ data: FullEvent[] }>('/events');
  return response.data.data;
};

/**
 * Fetches a single event by its ID.
 * @param eventId - The ID of the event.
 */
const getEventById = async (eventId: string): Promise<EventWithPlanner> => {
  const response = await api.get<{ data: EventWithPlanner }>(`/events/${eventId}`);
  return response.data.data;
};

/**
 * Fetches a single event by its slug.
 * @param slug - The URL-friendly slug of the event.
 */
const getEventBySlug = async (slug: string): Promise<FullEvent> => {
  const response = await api.get<FullEvent>(`/events/slug/${slug}`);
  return response.data;
};

/**
 * Deletes an event. Requires ownership.
 * @param eventId - The ID of the event to delete.
 * @param userId - The ID of the user performing the deletion (for verification).
 */
const deleteEvent = async (eventId: string, userId: string): Promise<{ message: string }> => {
  // Note: Backend expects userId in the body for a DELETE request.
  const response = await api.delete(`/events/${eventId}`, { data: { userId } });
  return response.data;
};

export const eventService = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  getEventBySlug,
  deleteEvent,
};