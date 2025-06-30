// src/services/restaurant.service.ts

import api from './api';
import { RestaurantPayload } from '../types/payloads';
import { Restaurant } from '../types/restaurant';

export type FullRestaurant = Restaurant;

/**
 * Fetches and normalizes all restaurants.
 */
const list = async (): Promise<FullRestaurant[]> => {
  const response = await api.get<FullRestaurant[]>('/restaurants/');
  return response.data.map(normalizeRestaurant);
};

/**
 * Fetches and normalizes a restaurant by ID.
 */
const getById = async (id: number): Promise<FullRestaurant> => {
  const response = await api.get<FullRestaurant>(`/restaurants/${id}`);
  return normalizeRestaurant(response.data);
};

/**
 * Fetches and normalizes a restaurant by slug.
 */
const getBySlug = async (slug: string): Promise<FullRestaurant> => {
  const response = await api.get<FullRestaurant>(`/restaurants/slug/${slug}`);
  return normalizeRestaurant(response.data);
};

/**
 * Fetches all restaurants belonging to a chain by chain ID.
 */
const getByChain = async (chainId: number): Promise<FullRestaurant[]> => {
  const response = await api.get<FullRestaurant[]>(`/restaurants/chain/${chainId}`);
  return response.data.map(normalizeRestaurant);
};

/**
 * Creates a new restaurant.
 */
const create = async (data: RestaurantPayload): Promise<Restaurant> => {
  const response = await api.post<Restaurant>('/restaurants/', data);
  return response.data;
};

/**
 * Updates an existing restaurant by ID.
 */
const update = async (
  id: number,
  data: Partial<RestaurantPayload>
): Promise<Restaurant> => {
  const response = await api.put<Restaurant>(`/restaurants/${id}`, data);
  return response.data;
};

/**
 * Deletes a restaurant by ID.
 */
const remove = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/restaurants/${id}`);
  return response.data;
};

/**
 * Normalizes fields like amenities and coordinates from backend.
 */
function normalizeRestaurant(data: any): FullRestaurant {
  return {
    ...data,
    latitude: String(data.latitude ?? ''),
    longitude: String(data.longitude ?? ''),
    amenities: Array.isArray(data.amenities)
      ? data.amenities
      : parseAmenities(data.amenities),
  };
}

/**
 * Safely parses amenities whether it’s a stringified array or not.
 */
function parseAmenities(input: unknown): string[] {
  try {
    if (typeof input === 'string') {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    }
    return Array.isArray(input) ? input : [];
  } catch {
    return [];
  }
}

export const restaurantService = {
  list,
  getById,
  getBySlug,
  getByChain,
  create,
  update,
  remove,
};
