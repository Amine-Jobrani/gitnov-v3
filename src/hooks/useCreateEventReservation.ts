// src/hooks/useCreateEventReservation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { AxiosResponse } from 'axios'

export interface CreateEventReservationPayload {
  plannerId: number
  numberOfGuests: number
  note?: string
  confirmationMethod?: string
}

export function useCreateEventReservation() {
  const qc = useQueryClient()

  return useMutation<
    AxiosResponse<{ message: string; reservation: any }>,
    Error,
    CreateEventReservationPayload
  >({
    // match your POST /reservations/events route
    mutationFn: payload =>
      api.post('/reservations/events', payload),

    // after we create one, refetch the “my events” list
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['reservations', 'events', 'me'],
      })
    },
  })
}
