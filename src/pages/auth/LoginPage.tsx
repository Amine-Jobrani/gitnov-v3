// -------------------------------------------------------
// src/pages/auth/LoginPage.tsx
// -------------------------------------------------------
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Où retourner après authentification */
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      /** login() propage l’erreur => on la gère ici */
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const code = err?.code ?? err?.message;

      let message = 'Une erreur est survenue lors de la connexion';

      switch (code) {
        case 'auth/user-not-found':
          message = "Aucun utilisateur trouvé avec cet email.";
          break;
        case 'auth/wrong-password':
          message = "Mot de passe incorrect.";
          break;
        case 'auth/invalid-email':
          message = "Adresse email invalide.";
          break;
        case 'auth/too-many-requests':
          message = "Trop de tentatives. Réessayez plus tard.";
          break;
        default:
          message = "Email ou mot de passe incorrect.";
      }

      setError('root', { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <img src="/Logo-Casavibes.png" alt="logo" style={{ width: '100px' }} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bon Retour&nbsp;!
            </h1>
            <p className="text-gray-600">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.root.message}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: "L'email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Format d’email invalide',
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                  })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-500"
              >
                Mot de passe oublié&nbsp;?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? 'Connexion…' : 'Se Connecter'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Pas encore de compte&nbsp;?{' '}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-500 font-semibold"
              >
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
