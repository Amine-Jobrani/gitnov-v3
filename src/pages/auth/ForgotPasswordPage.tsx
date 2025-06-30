import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    try {
      const success = await resetPassword(data.email);
      if (success !== false) {
        setEmailSent(true);
      } else {
        setError('root', {
          message: "Une erreur est survenue lors de l'envoi du lien de réinitialisation.",
        });
      }
    } catch (err: any) {
      let message = "Une erreur est survenue.";
      if (err?.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            message = "Aucun utilisateur trouvé avec cet email.";
            break;
          case 'auth/invalid-email':
            message = "Adresse email invalide.";
            break;
          case 'auth/too-many-requests':
            message = "Trop de tentatives. Réessayez plus tard.";
            break;
          default:
            message = err.message;
        }
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
              <img src="/Logo-Casavibes.png" alt="logo" style={{width: '100px'}} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mot de passe oublié
            </h1>
            <p className="text-gray-600">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          {emailSent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700">
                Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception et vos spams.
              </p>
              <Link to="/login" className="mt-4 inline-block text-orange-600 hover:text-orange-500 font-semibold">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{errors.root.message}</p>
                </div>
              )}

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
                        message: "Format d'email invalide",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? "Envoi du lien..." : "Envoyer le lien"}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-orange-600 hover:text-orange-500">
                  Revenir à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
