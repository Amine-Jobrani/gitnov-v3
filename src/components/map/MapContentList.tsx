//-------------------------------------------------------
// src/components/map/MapContentList.tsx
//-------------------------------------------------------
import React from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Heart, MapPin, Star, Calendar, Utensils } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import api from '../../lib/api';
import type { Event, Restaurant as RestaurantType } from '../../types';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
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

const createCustomIcon = (type: 'event' | 'restaurant') => {
  const emoji = type === 'event' ? '🎵' : '🍽️';
  const html = `
    <div style="
      background: linear-gradient(135deg,#f97316 0%,#ea580c 100%);
      width: 32px; height: 32px;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,.3);
      display: flex; align-items: center; justify-content: center;
      transform: rotate(-45deg);
    ">
      <div style="color:white;font-size:12px;font-weight:bold;transform:rotate(45deg)">${emoji}</div>
    </div>
  `;
  return L.divIcon({
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'custom-marker',
  });
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
const MapContentList: React.FC = () => {
  const { data: markers = [], isLoading, error } = useQuery({
    queryKey: ['events-restaurants', 'map-home'],
    queryFn: async () => {
      const [evRes, restRes] = await Promise.all([
        api.get('/events'),
        api.get('/restaurants'),
      ]);

      const events       = parseList<Event>(evRes.data,  'events');
      const restaurants  = parseList<RestaurantType>(restRes.data, 'restaurants');

      const eventMarkers = events
        .filter((e) => e.latitude && e.longitude)
        .map((e) => {
          const lat = Number(e.latitude);
          const lon = Number(e.longitude);
          if (isNaN(lat) || isNaN(lon)) return null;

          const plan = pickPlanning(e);
          return {
            id:   `event-${e.id}`,
            type: 'event' as const,
            slug: e.slug,
            title: e.title,
            address: `${e.address ?? ''}${e.city ? ', ' + e.city : ''}`,
            latitude: lat,
            longitude: lon,
            price: plan?.price,
            cover: e.media?.[0]?.mediaUrl,
            date:  plan?.start,
            rating: e.averageRating,
          };
        })
        .filter(Boolean) as any[];

      const restMarkers = restaurants
        .map((r) => {
          const lat = Number(r.latitude);
          const lon = Number(r.longitude);
          if (isNaN(lat) || isNaN(lon)) return null;

          return {
            id:   `rest-${r.id}`,
            type: 'restaurant' as const,
            slug: r.slug,
            title: r.name,
            address: `${r.address ?? ''}${r.city ? ', ' + r.city : ''}`,
            latitude: lat,
            longitude: lon,
            price: r.averagePrice ?? r.priceRange,
            cover: r.media?.[0]?.mediaUrl,
            cuisine: r.cuisineType,
            rating: r.averageRating,
          };
        })
        .filter(Boolean) as any[];

      return [...eventMarkers, ...restMarkers];
    },
  });

  if (isLoading)
    return <div className="h-60 flex items-center justify-center">Chargement…</div>;
  if (error)
    return (
      <div className="h-60 flex items-center justify-center text-red-600">
        Erreur de chargement
      </div>
    );
  if (markers.length === 0)
    return (
      <div className="h-60 flex items-center justify-center">
        Aucun résultat trouvé
      </div>
    );

  const center: LatLngExpression = [markers[0].latitude, markers[0].longitude];

  return (
    <div className="w-full h-full overflow-hidden rounded-2xl shadow-lg">
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full"
        style={{ minHeight: '500px', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.latitude, m.longitude]}
            icon={createCustomIcon(m.type)}
          >
            <Popup offset={[0, -10]} closeButton={false} className="custom-popup">
              {/* ---- style original ---- */}
              <div className="bg-white rounded-xl shadow-lg w-72 overflow-hidden">
                <div className="relative">
                  <img
                    src={m.cover ?? '/placeholder.jpg'}
                    alt={m.title}
                    className="w-full h-40 object-cover"
                  />

                  {m.price && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {m.price} {typeof m.price === 'number' ? 'MAD' : ''}
                    </div>
                  )}

                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>

                  {typeof m.rating === 'number' && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span className="text-xs font-medium">
                        {m.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {m.title}
                  </h3>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p className="text-sm truncate">{m.address}</p>
                  </div>

                  {m.type === 'event' && m.date && (
                    <div
                      className="flex items-center text-gray-600 mb-3"
                      style={{ marginBottom: '5px' }}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      <p className="text-sm">{m.date}</p>
                    </div>
                  )}

                  {m.type === 'restaurant' && m.cuisine && (
                    <p
                      className="text-sm text-gray-600 mb-3"
                      style={{ marginLeft: '1.25rem', marginBottom: '5px' }}
                    >
                      {m.cuisine}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      (window.location.href =
                        m.type === 'restaurant'
                          ? `/restaurants/${m.slug}`
                          : `/events/${m.slug}`)
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    {m.type === 'restaurant'
                      ? 'Réserver une table'
                      : 'En savoir plus'}
                  </button>
                </div>
              </div>
              {/* ---- /style original ---- */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapContentList;
