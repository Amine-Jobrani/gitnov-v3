import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, Star, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { mockEvents, mockRestaurants } from '../data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'restaurants'>('all');

  const favoriteEvents = favorites
    .filter(fav => fav.type === 'event')
    .map(fav => mockEvents.find(event => event.id === fav.id))
    .filter(Boolean);

  const favoriteRestaurants = favorites
    .filter(fav => fav.type === 'restaurant')
    .map(fav => mockRestaurants.find(restaurant => restaurant.id === fav.id))
    .filter(Boolean);

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'events':
        return { events: favoriteEvents, restaurants: [] };
      case 'restaurants':
        return { events: [], restaurants: favoriteRestaurants };
      default:
        return { events: favoriteEvents, restaurants: favoriteRestaurants };
    }
  };

  const { events, restaurants } = getFilteredItems();
  const totalItems = events.length + restaurants.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mes Favoris</h1>
          <p className="text-xl text-gray-600">
            Retrouvez tous vos événements et restaurants préférés
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'Tous', count: favoriteEvents.length + favoriteRestaurants.length },
              { id: 'events', label: 'Événements', count: favoriteEvents.length },
              { id: 'restaurants', label: 'Restaurants', count: favoriteRestaurants.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {totalItems > 0 ? (
          <div className="space-y-8">
            {/* Events Section */}
            {events.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Événements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      onRemoveFavorite={() => removeFromFavorites(event.id, 'event')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants Section */}
            {restaurants.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      index={index}
                      onRemoveFavorite={() => removeFromFavorites(restaurant.id, 'restaurant')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun favori trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'events' 
                ? 'Vous n\'avez encore ajouté aucun événement à vos favoris'
                : activeTab === 'restaurants'
                ? 'Vous n\'avez encore ajouté aucun restaurant à vos favoris'
                : 'Commencez à explorer et ajoutez vos événements et restaurants préférés'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Découvrir les événements
              </Link>
              <Link
                to="/restaurants"
                className="px-6 py-3 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Explorer les restaurants
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard: React.FC<{ 
  event: any; 
  index: number; 
  onRemoveFavorite: () => void;
}> = ({ event, index, onRemoveFavorite }) => {
  const nextPlanning = event.planifications[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.media[0]?.mediaUrl}
          alt={event.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
            {event.category}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          {event.averageRating && (
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">{event.averageRating}</span>
              </div>
            </div>
          )}
          <button
            onClick={onRemoveFavorite}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.titre}
        </h3>

        {nextPlanning && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(nextPlanning.dateDebut), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {format(new Date(nextPlanning.dateDebut), 'HH:mm', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.address}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {nextPlanning && (
            <span className="text-2xl font-bold text-orange-600">
              {nextPlanning.price} MAD
            </span>
          )}
          <Link
            to={`/events/${event.slug}`}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const RestaurantCard: React.FC<{ 
  restaurant: any; 
  index: number; 
  onRemoveFavorite: () => void;
}> = ({ restaurant, index, onRemoveFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.media[0]?.mediaUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {restaurant.priceRange}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          {restaurant.averageRating && (
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">{restaurant.averageRating}</span>
              </div>
            </div>
          )}
          <button
            onClick={onRemoveFavorite}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {restaurant.name}
        </h3>
        
        <p className="text-orange-600 font-medium text-sm mb-2">
          {restaurant.cuisineType}
        </p>

        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-600">
              {restaurant.averagePrice} MAD
            </span>
            <span className="text-gray-600 text-sm">moy.</span>
          </div>
          <Link
            to={`/restaurants/${restaurant.slug}`}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Réserver
          </Link>
        </div>
      </div>
    </motion.div>
  );
};