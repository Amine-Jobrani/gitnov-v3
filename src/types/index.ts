export interface User {
  /** UID Firebase */
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  role: 'client' | 'organizer' | 'partner' | 'admin';
  preferences?: Record<string, any>;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;

  /** Token Firebase ID (JWT signé) — optionnel */
  idToken?: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  tags: string; // comma-separated string from backend (e.g., "music,jazz,festival")
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  postalCode: string;
  category: string;
  createdAt: string;
  updatedAt: string;

  media?: EventMedia[];
  planifications?: EventPlanning[];

  // Enriched fields from frontend or computed
  isFavorite?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

export interface EventMedia {
  id: number;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  eventId: number;
}

export interface EventPlanning {
  id: number;
  organisateurId: number;
  eventId: number;
  dateDebut: string;
  dateFin: string;
  price: number;
  ticketType: string;
  nombrePlace: number;
  placesRestantes?: number;
}

export interface Restaurant {
  id: number;
  chaineId?: number;
  name: string;
  slug: string;
  description: string;
  cuisineType: string;
  priceRange: string;
  averagePrice: number;
  openingHours: Record<string, string>;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  amenities: string[];
  media: RestaurantMedia[];
  createdAt: string;
  updatedAt: string;

  // Enriched fields
  isFavorite?: boolean;
  averageRating?: number;
  reviewCount?: number;
  distance?: number;
}

export interface RestaurantMedia {
  id: number;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  restaurantId: number;
}

export interface Reservation {
  id: number;
  clientId: number;
  restaurantId: number;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  isConfirmationSent: boolean;
  createdAt: string;
  updatedAt: string;

  restaurant?: Restaurant;
}

export interface Review {
  id: number;
  userId: string;
  entityId: number;
  entityType: 'event' | 'restaurant';
  rating: number;
  comment: string;
  createdAt: string;

  user?: User;
}

export interface FilterOptions {
  category?: string;
  cuisineType?: string;
  priceRange?: string;
  date?: string;
  location?: string;
  maxDistance?: number;
  rating?: number;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
  name: string;
  type: 'event' | 'restaurant';
  id: number;
}

export interface ExploreResult {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  distance: number;
  category: string;
  lat: number;
  lng: number;
  price: number;
  amenities: string[];
}

export interface FilterState {
  category: string;
  date: Date | null;
  time: string | null;
  priceRange: [number, number];
  radius: number;
  amenities: string[];
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface DashboardRequest {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  createdAt: string;
}

export type PartnerRequest   = DashboardRequest;
export type OrganizerRequest = DashboardRequest;