// MapContent.tsx
import React from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Heart, MapPin, Star, Calendar } from 'lucide-react';

interface MapContentProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  cover?: string;
  price?: number;
  rating?: number;
  date?: string;
}

const createCustomIcon = () => {
  const iconHtml = `
    <div style="
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(-45deg);
      position: relative;
    ">
      <div style="
        color: white;
        font-size: 12px;
        transform: rotate(45deg);
        font-weight: bold;
      ">📍</div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'custom-marker'
  });
};

const MapContent: React.FC<MapContentProps> = ({
  latitude,
  longitude,
  title,
  address,
  cover,
  price,
  rating,
  date
}) => {
  const center: LatLngExpression = [latitude, longitude];

  return (
    <MapContainer
      center={center}
      zoom={15}
      className="w-full h-full"
      style={{ minHeight: '300px', zIndex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[latitude, longitude]} icon={createCustomIcon()}>
        <Popup offset={[0, -10]} closeButton={false}>
          <div className="w-64">
            {cover && (
              <img
                src={cover}
                alt={title}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="text-sm font-bold">{title}</h3>
            {address && (
              <p className="text-xs text-gray-600 flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> {address}
              </p>
            )}
            {date && (
              <p className="text-xs text-gray-600 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> {date}
              </p>
            )}
            {typeof rating === 'number' && (
              <div className="flex items-center mt-1 text-yellow-500 text-xs">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {rating.toFixed(1)}
              </div>
            )}
            {typeof price === 'number' && (
              <div className="mt-1 text-xs font-semibold text-orange-600">
                {price} MAD
              </div>
            )}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapContent;
