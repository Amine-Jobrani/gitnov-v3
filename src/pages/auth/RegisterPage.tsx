//-------------------------------------------------------
// src/pages/auth/RegisterPage.tsx
//-------------------------------------------------------
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/* Typage du formulaire                                               */
/* ------------------------------------------------------------------ */
interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: 'client' | 'organizer' | 'partner';
  acceptTerms: boolean;
}

/* ------------------------------------------------------------------ */
/* Mapping Firebase → messages utilisateur                            */
/* ------------------------------------------------------------------ */
const FIREBASE_ERROR_MAP: Record<string, string> = {
  'auth/email-already-in-use':
    'Cet e-mail est déjà associé à un compte. Essayez de vous connecter.',
  'auth/invalid-email':
    'Adresse e-mail invalide. Vérifiez le format (ex. nom@domaine.com).',
  'auth/weak-password':
    'Mot de passe trop faible : 8 caractères minimum, avec chiffres & lettres.',
  'auth/network-request-failed':
    'Problème de connexion réseau. Veuillez réessayer.',
  'auth/operation-not-allowed':
    "L'inscription par e-mail est désactivée pour le moment.",
};

/* ------------------------------------------------------------------ */
/* Composant                                                          */
/* ------------------------------------------------------------------ */
export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterForm>();

  const password = watch('password');

  /* ---------------------------------------------------------------- */
  /* Submit handler                                                   */
  /* ---------------------------------------------------------------- */
  const onSubmit = async (data: RegisterForm) => {
    /* Cases simples avant réseau */
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        message: 'Les mots de passe ne correspondent pas.',
      });
      return;
    }
    if (!data.acceptTerms) {
      setError('acceptTerms', {
        message: "Vous devez accepter les conditions d'utilisation.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        role: data.role,
      });

      if (success) {
        navigate('/login');
      } else {
        setError('root', {
          message:
            "Votre compte n'a pas pu être créé. Veuillez réessayer dans un instant.",
        });
      }
    } catch (err: any) {
      const msg =
        FIREBASE_ERROR_MAP[err?.code as string] ??
        'Une erreur inattendue est survenue. Réessayez ultérieurement.';
      setError('root', { message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Helper pour factoriser les inputs                                */
  /* ---------------------------------------------------------------- */
  const renderInput = (
    name: keyof RegisterForm,
    label: string,
    type: string,
    icon: React.ReactNode,
    validateRules: any,
    placeholder?: string,
    showToggle?: boolean,
    showState?: boolean,
    toggleFunc?: () => void
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={
            showToggle && showState !== undefined
              ? showState
                ? 'text'
                : 'password'
              : type
          }
          placeholder={placeholder}
          {...register(name, validateRules)}
          className={`w-full pl-10 pr-${
            showToggle ? '12' : '4'
          } py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {showToggle && toggleFunc && (
          <button
            type="button"
            onClick={toggleFunc}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showState ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {(errors[name] as any)?.message}
        </p>
      )}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /* JSX                                                              */
  /* ---------------------------------------------------------------- */
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
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <img src="/Logo-Casavibes.png" alt="logo" style={{ width: '100px' }} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un Compte
            </h1>
            <p className="text-gray-600">Rejoignez la communauté Casavibes</p>
          </div>

          {/* Root error */}
          {errors.root && (
            <div className="flex items-start bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
              <span className="text-sm text-red-700">{errors.root.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderInput(
              'fullName',
              'Nom Complet',
              'text',
              <User className="h-5 w-5 text-gray-400" />,
              {
                required: 'Le nom complet est requis',
                minLength: { value: 2, message: 'Minimum 2 caractères' },
              },
              'Ex: John Doe'
            )}

            {renderInput(
              'email',
              'Adresse Email',
              'email',
              <Mail className="h-5 w-5 text-gray-400" />,
              {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Format d'email invalide",
                },
              },
              'exemple@domaine.com'
            )}

            {renderInput(
              'phoneNumber',
              'Numéro de Téléphone',
              'tel',
              <Phone className="h-5 w-5 text-gray-400" />,
              {
                pattern: {
                  value: /^(?:\+212|0)[1-9][0-9]{8}$/,
                  message: 'Format: +212XXXXXXXXX ou 0XXXXXXXXX',
                },
              },
              '+212612345678'
            )}

            {renderInput(
              'password',
              'Mot de Passe',
              'password',
              <Lock className="h-5 w-5 text-gray-400" />,
              {
                required: 'Le mot de passe est requis',
                minLength: { value: 8, message: 'Minimum 8 caractères' },
              },
              'Minimum 8 caractères',
              true,
              showPassword,
              () => setShowPassword(!showPassword)
            )}

            {renderInput(
              'confirmPassword',
              'Confirmer le Mot de Passe',
              'password',
              <Lock className="h-5 w-5 text-gray-400" />,
              {
                required: 'Veuillez confirmer votre mot de passe',
                validate: (value: string) =>
                  value === password || 'Les mots de passe ne correspondent pas',
              },
              'Répétez le mot de passe',
              true,
              showConfirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword)
            )}

            {/* Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                {...register('acceptTerms', {
                  required: "Vous devez accepter les conditions d'utilisation",
                })}
                className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                J'accepte les{' '}
                <Link
                  to="/terms"
                  className="text-orange-600 hover:text-orange-500"
                >
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link
                  to="/privacy"
                  className="text-orange-600 hover:text-orange-500"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.acceptTerms.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? 'Création du compte…' : 'Créer Mon Compte'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-500 font-semibold"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
