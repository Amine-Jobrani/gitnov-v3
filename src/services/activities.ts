// src/services/activity.service.ts
import api from './api';
import { Event } from './types';

/**
 * Fetches all events categorized as 'activity'.
 * @returns A list of activities.
 */
const getActivities = async (): Promise<Event[]> => {
    const response = await api.get<{ data: Event[] }>('/activities/activities');
    return response.data.data;
};

export const activityService = {
    getActivities,
};