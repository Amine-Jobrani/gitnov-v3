import React, { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Clock, Image, Tag, FileText, ArrowLeft, Save, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  address: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: number;
  price: number;
  images: string[];
  tags: string[];
  organizer: string;
  phone: string;
  email: string;
  website: string;
  requirements: string;
  cancellationPolicy: string;
}

export const CreateEventPage: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    address: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    capacity: 0,
    price: 0,
    images: [''],
    tags: [''],
    organizer: '',
    phone: '',
    email: '',
    website: '',
    requirements: '',
    cancellationPolicy: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'culturel', label: 'Culturel' },
    { value: 'sport', label: 'Sport' },
    { value: 'formation', label: 'Formation' },
    { value: 'famille', label: 'Famille' },
    { value: 'nocturne', label: 'Vie nocturne' },
    { value: 'business', label: 'Business' },
    { value: 'art', label: 'Art & Créativité' },
    { value: 'musique', label: 'Musique' }
  ];

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'images' | 'tags', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'images' | 'tags') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'images' | 'tags', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Event data:', formData);
    setIsSubmitting(false);
    // Redirect to events dashboard
  };

  const steps = [
    { id: 1, title: 'Informations de base', icon: FileText },
    { id: 2, title: 'Date et lieu', icon: Calendar },
    { id: 3, title: 'Tarification et capacité', icon: DollarSign },
    { id: 4, title: 'Médias et détails', icon: Image }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard-organizer"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-500 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Créer un Nouvel Événement</h1>
          <p className="text-xl text-gray-600">
            Remplissez les informations pour créer votre événement
          </p>
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
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Festival de Jazz de Casablanca"
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
                    placeholder="Décrivez votre événement en détail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organisateur *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organizer}
                      onChange={(e) => handleInputChange('organizer', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nom de l'organisateur"
                    />
                  </div>
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
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="contact@exemple.com"
                    />
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
                      placeholder="https://www.exemple.com"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Date and Location */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Date et Lieu</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse du lieu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Théâtre Mohammed V, Avenue Hassan II, Casablanca"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de début *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de fin
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pricing and Capacity */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tarification et Capacité</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix du billet (MAD) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="150.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacité maximale *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Politique d'annulation
                  </label>
                  <textarea
                    rows={3}
                    value={formData.cancellationPolicy}
                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Décrivez les conditions d'annulation et de remboursement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exigences particulières
                  </label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Âge minimum, code vestimentaire, documents requis..."
                  />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Médias et Détails</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images de l'événement
                  </label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleArrayChange('images', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="https://exemple.com/image.jpg"
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
                    + Ajouter une image
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (mots-clés)
                  </label>
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: jazz, musique, concert"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('tags', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('tags')}
                    className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                  >
                    + Ajouter un tag
                  </button>
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
                  <span>{isSubmitting ? 'Création...' : 'Créer l\'événement'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};