// src\pages\HomePage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Star, TrendingUp, Users, Clock, ArrowRight, Music, Utensils, Camera, Moon, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import MapContentList from '../components/map/MapContentList';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);

  // build the destination URL & navigate
  const handleExplore = (cat: typeof categories[0]) => {
    let url = cat.route;
    if (cat.filterParam) {
      url += `?category=${encodeURIComponent(cat.filterParam)}`;
    }
    navigate(url);
  };

  const categories = [
    {
      title: 'Événements Culturels',
      description: 'Concerts, expositions, spectacles',
      icon: Music,
      color: 'from-purple-500 to-pink-500',
      bgImage: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      stats: '120+ événements',
      highlights: ['Concerts live', 'Expositions d\'art', 'Théâtre', 'Festivals'],
      route: '/events',
      filterParam: 'culturel'

    },
    {
      title: 'Restaurants Gastronomiques', 
      description: 'Cuisine marocaine et internationale',
      icon: Utensils,
      color: 'from-orange-500 to-red-500',
      bgImage: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
      stats: '200+ restaurants',
      highlights: ['Cuisine marocaine', 'Gastronomie internationale', 'Rooftops', 'Brunchs'],
      route: '/restaurants',
      filterParam: 'marocaine'

    },
    {
      title: 'Activités Familiales',
      description: 'Sorties et loisirs en famille',
      icon: Camera,
      color: 'from-green-500 to-blue-500',
      bgImage: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=800',
      stats: '80+ activités',
      highlights: ['Parcs d\'attractions', 'Musées interactifs', 'Plages', 'Ateliers créatifs'],
      route: '/events',
      filterParam: 'famille'
    },
    {
      title: 'Vie Nocturne',
      description: 'Bars, clubs et soirées',
      icon: Moon,
      color: 'from-indigo-500 to-purple-500',
      bgImage: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
      stats: '60+ lieux',
      highlights: ['Bars à cocktails', 'Clubs branchés', 'Lounges', 'Soirées thématiques'],
      route: '/restaurants',
      filterParam: 'bar'
    }
  ];
  
  const featuredEvents = [
    {
      id: 1,
      title: 'Festival de Jazz de Casablanca',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '15 Mars 2025',
      location: 'Mohammed V Theatre',
      rating: 4.8,
      price: '150 MAD'
    },
    {
      id: 2,
      title: 'Exposition d\'Art Contemporain',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '20 Mars 2025',
      location: 'Villa des Arts',
      rating: 4.6,
      price: '50 MAD'
    },
    {
      id: 3,
      title: 'Soirée Traditionnelle Marocaine',
      image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '25 Mars 2025',
      location: 'Riad El Ferdous',
      rating: 4.9,
      price: '200 MAD'
    }
  ];

  const featuredRestaurants = [
    {
      id: 1,
      name: 'La Sqala',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600',
      cuisine: 'Cuisine Marocaine Traditionnelle',
      rating: 4.7,
      priceRange: '200-400 MAD',
      location: 'Boulevard Mohammed V'
    },
    {
      id: 2,
      name: 'Le Cabestan',
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600',
      cuisine: 'Fruits de Mer & Poissons',
      rating: 4.8,
      priceRange: '300-600 MAD',
      location: 'Corniche Ain Diab'
    },
    {
      id: 3,
      name: 'Riad Tazi',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600',
      cuisine: 'Cuisine Fusion Moderne',
      rating: 4.6,
      priceRange: '250-500 MAD',
      location: 'Quartier des Habous'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Découvrez
              <span className="block bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Casablanca
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Événements culturels, restaurants d'exception et expériences uniques 
              dans la ville blanche
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/events"
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Explorer les Événements</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/restaurants"
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Découvrir les Restaurants
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bouton flottant bas-centre */}
      <Link
        to="/explore"
        className="fixed bottom-6 left-1/2 -translate-x-1/2              /* position */
          px-6 py-3 bg-black text-white rounded-full font-semibold /* style */
          shadow-lg hover:bg-gray-900 transition-all duration-200
          flex items-center space-x-2 z-50"                       /* au-dessus de tout */
      >
        <span>Afficher la carte</span>
        <MapIcon className="w-5 h-5" />
      </Link>

      {/* Map Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explorez la Carte Interactive
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les lieux incontournables de Casablanca directement sur notre carte interactive
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[500px] bg-white rounded-2xl p-4 shadow-lg"
          >
            <MapContentList />
          </motion.div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Cliquez sur les marqueurs pour découvrir plus d'informations
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                <span className="text-gray-600">Événements & Restaurants</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Notes des utilisateurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Que Souhaitez-Vous Découvrir ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plongez dans l'univers vibrant de Casablanca à travers nos catégories exclusives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Category Navigation */}
            <div className="space-y-4">
              {categories.map((category, index) => {
                const CategoryIcon = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`group cursor-pointer transition-all duration-300 ${
                      activeCategory === index ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => setActiveCategory(index)}
                  >
                    <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 ${
                      activeCategory === index 
                        ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-2xl' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          activeCategory === index 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-white shadow-md'
                        }`}>
                          <CategoryIcon className={`w-6 h-6 transition-colors duration-300 ${
                            activeCategory === index ? 'text-white' : 'text-gray-700'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">
                            {category.title}
                          </h3>
                          <p className={`text-sm transition-colors duration-300 ${
                            activeCategory === index ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {category.description}
                          </p>
                        </div>
                        <div className={`text-right transition-colors duration-300 ${
                          activeCategory === index ? 'text-white/90' : 'text-gray-500'
                        }`}>
                          <div className="text-sm font-semibold">{category.stats}</div>
                          <ArrowRight className={`w-4 h-4 ml-auto mt-1 transition-transform duration-300 ${
                            activeCategory === index ? 'translate-x-1' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Category Preview */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={categories[activeCategory].bgImage}
                  alt={categories[activeCategory].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {(() => {
                    const ActiveCategoryIcon = categories[activeCategory].icon;
                    return (
                      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${categories[activeCategory].color} mb-4`}>
                        <ActiveCategoryIcon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{categories[activeCategory].stats}</span>
                      </div>
                    );
                  })()}
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {categories[activeCategory].title}
                  </h3>
                  <p className="text-gray-200 mb-4">
                    {categories[activeCategory].description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {categories[activeCategory].highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                    <button
                      onClick={() => handleExplore(categories[activeCategory])}
                      className="mt-6 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                    >
                    <span>Explorer cette catégorie</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Événements À La Une
            </h2>
            <p className="text-xl text-gray-600">
              Ne manquez pas ces événements exceptionnels
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{event.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      {event.price}
                    </span>
                    <Link
                      to={`/events/${event.id}`}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              <span>Voir Tous les Événements</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Restaurants Recommandés
            </h2>
            <p className="text-xl text-gray-600">
              Savourez les meilleures tables de Casablanca
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-orange-600">
                      {restaurant.priceRange}
                    </span>
                    <Link
                      to={`/restaurants/${restaurant.id}`}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/restaurants"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              <span>Voir Tous les Restaurants</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                Prêt à Explorer Casablanca ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez des milliers d'utilisateurs qui découvrent les meilleurs 
                événements et restaurants de la ville
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-orange-600 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>Créer Mon Compte Gratuit</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};
