// src/components/map/SimpleMap.tsx
'use client';

import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface SimpleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  markerIconUrl?: string;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
  lat,
  lng,
  zoom = 14,
  markerIconUrl = '/custom-marker.png',
}) => {
  const position: [number, number] = [lat, lng];
  const icon = L.icon({
    iconUrl: markerIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: 'leaflet/dist/images/marker-shadow.png',
  });

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      className="w-full h-full rounded-xl overflow-hidden"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={icon}>
        <Popup closeButton={false} offset={[0, -10]}>
          <div className="text-sm">{`[${lat.toFixed(3)}, ${lng.toFixed(3)}]`}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};
