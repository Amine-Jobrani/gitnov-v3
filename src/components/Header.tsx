import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, User, Heart, Calendar, Menu, X, LogOut, Sparkles, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Accueil', icon: MapPin },
    { path: '/events', label: 'Événements', icon: Calendar },
    { path: '/restaurants', label: 'Restaurants', icon: Search },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
              <MapPin className="w-6 h-6 text-white" />
            </div> */}
            <span className="text-2xl font-bold text-gray-900">
              Casavibes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span style={{paddingLeft: '1px'}}>{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.fullName}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Mon Profil</span>
                      </Link>
                      <Link
                        to="/reservations"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Mes Réservations</span>
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Mes Favoris</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/user-management"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Users className="w-4 h-4" />
                          <span>User Management</span>
                        </Link>
                      )}
                      <Link
                        to="/role-settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Role Settings</span>
                      </Link>
                      {(user.role === 'partner') && (
                        <Link
                          to="/dashboard-partner"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Menu className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      {(user.role === 'organizer') && (
                        <Link
                          to="/dashboard-organizer"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Menu className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      {(user.role !== 'organizer' && user.role !== 'partner') && (
                        <Link
                          to="/change-role"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Sparkles className="w-4 h-4" style={{ minWidth: '1rem' }} />
                          <span>Rejoignez-nous : devenez partenaire ou organisateur !</span>
                        </Link>
                      )}
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              <nav className="space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(path)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};