import React, { useState } from 'react';
import { BarChart3, Calendar, Users, MapPin, Plus, Edit, Trash2, Eye, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || !['organizer', 'partner', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const isOrganizer = user.role === 'organizer';
  const isPartner = user.role === 'partner';

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { 
      id: 'content', 
      label: isOrganizer ? 'Mes Événements' : 'Mes Restaurants', 
      icon: isOrganizer ? Calendar : MapPin 
    },
    { id: 'bookings', label: 'Réservations', icon: Users },
  ];

  const stats = [
    {
      title: isOrganizer ? 'Événements actifs' : 'Restaurants',
      value: isOrganizer ? '12' : '3',
      change: '+2 ce mois',
      color: 'bg-blue-500',
      icon: isOrganizer ? Calendar : MapPin,
    },
    {
      title: 'Réservations totales',
      value: '1,234',
      change: '+15% ce mois',
      color: 'bg-green-500',
      icon: Users,
    },
    {
      title: 'Note moyenne',
      value: '4.8',
      change: '+0.2 ce mois',
      color: 'bg-yellow-500',
      icon: Star,
    },
    {
      title: 'Revenus',
      value: '45,678 MAD',
      change: '+23% ce mois',
      color: 'bg-purple-500',
      icon: TrendingUp,
    },
  ];

  const mockEvents = [
    {
      id: 1,
      title: 'Festival de Jazz',
      date: '2025-03-15',
      status: 'Publié',
      bookings: 234,
      revenue: '35,100 MAD'
    },
    {
      id: 2,
      title: 'Exposition d\'Art',
      date: '2025-03-20',
      status: 'Brouillon',
      bookings: 0,
      revenue: '0 MAD'
    },
  ];

  const mockRestaurants = [
    {
      id: 1,
      name: 'La Sqala',
      status: 'Actif',
      bookings: 156,
      rating: 4.7,
      revenue: '23,450 MAD'
    },
    {
      id: 2,
      name: 'Le Cabestan',
      status: 'Actif',
      bookings: 89,
      rating: 4.8,
      revenue: '18,900 MAD'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard {isOrganizer ? 'organizer' : 'partner'}
          </h1>
          <p className="text-xl text-gray-600">
            Bienvenue, {user.fullName}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité Récente</h2>
              <div className="space-y-4">
                {[
                  { action: 'Nouvelle réservation', item: 'Festival de Jazz', time: 'Il y a 2h' },
                  { action: 'Avis client', item: 'La Sqala', time: 'Il y a 4h' },
                  { action: 'Paiement reçu', item: 'Exposition d\'Art', time: 'Il y a 6h' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-gray-600">{activity.item}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isOrganizer ? 'Mes Événements' : 'Mes Restaurants'}
              </h2>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                <Plus className="w-5 h-5" />
                <span>{isOrganizer ? 'Nouvel Événement' : 'Nouveau Restaurant'}</span>
              </button>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {isOrganizer ? 'Événement' : 'Restaurant'}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {isOrganizer ? 'Date' : 'Note'}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Réservations</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenus</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(isOrganizer ? mockEvents : mockRestaurants).map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {isOrganizer ? item.title : item.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {isOrganizer ? item.date : (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === 'Publié' || item.status === 'Actif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{item.bookings}</td>
                        <td className="px-6 py-4 text-gray-600">{item.revenue}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Réservations Récentes</h2>
            <div className="space-y-4">
              {[
                { customer: 'Ahmed Benali', item: 'Festival de Jazz', date: '2025-03-15', status: 'Confirmée' },
                { customer: 'Fatima El Mansouri', item: 'La Sqala', date: '2025-03-20', status: 'En attente' },
                { customer: 'Youssef Alaoui', item: 'Le Cabestan', date: '2025-03-25', status: 'Confirmée' },
              ].map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.customer}</p>
                    <p className="text-gray-600">{booking.item} - {booking.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'Confirmée'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};