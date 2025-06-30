// src/services/notification.api.service.ts
import api from './api';
import { Notification } from './types';

/**
 * Fetches the full notification history for the authenticated user from the database.
 * Useful for when the user navigates to the notifications page.
 */
const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications/notifications');
    return response.data;
};

/**
 * Marks a specific notification as read in the database.
 * @param notificationId - The ID of the notification to mark as read.
 */
const markAsRead = async (notificationId: number): Promise<{ message: string }> => {
    const response = await api.patch(`/notifications/notification/${notificationId}/read`);
    return response.data;
};

export const notificationApiService = {
    getNotifications,
    markAsRead,
};