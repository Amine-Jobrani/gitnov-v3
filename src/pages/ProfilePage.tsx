import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Camera, Save, Shield, Bell, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Toast } from '../components/ui/Toast';


interface ProfileForm {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface ChangePwInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfilePage: React.FC = () => {
  const { user, updateProfile , changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);

  /*  -------------- */
    useEffect(() => {
      console.log('User role:', user?.role);
    }, [user?.role]);

  /* ----------------------- Profil (infos générales) ------------------------ */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user, reset]);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const onSubmit = async (data: ProfileForm) => {
    setIsSubmitting(true);
    try {
      const success = await updateProfile(data);
      if (success) {
        setIsEditing(false);
        setToast({ type: 'success', message: 'Profil mis à jour avec succès !' });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({ type: 'error', message: 'Erreur lors de la mise à jour du profil' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la mise à jour du profil' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };



  /* ----------------------- Mot de passe ------------------------ */
  const {
    register: pwRegister,
    handleSubmit: pwHandleSubmit,
    watch: pwWatch,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
    setError: setPwError,
    reset: resetPw,
  } = useForm<ChangePwInputs>();

  const onSubmitPassword = async (data: ChangePwInputs) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setToast({ type: 'success', message: 'Mot de passe modifié avec succès !' });
      setTimeout(() => setToast(null), 3000);
      resetPw();
      setShowChangePassword(false);
    } catch (err: any) {
      let message = 'Erreur inconnue';
      switch (err.message) {
        case 'auth/wrong-password':
          message = 'Mot de passe actuel incorrect';
          break;
        case 'auth/weak-password':
          message = 'Le nouveau mot de passe est trop faible';
          break;
        default:
          message = err.message;
      }
      setPwError('root', { message });
      setToast({ type: 'error', message });
      setTimeout(() => setToast(null), 3000);
    }
  };  

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  {toast && (
    <Toast
      type={toast.type}
      message={toast.message}
      onClose={() => setToast(null)}
    />
  )}

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">{user.fullName}</h3>
                <p className="text-gray-600 capitalize">{user.role}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Informations Personnelles</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Modifier
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom Complet
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            {...register('fullName', {
                              required: 'Le nom complet est requis',
                            })}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                            } ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                      </div>

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
                              required: 'L\'email est requis',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Format d\'email invalide',
                              },
                            })}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                            } ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de Téléphone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            {...register('phoneNumber')}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                              !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                            } ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'}`}
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type de Compte
                        </label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                          <span className="text-gray-600 capitalize">{user.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut de Vérification</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">Email</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.isEmailVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isEmailVerified ? 'Vérifié' : 'En attente'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">Téléphone</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.isPhoneVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isPhoneVerified ? 'Vérifié' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <Save className="w-5 h-5" />
                          <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* ----------------------- SÉCURITÉ ------------------------ */}
              {activeTab === 'security' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité</h2>

                  {showChangePassword ? (
                    /* ---------- Formulaire de changement de mot de passe ---------- */
                    <form onSubmit={pwHandleSubmit(onSubmitPassword)} className="space-y-6 max-w-lg">
                      {pwErrors.root && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-600 text-sm">{(pwErrors.root as any)?.message}</p>
                        </div>
                      )}

                      {/* Mot de passe actuel */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            {...pwRegister('currentPassword', { required: 'Mot de passe actuel requis' })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                              pwErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                        {pwErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{pwErrors.currentPassword.message}</p>
                        )}
                      </div>

                      {/* Nouveau mot de passe */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            {...pwRegister('newPassword', {
                              required: 'Nouveau mot de passe requis',
                              minLength: { value: 8, message: 'Minimum 8 caractères' },
                            })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                              pwErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                        {pwErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{pwErrors.newPassword.message}</p>
                        )}
                      </div>

                      {/* Confirmation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            {...pwRegister('confirmPassword', {
                              required: 'Confirmation requise',
                              validate: (val) => val === pwWatch('newPassword') || 'Les mots de passe ne correspondent pas',
                            })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                              pwErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                        {pwErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{pwErrors.confirmPassword.message}</p>
                        )}
                      </div>

                      {/* Boutons */}
                      <div className="flex items-center space-x-3">
                        <button
                          type="submit"
                          disabled={pwSubmitting}
                          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                          {pwSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            resetPw();
                            setShowChangePassword(false);
                          }}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ---------- Vue générale sécurité ---------- */
                    <div className="space-y-6">
                      <div className="p-6 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mot de Passe</h3>
                        <p className="text-gray-600 mb-4">Dernière modification il y a 30 jours</p>
                        <button
                          onClick={() => setShowChangePassword(true)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Changer le mot de passe
                        </button>
                      </div>

                      <div className="p-6 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentification à deux facteurs</h3>
                        <p className="text-gray-600 mb-4">Ajoutez une couche de sécurité supplémentaire</p>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Configurer 2FA
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">Nouveaux événements</h3>
                          <p className="text-sm text-gray-600">Recevoir des notifications pour les nouveaux événements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">Confirmations de réservation</h3>
                          <p className="text-sm text-gray-600">Recevoir des confirmations par email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">Offres spéciales</h3>
                          <p className="text-sm text-gray-600">Recevoir des promotions et offres exclusives</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};