/**
 * DONNÉES FACTICES GLOBALES
 * ─────────────────────────
 * On regroupe ici tous les « mocks » (events, restaurants, users …)
 * + les résultats utilisés par l’écran “Explorer”.
 */
import { Event, Restaurant, User, ExploreResult } from '../types';

/* ------------------------------------------------------------------ */
/*  ÉVÉNEMENTS                                                         */
/* ------------------------------------------------------------------ */
export const mockEvents: Event[] = [
  /* … (inchangé – garde exactement ce que tu avais) … */
];

/* ------------------------------------------------------------------ */
/*  RESTAURANTS                                                        */
/* ------------------------------------------------------------------ */
export const mockRestaurants: Restaurant[] = [
  /* … (inchangé – garde exactement ce que tu avais) … */
];

/* ------------------------------------------------------------------ */
/*  UTILISATEURS                                                       */
/* ------------------------------------------------------------------ */
export const mockUsers: User[] = [
  /* … (inchangé – garde exactement ce que tu avais) … */
];

/* ------------------------------------------------------------------ */
/*  EXPLORATION : résultats mixés (Activités, Événements, etc.)        */
/* ------------------------------------------------------------------ */
export const mockResults: ExploreResult[] = [
  {
    id: '1',
    name: 'Hassan II Mosque',
    description:
      'Une des plus grandes mosquées au monde avec une architecture époustouflante',
    image:
      'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    distance: 2.3,
    category: 'Activités',
    lat: 33.6084,
    lng: -7.6326,
    price: 0,
    amenities: ['Parking', 'Accessible'],
  },
  {
    id: '2',
    name: "Rick's Café",
    description:
      'Restaurant inspiré du film Casablanca avec ambiance vintage',
    image:
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    distance: 1.8,
    category: 'Restaurants',
    lat: 33.5943,
    lng: -7.6171,
    price: 45,
    amenities: ['WiFi', 'Terrasse', 'Climatisation'],
  },
  {
    id: '3',
    name: 'Villa des Arts',
    description: "Centre culturel et galerie d'art contemporain",
    image:
      'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    distance: 3.2,
    category: 'Événements',
    lat: 33.5885,
    lng: -7.6114,
    price: 15,
    amenities: ['WiFi', 'Accessible'],
  }
]  