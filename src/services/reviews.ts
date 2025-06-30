// src/services/review.service.ts
import api from './api';
import { AverageRatingResponse, RestaurantReview, EventReview, ReviewPayload } from './types';

// --- RESTAURANT REVIEWS ---

const getRestaurantAverageRating = async (restaurantId: number): Promise<AverageRatingResponse> => {
    const response = await api.get<AverageRatingResponse>(`/reviews/restaurants/${restaurantId}/average-rating`);
    return response.data;
};

const getRestaurantReviews = async (restaurantId: number): Promise<{ reviews: RestaurantReview[] }> => {
    const response = await api.get(`/reviews/restaurants/${restaurantId}/reviews`);
    return response.data;
};

const submitRestaurantReview = async (restaurantId: number, data: ReviewPayload): Promise<{ review: RestaurantReview }> => {
    const response = await api.post(`/reviews/restaurants/${restaurantId}/reviews`, data);
    return response.data;
};

const updateRestaurantReview = async (reviewId: number, data: ReviewPayload): Promise<{ review: RestaurantReview }> => {
    const response = await api.put(`/reviews/restaurants/reviews/${reviewId}`, data);
    return response.data;
};

const deleteRestaurantReview = async (reviewId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/reviews/restaurants/reviews/${reviewId}`);
    return response.data;
};

// --- EVENT REVIEWS ---

const getEventAverageRating = async (eventId: number): Promise<AverageRatingResponse> => {
    const response = await api.get<AverageRatingResponse>(`/reviews/events/${eventId}/average-rating`);
    return response.data;
};

const getEventReviews = async (eventId: number): Promise<{ reviews: EventReview[] }> => {
    const response = await api.get(`/reviews/events/${eventId}/reviews`);
    return response.data;
};

const submitEventReview = async (eventId: number, data: ReviewPayload): Promise<{ review: EventReview }> => {
    const response = await api.post(`/reviews/events/${eventId}/reviews`, data);
    return response.data;
};

const updateEventReview = async (reviewId: number, data: ReviewPayload): Promise<{ review: EventReview }> => {
    const response = await api.put(`/reviews/events/reviews/${reviewId}`, data);
    return response.data;
};

const deleteEventReview = async (reviewId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/reviews/events/reviews/${reviewId}`);
    return response.data;
};


export const reviewService = {
    getRestaurantAverageRating,
    getRestaurantReviews,
    submitRestaurantReview,
    updateRestaurantReview,
    deleteRestaurantReview,
    getEventAverageRating,
    getEventReviews,
    submitEventReview,
    updateEventReview,
    deleteEventReview,
};