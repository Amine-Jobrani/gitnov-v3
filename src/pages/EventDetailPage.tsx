import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Share,
  Star,
  Tag,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';

import { eventService } from '../services/events';
import { useFavorites } from '../hooks/useFavorites';
import { FullEvent } from '../services/types';
import MapContent from '../components/map/MapContent';

const safeFmt = (d?: string | Date | null, fmt = 'dd MMMM yyyy') =>
  d ? format(new Date(d), fmt, { locale: fr }) : '–';

const toTags = (raw?: string | string[] | null) =>
  Array.isArray(raw) ? raw : (raw ?? '').split(',').filter(Boolean);

const pickPlanning = (ev: FullEvent) => {
  const p = ev.planifications?.[0];
  if (!p) return null;
  return {
    start: p.startDate,
    end: p.endDate,
    price: p.price,
    ticket: 'standard',
    seats: p.availableSeats,
    id: p.id,
  };
};

export const EventDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const eventFromState = (location.state as { event?: FullEvent })?.event;

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [imgIdx, setImgIdx] = useState(0);

  const { data: event, isLoading, error } = useQuery({
    enabled: !eventFromState && !!slug,
    queryKey: ['event', slug],
    queryFn: async () => {
      return await eventService.getEventBySlug(slug);
    },
    initialData: eventFromState,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-b-2 border-orange-500 rounded-full animate-spin" />
      </div>
    );

  if (error || !event)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-lg text-gray-700">Événement introuvable.</p>
        <button
          onClick={() => navigate('/events')}
          className="text-orange-600 hover:text-orange-500 underline"
        >
          Retour aux événements
        </button>
      </div>
    );

  const planning = pickPlanning(event);
  const fav = isFavorite(event.id, 'event');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-white pb-16">
      <header className="sticky top-16 z-40 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fav ? removeFromFavorites(event.id, 'event') : addToFavorites(event.id, 'event')}
              className={`p-2 rounded-full transition-colors ${fav ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'}`}
            >
              <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: event.title,
                      text: event.description,
                      url: window.location.href,
                    });
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Lien copié !');
                  }
                } catch {}
              }}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
            >
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src={event.media?.[imgIdx]?.url ?? '/placeholder.jpg'}
                alt={event.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {event.category}
              </div>
              {event.averageRating && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow-md flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-800 text-sm">
                    {event.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {event.title}
              </h1>
              <p className="text-lg text-gray-700 whitespace-pre-line">
                {event.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {toTags(event.tags).map((tag) => (
                  <span key={tag} className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    <Tag className="w-3 h-3" />
                    <span>{tag.trim()}</span>
                  </span>
                ))}
              </div>
              {planning && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Info icon={Calendar} label="Date" text={safeFmt(planning.start, 'EEEE dd MMMM yyyy')} />
                  <Info icon={Clock} label="Heure" text={`${safeFmt(planning.start, 'HH:mm')} – ${safeFmt(planning.end, 'HH:mm')}`} />
                  <Info icon={MapPin} label="Lieu" text={`${event.address ?? ''}
${event.city ?? ''}`} />
                  <Info icon={Users} label="Capacité" text={`${planning.seats ?? 'Non spécifié'}`} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Localisation</h2>
              <div className="h-64 rounded-xl overflow-hidden">
                <MapContent
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                  address={`${event.address ?? ''}, ${event.city ?? ''}`}
                  cover={event.media?.[0]?.url}
                  price={planning?.price}
                  rating={event.averageRating}
                  date={planning?.start}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg p-6 sticky top-28"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-orange-600">
                  {planning?.price} MAD
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  par billet
                </div>
              </div>
              <button
                onClick={() => navigate(`/reserve/event/${event.slug}`, { state: { event } })}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-md"
              >
                Réserver Maintenant
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Confirmation instantanée • Annulation gratuite
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon: Icon, label, text }: { icon: React.ComponentType<{ className?: string }>; label: string; text?: string | null }) =>
  text ? (
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-orange-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold whitespace-pre-line">{text}</p>
      </div>
    </div>
  ) : null;
