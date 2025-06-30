//-------------------------------------------------------
// src/pages/ExplorePage.tsx
//-------------------------------------------------------
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import api from '../lib/api';
import { FilterSidebar } from '../components/explore/FilterSidebar';
import { MapView } from '../components/explore/MapView';

import {
  calculateDistance,
  formatPrice,           // ← facultatif si tu l’utilises dans la sidebar
} from '../lib/utils';

import type {
  Event,
  Restaurant as RestaurantType,
  ExploreResult,
  FilterState,
  UserLocation,
} from '../types';

/* ------------------------------------------------------------------ */
/* Utils de mapping (repris de MapContentList)                         */
/* ------------------------------------------------------------------ */
const pickPlanning = (ev: Event) => {
  const p = ev.planifications?.[0];
  if (!p) return null;
  return {
    start: (p as any).startDate ?? (p as any).dateDebut,
    price: p.price,
  };
};

const parseList = <T,>(raw: any, key: string): T[] => {
  if (Array.isArray(raw)) return raw as T[];
  if (Array.isArray(raw?.data)) return raw.data as T[];
  if (Array.isArray(raw?.[key])) return raw[key] as T[];
  return [];
};

/* ------------------------------------------------------------------ */
/* Composant ExplorePage                                              */
/* ------------------------------------------------------------------ */
export const ExplorePage: React.FC = () => {
  /* ---------------------- State UI ---------------------- */
  const [filteredResults, setFilteredResults] = useState<ExploreResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExploreResult | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: 'Activités',
    date: null,
    time: null,
    priceRange: [0, 500],
    radius: 5,
    amenities: [],
  });

  /* ------------------ User geolocation ------------------ */
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  /* ----------------------------------------------------------------
   *   1. Chargement dynamique des events & restaurants
   * ---------------------------------------------------------------- */
  const {
    data: allResults = [],
    isLoading: isDataLoading,
    error: dataError,
  } = useQuery({
    queryKey: ['explore-results'],
    staleTime: 1000 * 60 * 5, // 5 min
    queryFn: async (): Promise<ExploreResult[]> => {
      const [evRes, restRes] = await Promise.all([
        api.get('/events'),
        api.get('/restaurants'),
      ]);

      /* --- Events → ExploreResult --- */
      const events = parseList<Event>(evRes.data, 'events')
        .filter((e) => e.latitude && e.longitude)
        .map((e) => {
          const plan = pickPlanning(e);
          return {
            id: `event-${e.id}`,
            name: e.title,
            description: e.address ?? '',
            category: 'Événements' as const,
            price: plan?.price ?? 0,
            rating: e.averageRating ?? 0,
            lat: Number(e.latitude),
            lng: Number(e.longitude),
            image: e.media?.[0]?.mediaUrl ?? '/placeholder.jpg',
            amenities: [], // ou ce que tu veux
          } satisfies ExploreResult;
        });

      /* --- Restaurants → ExploreResult --- */
      const restaurants = parseList<RestaurantType>(restRes.data, 'restaurants')
        .filter((r) => r.latitude && r.longitude)
        .map((r) => ({
          id: `rest-${r.id}`,
          name: r.name,
          description: r.address ?? '',
          category: 'Restaurants' as const,
          price: r.averagePrice ?? r.priceRange ?? 0,
          rating: r.averageRating ?? 0,
          lat: Number(r.latitude),
          lng: Number(r.longitude),
          image: r.media?.[0]?.mediaUrl ?? '/placeholder.jpg',
          amenities: r.cuisineType ? [r.cuisineType] : [],
        }) satisfies ExploreResult);

      return [...events, ...restaurants];
    },
  });

  /* ----------------------------------------------------------------
   *   2. Filtrage dynamique dès que data / filtres / loc changent
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (isDataLoading || !allResults.length) return;

    let temp = allResults;

    /* Filtre catégorie (Activités = tous) */
    if (filters.category === 'Événements' || filters.category === 'Restaurants') {
      temp = temp.filter((r) => r.category === filters.category);
    }

    /* Prix */
    temp = temp.filter(
      (r) => r.price >= filters.priceRange[0] && r.price <= filters.priceRange[1],
    );

    /* Distance si géoloc dispo */
    if (userLocation) {
      temp = temp
        .map((r) => ({
          ...r,
          distance: calculateDistance(userLocation.lat, userLocation.lng, r.lat, r.lng),
        }))
        .filter((r) => (r.distance ?? 0) <= filters.radius)
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }

    /* Commodités */
    if (filters.amenities.length) {
      temp = temp.filter((r) =>
        filters.amenities.some((a) => r.amenities?.includes(a)),
      );
    }

    setFilteredResults(temp);
  }, [allResults, filters, userLocation, isDataLoading]);

  /* ----------------------------------------------------------------
   *   3. Récupération de la position (une fois)
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Géolocalisation non supportée');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setIsGettingLocation(false);
      },
      (err) => {
        console.error('Geoloc error:', err);
        setIsGettingLocation(false);
        setLocationError('Impossible de récupérer la position');
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  /* ----------------------------------------------------------------
   *   4. Handlers
   * ---------------------------------------------------------------- */
  const handleFilterChange = (f: FilterState) => setFilters(f);
  const handleResultClick  = (r: ExploreResult) => setSelectedResult(r);

  /* ----------------------------------------------------------------
   *   5. UI
   * ---------------------------------------------------------------- */
  if (dataError)
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        Erreur de chargement des données
      </div>
    );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-96 flex-shrink-0 bg-white shadow-lg">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          results={filteredResults}
          onResultClick={handleResultClick}
          selectedResult={selectedResult}
          /* Ces trois props sont optionnelles : adapte ton FilterSidebar si besoin */
          userLocation={userLocation}
          locationError={locationError}
          isGettingLocation={isGettingLocation}
        />
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapView
          results={filteredResults}
          selectedResult={selectedResult}
          onMarkerClick={handleResultClick}
          userLocation={userLocation}
        />
      </div>

      {/* Loading overlay (data) */}
      {isDataLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};
