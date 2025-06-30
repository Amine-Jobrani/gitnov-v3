
import React from 'react';
import { RoleSwitchForm } from '../components/RoleSwitchForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoleSwitchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link 
            to="/reservations" 
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux réservations</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Changer de rôle
          </h1>
          <p className="text-xl text-gray-600">
            Rejoignez notre communauté en tant que partenaire ou organisateur
          </p>
        </div>

        {/* Role Switch Form */}
        <RoleSwitchForm />
      </div>
    </div>
  );
};