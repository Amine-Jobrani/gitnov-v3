// src/services/types.ts

// --- USER & AUTH ---
export interface User {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  }
  
  export interface UserWithRole extends User {
    role: 'client' | 'partner' | 'organizer' | 'admin' | 'user';
  }
  
  export interface ClientRequest {
      id: number;
      user_id: string;
      becomePartner: boolean;
      becomeOrganizer: boolean;
      user: User;
  }
  
  
  // --- RESTAURANT ---
  export interface Restaurant {
    id: number;
    name: string;
    slug: string;
    description: string;
    address: string;
    city: string;
    latitude?: number;
    longitude?: number;
    phone: string;
    website?: string;
    cuisine: string;
    chain_id: number;
  }
  
  export interface RestaurantMedia {
    id: number;
    url: string;
    type: 'image' | 'video';
  }
  
  export interface Chain {
    id: number;
    name: string;
    partner_id: number;
  }
  
  export interface FullRestaurant extends Restaurant {
    media: RestaurantMedia[];
    Chain: Chain;
  }
  
  export interface RestaurantReservation {
      id: number;
      userId: string;
      restaurantId: number;
      reservationDate: string; // ISO Date string
      reservationTime: string; // "HH:MM:SS"
      numberOfGuests: number;
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
      note?: string;
      confirmationMethod: 'email' | 'phone';
  }
  
  export interface RestaurantReservationWithDetails extends RestaurantReservation {
      restaurant: Restaurant;
  }
  
  // --- EVENT & ACTIVITY ---
  export interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags?: string;
    latitude?: number;
    longitude?: number;
    address: string;
    city: string;
    category: string;
  }
  
  export interface EventMedia {
      id: number;
      url: string;
      type: 'image' | 'video';
  }
  
  export interface Planner {
    id: number;
    startDate: string; // ISO Date string
    endDate: string; // ISO Date string
    price: number;
    availableSeats: number;
    organizerId: number;
    eventId: number;
  }
  
  export interface FullEvent extends Event {
    media: EventMedia[];
    planifications: Planner[];
  }
  
  export interface EventWithPlanner {
      event: Event;
      eventPlanner: Planner;
  }
  
  export interface EventReservation {
      id: number;
      plannerId: number;
      userId: string;
      numberOfGuests: number;
      status: 'pending' | 'confirmed' | 'cancelled';
      note?: string;
      confirmationMethod: 'email' | 'phone';
  }
  
  export interface EventReservationWithDetails extends EventReservation {
      planner: Planner & {
          event: Event;
      };
  }
  
  
  // --- REVIEW ---
  export interface ReviewPayload {
      rating: number;
      comment: string;
  }
  
  export interface RestaurantReview extends ReviewPayload {
      id: number;
      user_id: string;
      restaurant_id: number;
      created_at: string;
  }
  
  export interface EventReview extends ReviewPayload {
      id: number;
      user_id: string;
      event_id: number;
      created_at: string;
  }
  
  export interface AverageRatingResponse {
      average_rating: string;
      total_reviews: number;
  }
  
  // --- NOTIFICATION ---
  export interface Notification {
      id: number;
      user_id: string;
      type: string;
      content: string;
      is_read: boolean;
      created_at: string;
  }