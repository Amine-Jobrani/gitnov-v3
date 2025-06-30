import React, { useEffect, useRef, useState } from 'react';
import L, { DivIcon, LatLngExpression } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import {
  Heart,
  Locate,
  MapPin,
  Navigation,
  Star,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ExploreResult, UserLocation } from '../../types';
import { cn, formatPrice } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/*  PROPS                                                             */
/* ------------------------------------------------------------------ */
interface MapViewProps {
  results: ExploreResult[];
  selectedResult: ExploreResult | null;
  onMarkerClick: (r: ExploreResult) => void;
  userLocation?: UserLocation | null;
}

/* ------------------------------------------------------------------ */
/*  CONST                                                             */
/* ------------------------------------------------------------------ */
const CASA_CENTER: LatLngExpression = [33.5943, -7.6171];
const BASE_ZOOM = 13;

/* Icône ronde dégradée avec émoji catégorie */
const iconFor = (category: string): DivIcon => {
  const symbols: Record<string, string> = {
    Activités: '🎯',
    Événements: '🎵',
    Restaurants: '🍽️',
    Tendances: '📈',
  };
  return L.divIcon({
    html: `
      <div style="
        background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);
        width:32px;height:32px;border-radius:50% 50% 50% 0;
        border:3px solid #fff;display:flex;align-items:center;
        justify-content:center;transform:rotate(-45deg)">
        <span style="
          color:#fff;font-size:14px;font-weight:bold;transform:rotate(45deg)">
          ${symbols[category] ?? '📍'}
        </span>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'leaflet-custom-marker',
  });
};

// Fixed user icon with better visibility
const userIcon = L.divIcon({
  html: `
    <div style="
      width:24px;
      height:24px;
      border:4px solid #fff;
      background:#3b82f6;
      border-radius:50%;
      box-shadow:0 0 0 4px rgba(59,130,246,.5), 0 2px 8px rgba(0,0,0,0.3);
      position:relative;
    ">
      <div style="
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:8px;
        height:8px;
        background:#fff;
        border-radius:50%;
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'user-location-marker',
});

/* ------------------------------------------------------------------ */
/*  COMPOSANT                                                         */
/* ------------------------------------------------------------------ */
export const MapView: React.FC<MapViewProps> = ({
  results,
  selectedResult,
  onMarkerClick,
  userLocation: externalLoc,
}) => {
  // Internal location state for the locate button
  const [internalLoc, setInternalLoc] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Use external location if provided, otherwise use internal
  const userLocation = externalLoc ?? internalLoc;

  const mapRef = useRef<L.Map | null>(null);

  /* ----------------------------------------------------------------
   *  Auto geolocation on mount if no external location provided
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!externalLoc && !internalLoc) {
      locateMe();
    }
  }, [externalLoc, internalLoc]);

  /* ----------------------------------------------------------------
   *  Center map when user location appears or changes
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (userLocation && mapRef.current) {
      console.log('Centering map on user location:', userLocation);
      mapRef.current.flyTo(
        [userLocation.lat, userLocation.lng],
        16,
        { duration: 1 },
      );
    }
  }, [userLocation]);

  /* ----------------------------------------------------------------
   *  Center when selecting a result
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (selectedResult && mapRef.current) {
      mapRef.current.flyTo(
        [selectedResult.lat, selectedResult.lng],
        16,
        { duration: 0.5 },
      );
    }
  }, [selectedResult]);

  /* ------------------- Enhanced geolocation function ------------------- */
  const locateMe = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Géolocalisation non supportée par ce navigateur');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Got user location:', { lat: latitude, lng: longitude });
        
        setInternalLoc({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setLocationError(null);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocating(false);
        
        let errorMessage = 'Erreur de géolocalisation';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai dépassé pour la géolocalisation';
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  /* ----------------------------------------------------------------
   *  Custom controls (zoom + locate)
   * ---------------------------------------------------------------- */
  const Controls = () => {
    const map = useMapEvents({});
    return (
      <>
        {/* Zoom controls */}
        <div className="leaflet-top leaflet-left mt-6 ml-6 space-y-2 leaflet-control">
          <Button
            size="icon"
            variant="outline"
            onClick={() => map.zoomIn()}
            className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => map.zoomOut()}
            className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Locate button */}
        <div className="leaflet-top leaflet-right mt-6 mr-6 leaflet-control">
          <Button
            size="icon"
            variant="outline"
            onClick={locateMe}
            disabled={isLocating}
            className={cn(
              'bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white',
              userLocation &&
                'bg-blue-500 text-white hover:bg-blue-600 border-blue-500',
              isLocating && 'opacity-50 cursor-not-allowed'
            )}
            title={locationError || 'Localiser ma position'}
          >
            <Locate className={cn('w-5 h-5', isLocating && 'animate-spin')} />
          </Button>
        </div>
      </>
    );
  };

  /* ----------------------------------------------------------------
   *  RENDER
   * ---------------------------------------------------------------- */
  return (
    <div className="relative h-full">
      <MapContainer
        center={CASA_CENTER}
        zoom={BASE_ZOOM}
        whenReady={() => {
          console.log('Map is ready');
        }}
        className="w-full h-full"
        zoomControl={false}
      >
        <SetMapRef mapRef={mapRef} />

        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Controls />

        {/* User location marker - this should now be visible */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            zIndexOffset={1000} // Ensure it appears above other markers
          >
            <Popup>
              <div className="text-center">
                <strong>Votre position</strong>
                <br />
                <small>
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Results markers */}
        {results.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={iconFor(r.category)}
            eventHandlers={{ click: () => onMarkerClick(r) }}
          >
            {selectedResult?.id === r.id && (
              <Popup
                offset={[0, -10]}
                closeButton={false}
                className="custom-popup"
              >
                <div className="bg-white rounded-xl shadow-lg w-80 overflow-hidden">
                  <div className="relative">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {formatPrice(r.price)}
                    </div>
                    <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span className="text-xs font-medium">{r.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {r.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <p className="text-sm">{r.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1 font-semibold">
                        Voir détails
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-blue-50"
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        ))}

        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Location info overlay */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg text-sm font-medium text-gray-700 flex items-center space-x-2">
        <MapPin className="w-4 h-4" />
        <span>
          {userLocation 
            ? `Position trouvée (${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)})` 
            : 'Casablanca, Maroc'
          }
        </span>
      </div>

      {/* Error message */}
      {locationError && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {locationError}
        </div>
      )}

      {/* Loading indicator */}
      {isLocating && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Localisation en cours...</span>
        </div>
      )}
    </div>
  );
};

// Add this helper component inside MapView.tsx
const SetMapRef: React.FC<{ mapRef: React.MutableRefObject<L.Map | null> }> = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};