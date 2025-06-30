import React, { useState } from 'react';
import { BarChart3, MapPin, Users, Plus, Edit, Trash2, Eye, Star, TrendingUp, Clock, Calendar, Phone, Mail, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'partner') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous devez être un partenaire restaurant pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'restaurants', label: 'Mes Restaurants', icon: MapPin },
    { id: 'reservations', label: 'Réservations', icon: Users },
  ];

  const stats = [
    {
      title: 'Restaurants actifs',
      value: '3',
      change: '+1 ce mois',
      color: 'bg-blue-500',
      icon: MapPin,
    },
    {
      title: 'Réservations aujourd\'hui',
      value: '24',
      change: '+8 vs hier',
      color: 'bg-green-500',
      icon: Users,
    },
    {
      title: 'Revenus ce mois',
      value: '67,890 MAD',
      change: '+18% vs mois dernier',
      color: 'bg-purple-500',
      icon: TrendingUp,
    },
  ];

  const mockRestaurants = [
    {
      id: 1,
      name: 'La Sqala',
      cuisine: 'Cuisine Marocaine Traditionnelle',
      address: 'Boulevard Mohammed V, Medina',
      status: 'Actif',
      rating: 4.7,
      totalReviews: 234,
      todayReservations: 12,
      monthlyRevenue: '28,450 MAD',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      phone: '+212522264960',
      openingHours: '12:00 - 23:00'
    },
    {
      id: 2,
      name: 'Le Cabestan',
      cuisine: 'Fruits de Mer & Poissons',
      address: 'Corniche Ain Diab',
      status: 'Actif',
      rating: 4.8,
      totalReviews: 189,
      todayReservations: 8,
      monthlyRevenue: '23,900 MAD',
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
      phone: '+212522391890',
      openingHours: '19:00 - 01:00'
    },
    {
      id: 3,
      name: 'Riad Tazi',
      cuisine: 'Cuisine Fusion Moderne',
      address: 'Quartier des Habous',
      status: 'En révision',
      rating: 4.6,
      totalReviews: 156,
      todayReservations: 4,
      monthlyRevenue: '15,540 MAD',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      phone: '+212522445678',
      openingHours: '18:00 - 00:00'
    }
  ];

  const todayReservations = [
    {
      id: 1,
      customerName: 'Ahmed Benali',
      restaurant: 'La Sqala',
      time: '19:30',
      guests: 4,
      status: 'Confirmée',
      phone: '+212661234567',
      specialRequests: 'Table près de la fenêtre'
    },
    {
      id: 2,
      customerName: 'Fatima El Mansouri',
      restaurant: 'Le Cabestan',
      time: '20:00',
      guests: 2,
      status: 'En attente',
      phone: '+212662345678',
      specialRequests: 'Anniversaire - dessert spécial'
    },
    {
      id: 3,
      customerName: 'Youssef Alaoui',
      restaurant: 'La Sqala',
      time: '21:00',
      guests: 6,
      status: 'Confirmée',
      phone: '+212663456789',
      specialRequests: 'Menu végétarien'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Partenaire Restaurant
          </h1>
          <p className="text-xl text-gray-600">
            Bienvenue, {user.fullName} - Gérez vos restaurants et réservations
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </motion.div>
              ))}
            </div>

            {/* Today's Reservations */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Réservations d'Aujourd'hui</h2>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {todayReservations.length} réservations
                </span>
              </div>
              <div className="space-y-4">
                {todayReservations.map((reservation, index) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-900">{reservation.customerName}</p>
                          <p className="text-sm text-gray-600">{reservation.restaurant}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{reservation.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{reservation.guests} personnes</span>
                          </div>
                        </div>
                      </div>
                      {reservation.specialRequests && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          Note: {reservation.specialRequests}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reservation.status === 'Confirmée'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'restaurants' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Restaurants</h2>
              <Link
                to="/dashboard-partner/restaurants/new"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Nouveau Restaurant</span>
              </Link>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mockRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        restaurant.status === 'Actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {restaurant.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                        <p className="text-gray-600">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{restaurant.rating}</span>
                        <span className="text-sm text-gray-500">({restaurant.totalReviews})</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.openingHours}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{restaurant.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{restaurant.todayReservations}</div>
                        <div className="text-sm text-blue-600">Aujourd'hui</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{restaurant.monthlyRevenue}</div>
                        <div className="text-sm text-green-600">Ce mois</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Voir</span>
                      </button>
                      <Link
                        to={`/dashboard-partner/restaurants/edit`}  
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'reservations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les Réservations</h2>
              
              {/* Reservations Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Restaurant</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Heure</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Personnes</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {todayReservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{reservation.customerName}</div>
                            <div className="text-sm text-gray-500">{reservation.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{reservation.restaurant}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <div>Aujourd'hui</div>
                          <div className="text-sm">{reservation.time}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{reservation.guests}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            reservation.status === 'Confirmée'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};