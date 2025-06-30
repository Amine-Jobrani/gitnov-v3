import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin, Star, Clock, Phone, Grid, Map } from 'lucide-react';
import { motion } from 'framer-motion';

import { restaurantService } from '../services/restaurant';
import { FullRestaurant } from '../services/types';
import MapContentList from '../components/map/MapContentList';

interface FilterOptions {
  cuisineType?: string;
  priceRange?: string;
  rating?: number;
}

export const RestaurantsPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCuisine = params.get('category') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({ cuisineType: initialCuisine || undefined });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const { data: restaurants = [], isLoading, isError } = useQuery<FullRestaurant[]>({
    queryKey: ['restaurants'],
    queryFn: async () => await restaurantService.list(),
  });

  const filtered = useMemo(() => {
    return restaurants.filter((r: FullRestaurant) => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.cuisine_type ?? '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCuisine = !filters.cuisineType ||
        (r.cuisine_type ?? '').toLowerCase().includes(filters.cuisineType.toLowerCase());

      return matchesSearch && matchesCuisine;
    });
  }, [restaurants, searchTerm, filters]);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMsg msg="Impossible de charger les restaurants." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <SearchAndFilters {...{ searchTerm, setSearchTerm, filters, setFilters, showFilters, setShowFilters }} />

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Carte</span>
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((r: FullRestaurant, i: number) => <RestaurantCard key={r.id} restaurant={r} index={i} />)}
            </div>
            {filtered.length === 0 && <NoResults />}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-[600px]">
              <MapContentList />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-12 w-12 border-b-2 border-orange-500 rounded-full animate-spin" />
  </div>
);

const ErrorMsg = ({ msg }: { msg: string }) => (
  <div className="p-8 text-center text-red-600">{msg}</div>
);

const Header = () => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurants à Casablanca</h1>
    <p className="text-xl text-gray-600 max-w-2xl">
      Découvrez les meilleures tables de la ville blanche, de la cuisine traditionnelle aux saveurs internationales
    </p>
  </div>
);

const SearchAndFilters: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}> = ({ searchTerm, setSearchTerm, filters, setFilters, showFilters, setShowFilters }) => (
  <div className="mb-8 space-y-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Rechercher un restaurant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500"
      />
    </div>

    <div className="flex items-center justify-between">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-orange-600"
      >
        <Filter className="w-4 h-4" />
        <span>Filtres</span>
      </button>
    </div>

    {showFilters && (
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de cuisine</label>
          <select
            value={filters.cuisineType || ''}
            onChange={(e) => setFilters({ ...filters, cuisineType: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Tous les types</option>
            <option value="marocaine">Marocaine</option>
            <option value="internationale">Internationale</option>
            <option value="italienne">Italienne</option>
            <option value="française">Française</option>
            <option value="japonaise">Japonaise</option>
            <option value="chinoise">Chinoise</option>
          </select>
        </div>
      </div>
    )}
  </div>
);

const NoResults = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun restaurant trouvé</h3>
    <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
  </div>
);

const RestaurantCard: React.FC<{ restaurant: FullRestaurant; index: number }> = ({ restaurant, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <Link to={`/restaurants/${restaurant.slug}`} state={{ restaurant }}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.media?.[0]?.mediaUrl ?? '/placeholder.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {restaurant.cuisine_type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
        <p className="text-orange-600 text-sm mb-2">{restaurant.cuisine_type}</p>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>

        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.address}, {restaurant.city}</span>
          </div>
          {restaurant.phone_number && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phone_number}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Ouvert aujourd'hui</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link to={`/restaurants/${restaurant.slug}`} className="text-orange-500 font-medium hover:underline">
            Détails
          </Link>
        </div>
      </div>
    </Link>
  </motion.div>
);
