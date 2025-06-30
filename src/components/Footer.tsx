import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <img src="/Logo-Casavibes white font.png" alt="logo" style={{ width: '100px' }} />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Découvrez les meilleurs événements et restaurants de Casablanca. 
              Votre guide ultime pour explorer la ville blanche.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">
                  Mes Favoris
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  Mon Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Partenaires</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Devenir Organisateur
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Partenaire Restaurant
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Centre d'Aide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400 text-sm">contact@casavibes.ma</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400 text-sm">+212 522-123-456</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Boulevard Hassan II<br />
                  Casablanca, Maroc
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Casavibes. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'Utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};