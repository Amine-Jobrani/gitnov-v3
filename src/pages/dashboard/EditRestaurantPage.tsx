import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Image, Star, DollarSign, ArrowLeft, Save, Eye, Utensils, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

interface RestaurantFormData {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  priceRange: string;
  capacity: number;
  images: string[];
  amenities: string[];
  specialties: string[];
  paymentMethods: string[];
  reservationPolicy: string;
  dressCode: string;
  status: string;
  rating: number;
  totalReviews: number;
}

export const EditRestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<RestaurantFormData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, fetch from API
  const mockRestaurant: RestaurantFormData = {
    id: 1,
    name: 'La Sqala',
    description: 'Restaurant traditionnel marocain situé dans un cadre authentique avec une vue magnifique sur l\'océan. Nous proposons une cuisine marocaine raffinée dans une ambiance chaleureuse.',
    cuisine: 'marocaine',
    address: 'Boulevard Mohammed V, Medina, Casablanca',
    phone: '+212522264960',
    email: 'contact@lasqala.ma',
    website: 'https://www.lasqala.ma',
    openingHours: {
      monday: { open: '12:00', close: '23:00', closed: false },
      tuesday: { open: '12:00', close: '23:00', closed: false },
      wednesday: { open: '12:00', close: '23:00', closed: false },
      thursday: { open: '12:00', close: '23:00', closed: false },
      friday: { open: '12:00', close: '23:00', closed: false },
      saturday: { open: '12:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '23:00', closed: false }
    },
    priceRange: 'moyen',
    capacity: 80,
    images: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['WiFi gratuit', 'Terrasse', 'Parking', 'Climatisation'],
    specialties: ['Tajine aux pruneaux', 'Couscous royal', 'Pastilla au poisson', 'Méchoui'],
    paymentMethods: ['Espèces', 'Carte bancaire', 'Chèques'],
    reservationPolicy: 'Annulation gratuite jusqu\'à 2 heures avant. Acompte de 50 MAD requis pour les groupes de plus de 6 personnes.',
    dressCode: 'Tenue décontractée élégante recommandée',
    status: 'Actif',
    rating: 4.7,
    totalReviews: 234
  };

  useEffect(() => {
    // Simulate API call
    const loadRestaurant = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(mockRestaurant);
      setIsLoading(false);
    };

    loadRestaurant();
  }, [id]);

  const cuisineTypes = [
    { value: 'marocaine', label: 'Cuisine Marocaine' },
    { value: 'francaise', label: 'Cuisine Française' },
    { value: 'italienne', label: 'Cuisine Italienne' },
    { value: 'asiatique', label: 'Cuisine Asiatique' },
    { value: 'mediterraneenne', label: 'Cuisine Méditerranéenne' },
    { value: 'fruits-de-mer', label: 'Fruits de Mer' },
    { value: 'fusion', label: 'Cuisine Fusion' },
    { value: 'vegetarienne', label: 'Cuisine Végétarienne' },
    { value: 'fast-food', label: 'Fast Food' },
    { value: 'autre', label: 'Autre' }
  ];

  const priceRanges = [
    { value: 'economique', label: 'Économique (50-150 MAD)' },
    { value: 'moyen', label: 'Moyen (150-300 MAD)' },
    { value: 'haut-de-gamme', label: 'Haut de gamme (300-500 MAD)' },
    { value: 'luxe', label: 'Luxe (500+ MAD)' }
  ];

  const paymentOptions = [
    'Espèces', 'Carte bancaire', 'Chèques', 'Virements', 'Paiement mobile'
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  const handleInputChange = (field: keyof RestaurantFormData, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleArrayChange = (field: 'images' | 'amenities' | 'specialties', index: number, value: string) => {
    if (!formData) return;
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => prev ? { ...prev, [field]: newArray } : null);
  };

  const addArrayItem = (field: 'images' | 'amenities' | 'specialties') => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: [...prev[field], ''] } : null);
  };

  const removeArrayItem = (field: 'images' | 'amenities' | 'specialties', index: number) => {
    if (!formData) return;
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => prev ? { ...prev, [field]: newArray } : null);
  };

  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    if (!formData) return;
    setFormData(prev => prev ? {
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    } : null);
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    if (!formData) return;
    setFormData(prev => prev ? {
      ...prev,
      paymentMethods: checked
        ? [...prev.paymentMethods, method]
        : prev.paymentMethods.filter(m => m !== method)
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Updated restaurant data:', formData);
    setIsSubmitting(false);
    // Redirect to restaurants dashboard
  };

  const handleDelete = async () => {
    if (!formData) return;
    
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ? Cette action est irréversible.');
    if (!confirmed) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Restaurant deleted:', formData.id);
    setIsSubmitting(false);
    // Redirect to restaurants dashboard
  };

  const steps = [
    { id: 1, title: 'Informations de base', icon: Utensils },
    { id: 2, title: 'Horaires et contact', icon: Clock },
    { id: 3, title: 'Services et tarifs', icon: DollarSign },
    { id: 4, title: 'Médias et détails', icon: Image }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données du restaurant...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant non trouvé</h1>
          <p className="text-gray-600 mb-6">Le restaurant demandé n'existe pas ou a été supprimé.</p>
          <Link
            to="/dashboard-partner"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-500 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au dashboard</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Modifier {formData.name}</h1>
              <p className="text-xl text-gray-600">
                Mettez à jour les informations de votre restaurant
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{formData.rating}</span>
                  <span className="text-gray-500">({formData.totalReviews} avis)</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  formData.status === 'Actif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {formData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep >= step.id
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    Étape {step.id}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step.id ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de Base</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du restaurant *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: La Sqala"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Décrivez votre restaurant, son ambiance, ses spécialités..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de cuisine *
                    </label>
                    <select
                      required
                      value={formData.cuisine}
                      onChange={(e) => handleInputChange('cuisine', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez un type</option>
                      {cuisineTypes.map((cuisine) => (
                        <option key={cuisine.value} value={cuisine.value}>
                          {cuisine.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacité (nombre de places) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Boulevard Mohammed V, Medina, Casablanca"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Hours and Contact */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Horaires et Contact</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+212 522 XX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="contact@restaurant.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://www.restaurant.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Horaires d'ouverture *
                  </label>
                  <div className="space-y-3">
                    {daysOfWeek.map((day) => (
                      <div key={day.key} className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-medium text-gray-700">
                          {day.label}
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.openingHours[day.key].closed}
                            onChange={(e) => handleHoursChange(day.key, 'closed', e.target.checked)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">Fermé</span>
                        </label>
                        {!formData.openingHours[day.key].closed && (
                          <>
                            <input
                              type="time"
                              value={formData.openingHours[day.key].open}
                              onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <span className="text-gray-500">à</span>
                            <input
                              type="time"
                              value={formData.openingHours[day.key].close}
                              onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Services and Pricing */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services et Tarifs</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gamme de prix *
                  </label>
                  <select
                    required
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une gamme</option>
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moyens de paiement acceptés
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentOptions.map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods.includes(method)}
                          onChange={(e) => handlePaymentMethodChange(method, e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialités du restaurant
                  </label>
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => handleArrayChange('specialties', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: Tajine aux pruneaux"
                      />
                      {formData.specialties.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('specialties', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('specialties')}
                    className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                  >
                    + Ajouter une spécialité
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services et équipements
                  </label>
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => handleArrayChange('amenities', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: WiFi gratuit, Terrasse, Parking"
                      />
                      {formData.amenities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('amenities', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('amenities')}
                    className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                  >
                    + Ajouter un service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Politique de réservation
                    </label>
                    <textarea
                      rows={3}
                      value={formData.reservationPolicy}
                      onChange={(e) => handleInputChange('reservationPolicy', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Conditions d'annulation, acompte requis..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code vestimentaire
                    </label>
                    <textarea
                      rows={3}
                      value={formData.dressCode}
                      onChange={(e) => handleInputChange('dressCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tenue décontractée, élégante, etc."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Media and Details */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Médias et Photos</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos du restaurant
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Ajoutez des photos de qualité pour attirer les clients (intérieur, plats, terrasse...)
                  </p>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleArrayChange('images', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="https://exemple.com/photo-restaurant.jpg"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                  >
                    + Ajouter une photo
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Conseils pour de meilleures photos</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Utilisez un bon éclairage naturel</li>
                    <li>• Montrez l'ambiance et la décoration</li>
                    <li>• Incluez des photos de vos plats signature</li>
                    <li>• Évitez les photos floues ou sombres</li>
                  </ul>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Zone de danger</h3>
                    <p className="text-red-700 mb-4">
                      La suppression de ce restaurant est irréversible. Toutes les données associées seront perdues.
                    </p>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer le restaurant</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Précédent
            </button>

            <div className="flex items-center space-x-4">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSubmitting ? 'Sauvegarde...' : 'Sauvegarder les modifications'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};