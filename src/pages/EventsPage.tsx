import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Search, Filter, Calendar, MapPin, Star, Users, Heart, Tag, ArrowRight,
} from 'lucide-react';

import { eventService } from '../services/events';
import { FullEvent, Planner } from '../services/types';

const safeFormat = (date: string | null | undefined, formatStr: string) =>
  date && isValid(parseISO(date)) ? format(parseISO(date), formatStr, { locale: fr }) : '';

const CATEGORIES = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'culturel', label: 'Culturel' },
  { value: 'sport', label: 'Sport' },
  { value: 'formation', label: 'Formation' },
  { value: 'famille', label: 'Famille' },
  { value: 'nocturne', label: 'Vie nocturne' },
];

interface FilterOptions {
  category?: string;
  date?: string;
  location?: string;
  rating?: number;
}

export const EventsPage: React.FC = () => {
  const location = useLocation();
  const [events, setEvents] = useState<FullEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: new URLSearchParams(location.search).get('category') || undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchTerm ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || event.category === filters.category;
      const matchesRating = !filters.rating || (event.averageRating ?? 0) >= filters.rating;
      const matchesLocation = !filters.location ||
        (event.address?.toLowerCase().includes(filters.location.toLowerCase()));

      let matchesDate = true;
      if (filters.date) {
        const wanted = new Date(filters.date).toDateString();
        const eventDate = event.planifications?.[0]?.startDate;
        matchesDate = eventDate && new Date(eventDate).toDateString() === wanted;
      }
      
      return matchesSearch && matchesCategory && matchesRating && matchesDate && matchesLocation;
    });
  }, [events, searchTerm, filters]);

  if (error) {
    return <div className="text-center text-red-600">Erreur: {error.message}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100">
      <motion.h1
        className="text-5xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Événements à Casablanca
      </motion.h1>
      <motion.p
        className="text-center text-lg text-gray-600 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Explorez une variété d'événements culturels, sportifs et plus encore
      </motion.p>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={filters.category ?? ''}
          onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
          className="md:w-64 py-3 px-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500"
        >
          {CATEGORIES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow hover:from-orange-600 hover:to-red-600"
        >
          <Filter className="inline w-5 h-5 mr-2" /> Filtres
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Field label="Date">
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-xl"
              value={filters.date ?? ''}
              onChange={(e) => setFilters(f => ({ ...f, date: e.target.value || undefined }))}
            />
          </Field>

          <Field label="Lieu">
            <input
              type="text"
              placeholder="Adresse, quartier..."
              className="w-full px-4 py-2 border rounded-xl"
              value={filters.location ?? ''}
              onChange={(e) => setFilters(f => ({ ...f, location: e.target.value || undefined }))}
            />
          </Field>

          <Field label="Note minimum">
            <select
              className="w-full px-4 py-2 border rounded-xl"
              value={filters.rating ?? ''}
              onChange={(e) => setFilters(f => ({ ...f, rating: e.target.value ? Number(e.target.value) : undefined }))}
            >
              <option value="">Toutes les notes</option>
              <option value="4">4+ étoiles</option>
              <option value="4.5">4.5+ étoiles</option>
            </select>
          </Field>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Aucun événement trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const EventCard: React.FC<{ event: FullEvent; index: number }> = ({ event, index }) => {
  const next = event.planifications?.[0];
  const [liked, setLiked] = useState(event.isFavorite || false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
    >
      <Link to={`/events/${event.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={event.media?.[0]?.url ?? '/placeholder.jpg'}
            alt={event.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {event.category}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 bg-white/80 p-2 rounded-full"
          >
            <Heart className={`w-4 h-4 ${liked ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{event.title}</h3>
          <span className="block text-base font-semibold text-orange-600">
            {next?.price === 0 ? 'Gratuit' : `${Number(next?.price ?? 0).toFixed(2)} MAD`}
          </span>
          <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>

          {next && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{safeFormat(next.startDate, 'dd MMM yyyy')} • {safeFormat(next.startDate, 'HH:mm')}</span>
              <Users className="w-4 h-4 ml-auto" /> <span>{next.availableSeats} places</span>
            </div>
          )}

          {event.address && (
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.address}, {event.city}</span>
            </div>
          )}

          {event.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {event.tags.split(',').slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full inline-flex items-center">
                  <Tag className="w-3 h-3 mr-1" /> {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
