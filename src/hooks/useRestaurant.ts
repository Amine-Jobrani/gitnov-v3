// src/hooks/useRestaurant.ts
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { Restaurant as RestaurantType } from '../types'

/**
 * Fetch a single restaurant by slug.
 */
export function useRestaurant(slug: string) {
  return useQuery<RestaurantType, Error>({
    queryKey: ['restaurant', slug],
    queryFn: async () => {
      const { data } = await api.get<RestaurantType>(`/restaurants/slug/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}
/**
 * Fetch all restaurants.
 */
export function useRestaurants() {
  return useQuery<RestaurantType[], Error>({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data } = await api.get<RestaurantType[]>('/restaurants')
      return data
    },
  })
}