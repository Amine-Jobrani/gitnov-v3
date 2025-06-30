// src/pages/RestaurantDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, Globe, Heart, MapPin, Phone, Share, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { restaurantService } from '../services/restaurant';
import { FullRestaurant } from '../services/types';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

const safeFmt = (d?: string | Date | null, fmt = 'dd MMMM yyyy') =>
  d ? format(new Date(d), fmt, { locale: fr }) : '–';

export const RestaurantDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: restaurant, isLoading, isError } = useQuery<FullRestaurant>({
    queryKey: ['restaurant', slug],
    queryFn: () => restaurantService.getBySlug(slug),
    enabled: !!slug,
  });

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const fav = restaurant ? isFavorite(restaurant.id, 'restaurant') : false;

  const [imgIdx, setImgIdx] = useState(0);

  if (isLoading) return <Spinner />;
  if (isError || !restaurant) return <ErrorMsg msg="Restaurant introuvable." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-5 h-5" /><span>Retour</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                fav
                  ? removeFromFavorites(restaurant.id, 'restaurant')
                  : addToFavorites(restaurant.id, 'restaurant')
              }
              className={`p-2 rounded-full transition-colors ${
                fav
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: restaurant.name,
                    text: restaurant.description,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Lien copié !');
                }
              }}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
            >
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={restaurant.media?.[imgIdx]?.mediaUrl ?? '/placeholder.jpg'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {restaurant.media.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {restaurant.media.map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => setImgIdx(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        imgIdx === i ? 'border-orange-500' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <img src={m.mediaUrl} alt={`${restaurant.name}-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-8 space-y-6">
                <h1 className="text-4xl font-bold">{restaurant.name}</h1>
                <p className="text-lg text-gray-700 whitespace-pre-line">{restaurant.description}</p>

                <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                  <Info icon={MapPin} label="Adresse" text={`${restaurant.address}, ${restaurant.city}`} />
                  {restaurant.phone_number && <Info icon={Phone} label="Téléphone" text={restaurant.phone_number} />}
                  {restaurant.website_url && <Info icon={Globe} label="Site web" text={restaurant.website_url} />}
                  <Info icon={Star} label="Prix moyen" text={`${restaurant.average_price} MAD`} />
                </div>

                {restaurant.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-3">Équipements</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.amenities.map(a => (
                        <span key={a} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Localisation</h3>
              <div className="h-64 bg-gray-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                <MapPin className="w-12 h-12 text-gray-400" />
                <p className="text-gray-600">Carte interactive bientôt</p>
                <p className="text-sm text-gray-500">{restaurant.address}, {restaurant.city}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-32"
            >
              <h3 className="text-xl font-bold mb-4">Informations rapides</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{restaurant.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-orange-500" />
                  <span>{restaurant.average_price} MAD</span>
                </div>
                {restaurant.phone_number && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>{restaurant.phone_number}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate(`/checkout/restaurant/${restaurant.slug}`, { state: { restaurant } })}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold shadow"
              >
                Réserver ce restaurant
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-12 w-12 border-b-2 border-orange-500 rounded-full animate-spin" />
  </div>
);

const ErrorMsg = ({ msg }: { msg: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
    <p className="text-lg text-gray-700">{msg}</p>
    <Link to="/restaurants" className="text-orange-600 hover:text-orange-500 underline">
      Retour à la liste
    </Link>
  </div>
);

function Info({
  icon: Icon,
  label,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-orange-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold">{text}</p>
      </div>
    </div>
  );
}
