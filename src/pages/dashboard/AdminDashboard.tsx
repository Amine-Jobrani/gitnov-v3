//-------------------------------------------------------
// src/pages/dashboard/AdminDashboard.tsx
//-------------------------------------------------------
import React, { useState, useEffect } from 'react';
import {
  BarChart3, Users, Calendar, MapPin, Settings, Shield, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, Eye, Edit, Trash2, Search, Filter,
  Plus, Download, Mail, Phone, Star, DollarSign, Clock, UserCheck, UserX,
  FileText, Building, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';

import { useEvents } from '../../hooks/useEvents';
import { useRestaurants } from '../../hooks/useRestaurant';

import type { Event, Restaurant } from '../../types';

/* ------------------------------------------------------------------ */
/* Types locaux “admin”                                               */
/* ------------------------------------------------------------------ */
type EventAdmin = Event & {
  status?: 'published' | 'pending' | 'rejected';
  ticketsSold?: number;
  capacity?: number;
  revenue?: string;
  reports?: number;
  organizer?: string;
};

type RestaurantAdmin = Restaurant & {
  status?: 'active' | 'pending' | 'suspended';
  owner?: string;
  monthlyBookings?: number;
  revenue?: string;
  reports?: number;
};

type RoleRequestCard = {
  id: number;
  userName: string;
  userEmail: string;
  currentRole: 'user';
  requestedRole: 'partner' | 'organizer';
  requestDate: string;
  status: 'pending';
};

/* ------------------------------------------------------------------ */
/* Composant                                                           */
/* ------------------------------------------------------------------ */
export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] =
    useState<'overview' | 'users' | 'role-requests' | 'events' | 'restaurants' | 'analytics' | 'settings'>('overview');

  /* -------------------------------------------------- */
  /*  📡  Événements                                     */
  /* -------------------------------------------------- */
  const {
    data: rawEvents = [],
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents({});
  const events = rawEvents as EventAdmin[];

  const published = events.filter(e => e.status === 'published').length;
  const pending   = events.filter(e => e.status === 'pending').length;
  const rejected  = events.filter(e => e.status === 'rejected').length;

  /* -------------------------------------------------- */
  /*  📡  Restaurants                                   */
  /* -------------------------------------------------- */
  const {
    data: rawRestaurants = [],
    isLoading: restLoading,
    error: restError,
  } = useRestaurants();
  const restaurants = rawRestaurants as RestaurantAdmin[];

  const restActive    = restaurants.filter(r => r.status === 'active').length;
  const restPending   = restaurants.filter(r => r.status === 'pending').length;
  const restSuspended = restaurants.filter(r => r.status === 'suspended').length;

  /* -------------------------------------------------- */
  /*  📡  Demandes de rôles — plus de hook, array vide  */
  /* -------------------------------------------------- */
  const roleRequests: RoleRequestCard[] = []; // placeholder to keep the UI working

  /* -------------------------------------------------- */
  /*  React-Query / navigation                          */
  /* -------------------------------------------------- */
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  /* Mutation : supprimer un événement */
  const deleteEvent = useMutation({
    mutationFn: (id: number) => api.delete(`/events/${id}`),
    onSuccess: () => {
      toast.success('Événement supprimé');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => toast.error('Suppression impossible'),
  });

  /* Mutation : supprimer un restaurant */
  const deleteRestaurant = useMutation({
    mutationFn: (id: number) => api.delete(`/restaurants/${id}`),
    onSuccess: () => {
      toast.success('Restaurant supprimé');
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
    onError: () => toast.error('Suppression impossible'),
  });

  /* -------------------------------------------------- */
  /*  Handlers diverses                                 */
  /* -------------------------------------------------- */
  const handleViewEvent       = (slug: string) => navigate(`/events/${slug}`);
  const handleDeleteEvent     = (id: number, title: string) => confirm(`Supprimer « ${title} » ?`) && deleteEvent.mutate(id);
  const handleViewRestaurant  = (slug: string) => navigate(`/restaurants/${slug}`);
  const handleDeleteRestaurant= (id: number, name: string) => confirm(`Supprimer « ${name} » ?`) && deleteRestaurant.mutate(id);

  const handleApproveRequest = (id: number, role: 'partner' | 'organizer') => {
    console.log(`approveRequest for id ${id} as ${role}`);
  };

  const handleRejectRequest = (id: number, role: 'partner' | 'organizer') => {
    console.log(`rejectRequest for id ${id} as ${role}`);
  };

  /* -------------------------------------------------- */
  /*  Garde-fous : erreurs & chargement                 */
  /* -------------------------------------------------- */
  if (eventsError || restError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Erreur&nbsp;: {eventsError?.message || restError?.message}
        </p>
      </div>
    );
  }

  if (eventsLoading || restLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Chargement…</p>
      </div>
    );
  }


/*   if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Administrateur Requis</h1>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  } */

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'role-requests', label: 'Role requests', icon: FileText },
    { id: 'events', label: 'Événements', icon: Calendar },
    { id: 'restaurants', label: 'Restaurants', icon: MapPin },
    { id: 'analytics', label: 'Analyses', icon: TrendingUp },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const stats = [
    {
      title: 'Utilisateurs totaux',
      value: '12,847',
      change: '+8.2% ce mois',
      color: 'bg-blue-500',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Événements actifs',
      value: '342',
      change: '+15 cette semaine',
      color: 'bg-green-500',
      icon: Calendar,
      trend: 'up'
    },
    {
      title: 'Restaurants partenaires',
      value: '156',
      change: '+12 ce mois',
      color: 'bg-purple-500',
      icon: MapPin,
      trend: 'up'
    },
    {
      title: 'Revenus totaux',
      value: '2.4M MAD',
      change: '+23% ce mois',
      color: 'bg-orange-500',
      icon: DollarSign,
      trend: 'up'
    },
  ];

  const mockUsers = [
    {
      id: 1,
      name: 'Ahmed Benali',
      email: 'ahmed.benali@email.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-12-15T10:30:00Z',
      lastLogin: '2025-01-10T14:20:00Z',
      totalBookings: 12,
      totalSpent: '3,450 MAD'
    },
    {
      id: 2,
      name: 'Fatima El Mansouri',
      email: 'fatima.elmansouri@email.com',
      role: 'organizer',
      status: 'active',
      joinDate: '2024-11-20T09:15:00Z',
      lastLogin: '2025-01-10T16:45:00Z',
      totalBookings: 0,
      totalSpent: '0 MAD',
      eventsCreated: 8,
      totalRevenue: '45,600 MAD'
    },
    {
      id: 3,
      name: 'Youssef Alaoui',
      email: 'youssef.alaoui@email.com',
      role: 'partner',
      status: 'pending',
      joinDate: '2025-01-05T11:00:00Z',
      lastLogin: '2025-01-09T13:30:00Z',
      totalBookings: 0,
      totalSpent: '0 MAD',
      restaurantsOwned: 2,
      totalRevenue: '23,800 MAD'
    },
    {
      id: 4,
      name: 'Khadija Berrada',
      email: 'khadija.berrada@email.com',
      role: 'user',
      status: 'suspended',
      joinDate: '2024-10-12T14:20:00Z',
      lastLogin: '2025-01-08T10:15:00Z',
      totalBookings: 5,
      totalSpent: '1,200 MAD'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      description: 'Nouvel utilisateur inscrit',
      user: 'Amina Tazi',
      timestamp: '2025-01-10T16:30:00Z',
      status: 'info'
    },
    {
      id: 2,
      type: 'event_created',
      description: 'Nouvel événement créé',
      user: 'Hassan Berrada',
      details: 'Concert de Gnawa',
      timestamp: '2025-01-10T15:45:00Z',
      status: 'success'
    },
    {
      id: 3,
      type: 'report_received',
      description: 'Signalement reçu',
      user: 'Système',
      details: 'Restaurant Le Petit Marché',
      timestamp: '2025-01-10T14:20:00Z',
      status: 'warning'
    },
    {
      id: 4,
      type: 'payment_processed',
      description: 'Paiement traité',
      user: 'Système',
      details: '1,250 MAD - Festival Jazz',
      timestamp: '2025-01-10T13:15:00Z',
      status: 'success'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'suspended':
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'organizer':
        return 'bg-blue-100 text-blue-800';
      case 'partner':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UserCheck className="w-4 h-4" />;
      case 'event_created':
        return <Calendar className="w-4 h-4" />;
      case 'report_received':
        return <AlertTriangle className="w-4 h-4" />;
      case 'payment_processed':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Dashboard Administrateur</h1>
          </div>
          <p className="text-xl text-gray-600">
            Bienvenue, {user?.fullName} – Gérez la plateforme CasaVibes
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
                        <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {stat.change}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600">{stat.title}</p>
                    </motion.div>
                ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité Récente</h2>
                    <div className="space-y-4">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{activity.description}</p>
                            <p className="text-sm text-gray-600">Par {activity.user}</p>
                            {activity.details && (
                            <p className="text-sm text-gray-500">{activity.details}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(activity.timestamp), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
                    <div className="space-y-4">
                    <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                        <Users className="w-5 h-5" />
                        <span>Gérer les utilisateurs en attente</span>
                        <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm">3</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('role-requests')}
                        className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <FileText className="w-5 h-5" />
                        <span>Demandes de partenariat</span>
                        <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm">
                          {/* {mockRoleRequests.filter(req => req.status === 'pending').length} */}
                        </span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Examiner les signalements</span>
                        <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm">5</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all">
                        <Calendar className="w-5 h-5" />
                        <span>Approuver les événements</span>
                        <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm">8</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
                        <Download className="w-5 h-5" />
                        <span>Exporter les rapports</span>
                    </button>
                    </div>
                </div>
                </div>
            </motion.div>
        )}
  
        {activeTab === 'users' && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header with Search and Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
                      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              placeholder="Rechercher un utilisateur..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="all">Tous les statuts</option>
                            <option value="active">Actifs</option>
                            <option value="pending">En attente</option>
                            <option value="suspended">Suspendus</option>
                          </select>
                      </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="w-full">
                      <thead className="bg-gray-50">
                          <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rôle</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Inscription</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dernière connexion</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Activité</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                          {mockUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                              <div>
                                  <div className="font-semibold text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                              </td>
                              <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleColor(user.role)}`}>
                                  {user.role === 'organizer' ? 'Organisateur' : 
                                  user.role === 'partner' ? 'Partenaire' : 
                                  user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                              </span>
                              </td>
                              <td className="px-6 py-4">
                              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                                  {getStatusIcon(user.status)}
                                  <span className="capitalize">{user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Suspendu'}</span>
                              </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                              {format(new Date(user.joinDate), 'dd/MM/yyyy', { locale: fr })}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                              {format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm', { locale: fr })}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                              {user.role === 'user' ? (
                                  <div>
                                  <div>{user.totalBookings} réservations</div>
                                  <div className="text-xs text-gray-500">{user.totalSpent}</div>
                                  </div>
                              ) : user.role === 'organizer' ? (
                                  <div>
                                  <div>{user.eventsCreated} événements</div>
                                  <div className="text-xs text-gray-500">{user.totalRevenue}</div>
                                  </div>
                              ) : (
                                  <div>
                                  <div>{user.restaurantsOwned} restaurants</div>
                                  <div className="text-xs text-gray-500">{user.totalRevenue}</div>
                                  </div>
                              )}
                              </td>
                              <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                      <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                                      <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                      <Mail className="w-4 h-4" />
                                  </button>
                                  {user.status === 'active' ? (
                                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                          <UserX className="w-4 h-4" />
                                      </button>
                                  ) : (
                                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                          <UserCheck className="w-4 h-4" />
                                      </button>
                                  )}
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

        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion des Événements</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  {/* <span className="text-sm font-medium">Publiés: 342</span> */}
                  <span className="text-sm font-medium">Publiés: {published}</span>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  {/* <span className="text-sm font-medium">En attente: 23</span> */}
                  <span className="text-sm font-medium">En attente: {pending}</span>
                </div>
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Rejetés: {rejected}</span>
                  {/* <span className="text-sm font-medium">Rejetés: 8</span> */}
                </div>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Événement</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Organisateur</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ventes</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenus</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Signalements</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {eventsLoading ? (
                        /* Loader / skeleton pendant le fetch */
                        <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                            Chargement des événements…
                        </td>
                        </tr>
                    ) : events.length === 0 ? (
                        /* État vide */
                        <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                            Aucun événement trouvé
                        </td>
                        </tr>
                    ) : (
                        /* Données réelles */
                        events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                            <div>
                                <div className="font-semibold text-gray-900">{event.title}</div>
                                <div className="text-sm text-gray-500 capitalize">{event.category}</div>
                            </div>
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                            {/* {event.organizer} */} 
                            xxxxxxxxxx 
                            {/* {event.organizer?.fullName ?? event.organizerName ?? '—'} */}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                            {/* {format(new Date(event.date), 'dd/MM/yyyy HH:mm', { locale: fr })} */}
                            xxxxxxxxxx
                            </td>

                            <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                                {getStatusIcon(event.status)}
                                <span className="capitalize">
                                {event.status === 'published'
                                    ? 'Publié'
                                    : event.status === 'pending'
                                    ? 'En attente'
                                    : 'Rejeté'}
                                </span>
                            </span>
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                            <div>
                                {/* {event.ticketsSold}/{event.capacity} */}
                                12/12
                            </div>
                            <div className="text-xs text-gray-500">
                                {/* {Math.round((event.ticketsSold / event.capacity) * 100)}% */}
                                yyyyyyyyyyyyyyyyyyy
                            </div>
                            </td>

                            <td className="px-6 py-4 text-gray-600 font-semibold">
                            {event.revenue}
                            </td>

                            <td className="px-6 py-4">
                            {event.reports > 0 ? (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                                {event.reports}
                                </span>
                            ) : (
                                <span className="text-gray-400">0</span>
                            )}
                            </td>

                            <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    {/* Voir */}
                                    <button
                                      onClick={() => handleViewEvent(event.slug)}
                                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>

                                    {/* Supprimer */}
                                    <button
                                      onClick={() => handleDeleteEvent(event.id, event.title)}
                                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                            </div>
                            </td>
                        </tr>
                        ))
                    )}
                  </tbody>

                </table>
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
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion des Restaurants</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Actifs: 156</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">En attente: 12</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Suspendus: 3</span>
                  </div>
                </div>
              </div>
  
              {/* Restaurants Table */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Restaurant</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Propriétaire</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cuisine</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Note</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Réservations</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenus</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {restLoading ? (
                            <tr>
                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                Chargement des restaurants…
                            </td>
                            </tr>
                        ) : restaurants.length === 0 ? (
                            <tr>
                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                Aucun restaurant trouvé
                            </td>
                            </tr>
                        ) : (
                            restaurants.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold text-gray-900">{r.name}</td>

                                <td className="px-6 py-4 text-gray-600">{r.owner ?? '—'}</td>

                                <td className="px-6 py-4 text-gray-600">{r.cuisineType ?? r.cuisine}</td>

                                <td className="px-6 py-4">
                                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(r.status)}`}>
                                    {getStatusIcon(r.status)}
                                    <span className="capitalize">
                                    {r.status === 'active'
                                        ? 'Actif'
                                        : r.status === 'pending'
                                        ? 'En attente'
                                        : 'Suspendu'}
                                    </span>
                                </span>
                                </td>

                                <td className="px-6 py-4">
                                {r.rating ? (
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span className="font-semibold">{r.rating.toFixed(1)}</span>
                                      <span className="text-sm text-gray-500">
                                          ({r.reviewCount ?? r.totalReviews ?? 0})
                                      </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">Pas encore noté</span>
                                )}
                                </td>

                                <td className="px-6 py-4 text-gray-600">
                                  {r.monthlyBookings ?? '—'}
                                </td>

                                <td className="px-6 py-4 text-gray-600 font-semibold">
                                  {r.revenue ?? '—'}
                                </td>

                                <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    {/* Voir */}
                                    <button
                                      onClick={() => handleViewRestaurant(r.slug)}
                                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>

                                    {/* Supprimer */}
                                    <button
                                      disabled={deleteRestaurant.isLoading}
                                      onClick={() => handleDeleteRestaurant(r.id, r.name)}
                                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))
                        )}
                        </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
        )}

        {activeTab === 'role-requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* ---- En-tête + compteurs ---- */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Demandes de Partenariat / Organisation
              </h2>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    En attente&nbsp;: {roleRequests.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Approuvées&nbsp;: 0</span>
                </div>
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Rejetées&nbsp;: 0</span>
                </div>
              </div>
            </div>

            {/* ---- Grid des demandes ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {roleRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 rounded-xl ${
                            request.requestedRole === 'partner'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {request.requestedRole === 'partner' ? (
                            <Building className="w-6 h-6" />
                          ) : (
                            <Briefcase className="w-6 h-6" />
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {request.userName}
                          </h3>
                          <p className="text-sm text-gray-600">{request.userEmail}</p>
                          <p className="text-sm text-gray-500">
                            Demande de rôle&nbsp;:{' '}
                            <span className="font-medium capitalize">
                              {request.requestedRole === 'partner'
                                ? 'Partenaire'
                                : 'Organisateur'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Statut + date */}
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            request.status,
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          <span>En attente</span>
                        </span>
                        <p className="text-xs text-gray-500">
                          {format(new Date(request.requestDate), 'dd MMM yyyy', {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ---- Détails minimalistes (ajoute les tiens si dispo) ---- */}
                  <div className="p-6 space-y-2 text-sm text-gray-600">
                    Cette demande n’inclut pas encore de renseignements
                    supplémentaires. (À enrichir si le backend le renvoie.)
                  </div>

                  {/* ---- Actions ---- */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handleApproveRequest(request.id, request.requestedRole)
                        }
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approuver</span>
                      </button>

                      <button
                        onClick={() => {
                          const reason = prompt('Raison du rejet :');
                          if (reason !== null) {
                            handleRejectRequest(request.id, request.requestedRole);
                          }
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rejeter</span>
                      </button>

                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analyses et Rapports</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Chart Placeholder */}
                  <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Graphique des revenus</p>
                      <p className="text-sm text-gray-500">Évolution mensuelle de la plateforme</p>
                    </div>
                  </div>
  
                  {/* User Growth Chart Placeholder */}
                  <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Croissance des utilisateurs</p>
                      <p className="text-sm text-gray-500">Nouveaux utilisateurs par mois</p>
                    </div>
                  </div>
                </div>
  
                {/* Key Metrics */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
                    <div className="text-blue-600 font-medium">Taux de satisfaction</div>
                    <div className="text-sm text-blue-500">+2% vs mois dernier</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
                    <div className="text-green-600 font-medium">Taux de conversion</div>
                    <div className="text-sm text-green-500">+5% vs mois dernier</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2.4M</div>
                    <div className="text-purple-600 font-medium">Revenus totaux (MAD)</div>
                    <div className="text-sm text-purple-500">+23% vs mois dernier</div>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 mb-2">15%</div>
                    <div className="text-orange-600 font-medium">Commission moyenne</div>
                    <div className="text-sm text-orange-500">Stable</div>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres de la Plateforme</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Généraux</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commission par défaut (%)
                        </label>
                        <input
                          type="number"
                          defaultValue="15"
                          min="0"
                          max="30"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Délai d'approbation automatique (heures)
                        </label>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications Système</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                        <span className="ml-2 text-gray-700">Notifications de nouveaux utilisateurs</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                        <span className="ml-2 text-gray-700">Alertes de signalements</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                        <span className="ml-2 text-gray-700">Demandes de changement de rôle</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                        <span className="ml-2 text-gray-700">Rapports de revenus quotidiens</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                        <span className="ml-2 text-gray-700">Alertes de sécurité</span>
                      </label>
                    </div>
                  </div>
  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Nettoyer le cache
                      </button>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Sauvegarder la base
                      </button>
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                        Générer un rapport
                      </button>
                    </div>
                  </div>
  
                  <div className="pt-6 border-t border-gray-200">
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                      Sauvegarder les paramètres
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