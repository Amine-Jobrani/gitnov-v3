import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Calendar, Users, Plus, Edit, Trash2, Eye, Star, TrendingUp, Clock, MapPin, Settings, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous devez être un organisateur d'événements pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'events', label: 'Mes Événements', icon: Calendar },
    { id: 'bookings', label: 'Réservations', icon: Users },
  ];

  const stats = [
    {
      title: 'Événements actifs',
      value: '8',
      change: '+3 ce mois',
      color: 'bg-blue-500',
      icon: Calendar,
    },
    {
      title: 'Billets vendus',
      value: '1,247',
      change: '+28% ce mois',
      color: 'bg-green-500',
      icon: Users,
    },
    {
      title: 'Revenus ce mois',
      value: '89,450 MAD',
      change: '+35% vs mois dernier',
      color: 'bg-purple-500',
      icon: DollarSign,
    },
  ];

  const mockEvents = [
    {
      id: 1,
      title: 'Festival de Jazz de Casablanca',
      category: 'Culturel',
      date: '2025-03-15T20:00:00Z',
      venue: 'Mohammed V Theatre',
      status: 'Publié',
      ticketsSold: 234,
      totalCapacity: 500,
      revenue: '35,100 MAD',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 150
    },
    {
      id: 2,
      title: 'Exposition d\'Art Contemporain',
      category: 'Culturel',
      date: '2025-03-20T18:00:00Z',
      venue: 'Villa des Arts',
      status: 'Brouillon',
      ticketsSold: 0,
      totalCapacity: 200,
      revenue: '0 MAD',
      rating: null,
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 50
    },
    {
      id: 3,
      title: 'Soirée Traditionnelle Marocaine',
      category: 'Culturel',
      date: '2025-03-25T19:30:00Z',
      venue: 'Riad El Ferdous',
      status: 'Publié',
      ticketsSold: 89,
      totalCapacity: 150,
      revenue: '17,800 MAD',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 200
    },
    {
      id: 4,
      title: 'Concert de Musique Gnawa',
      category: 'Culturel',
      date: '2025-04-05T21:00:00Z',
      venue: 'Théâtre National',
      status: 'En révision',
      ticketsSold: 0,
      totalCapacity: 300,
      revenue: '0 MAD',
      rating: null,
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 120
    }
  ];

  const recentBookings = [
    {
      id: 1,
      customerName: 'Ahmed Benali',
      event: 'Festival de Jazz de Casablanca',
      tickets: 2,
      totalAmount: '300 MAD',
      bookingDate: '2025-03-10T14:30:00Z',
      status: 'Confirmée'
    },
    {
      id: 2,
      customerName: 'Fatima El Mansouri',
      event: 'Soirée Traditionnelle Marocaine',
      tickets: 4,
      totalAmount: '800 MAD',
      bookingDate: '2025-03-11T09:15:00Z',
      status: 'Confirmée'
    },
    {
      id: 3,
      customerName: 'Youssef Alaoui',
      event: 'Festival de Jazz de Casablanca',
      tickets: 1,
      totalAmount: '150 MAD',
      bookingDate: '2025-03-11T16:45:00Z',
      status: 'En attente'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Organisateur d'Événements
          </h1>
          <p className="text-xl text-gray-600">
            Bienvenue, {user.fullName} - Gérez vos événements et réservations
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

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Événements à Venir</h2>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {mockEvents.filter(e => e.status === 'Publié').length} événements actifs
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockEvents.filter(event => event.status === 'Publié').slice(0, 4).map((event, index) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.date), 'dd MMM yyyy', { locale: fr })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">{event.ticketsSold}/{event.totalCapacity}</div>
                      <div className="text-sm text-gray-500">billets</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Réservations Récentes</h2>
              <div className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">{booking.event}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(booking.bookingDate), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{booking.totalAmount}</div>
                      <div className="text-sm text-gray-600">{booking.tickets} billet{booking.tickets > 1 ? 's' : ''}</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'Confirmée'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Événements</h2>
              <Link
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                to="/dashboard-organizer/events/new"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvel Événement</span>
              </Link>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mockEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === 'Publié'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'Brouillon'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    {event.rating && (
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        <span className="text-xs font-medium">{event.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{event.price} MAD</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{event.ticketsSold}</div>
                        <div className="text-sm text-blue-600">Billets vendus</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{event.revenue}</div>
                        <div className="text-sm text-green-600">Revenus</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Capacité</span>
                        <span>{event.ticketsSold}/{event.totalCapacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(event.ticketsSold / event.totalCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Voir</span>
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les Réservations</h2>
              
              {/* Bookings Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Événement</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date de réservation</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Billets</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Montant</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{booking.customerName}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{booking.event}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {format(new Date(booking.bookingDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{booking.tickets}</td>
                        <td className="px-6 py-4 text-gray-600 font-semibold">{booking.totalAmount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'Confirmée'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
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

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analyses et Statistiques</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart Placeholder */}
                <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Évolution des revenus</p>
                    <p className="text-sm text-gray-500">Par événement et par mois</p>
                  </div>
                </div>

                {/* Ticket Sales Chart Placeholder */}
                <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Ventes de billets</p>
                    <p className="text-sm text-gray-500">Performance par événement</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
                  <div className="text-blue-600 font-medium">Taux de remplissage</div>
                  <div className="text-sm text-blue-500">+12% vs mois dernier</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
                  <div className="text-green-600 font-medium">Note moyenne</div>
                  <div className="text-sm text-green-500">+0.3 vs mois dernier</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
                  <div className="text-purple-600 font-medium">Temps de vente moyen</div>
                  <div className="text-sm text-purple-500">-6h vs mois dernier</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
                  <div className="text-orange-600 font-medium">Billets/événement</div>
                  <div className="text-sm text-orange-500">+23 vs mois dernier</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres du Compte</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                      <input
                        type="text"
                        defaultValue={user.fullName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres d'Événements</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commission par défaut (%)</label>
                      <input
                        type="number"
                        defaultValue="10"
                        min="0"
                        max="30"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Délai d'annulation (heures)</label>
                      <input
                        type="number"
                        defaultValue="24"
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="ml-2 text-gray-700">Nouvelles réservations</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="ml-2 text-gray-700">Annulations de billets</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="ml-2 text-gray-700">Nouveaux avis</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="ml-2 text-gray-700">Rappels d'événements</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    Sauvegarder les modifications
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};