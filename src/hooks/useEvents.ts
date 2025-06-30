import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Event } from '../types';

type Params = {
  q?: string;
  category?: string;
};

export const useEvents = (params: Params) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  );

  return useQuery<Event[]>({
    queryKey: ['events', cleanedParams],
    queryFn: async () => {
      const { data } = await api.get('/events', { params: cleanedParams });

      if (Array.isArray(data?.data))      return data.data;
      if (Array.isArray(data))            return data;
      if (Array.isArray(data?.events))    return data.events;

      return [];
    },
    placeholderData: [],
  });
};
