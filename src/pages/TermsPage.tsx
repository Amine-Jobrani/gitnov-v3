import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, FileText, Scale, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const TermsPage: React.FC = () => {
  const sections = [
    {
      id: 'presentation',
      title: '1. Présentation du service',
      icon: FileText,
      content: `Notre plateforme permet aux utilisateurs de Casablanca de découvrir et réserver facilement des activités locales, des événements culturels et des restaurants via une application mobile et un site web. Le service est développé par une startup innovante dans le cadre du projet YDAYS 2025.`
    },
    {
      id: 'access',
      title: '2. Accès au service',
      icon: Users,
      content: `L'accès à la plateforme est gratuit. Certaines fonctionnalités nécessitent la création d'un compte utilisateur. Le service est destiné aux personnes âgées de 16 ans ou plus.`
    },
    {
      id: 'account',
      title: '3. Création de compte',
      icon: Shield,
      content: [
        'Pour accéder à certaines fonctionnalités (réservations, favoris), un compte est requis.',
        'La création du compte se fait via Firebase Authentication (email et mot de passe).',
        'Vous vous engagez à fournir des informations exactes et à les tenir à jour.',
        'Vous êtes responsable de la confidentialité de vos identifiants.'
      ]
    },
    {
      id: 'behavior',
      title: '4. Comportement de l\'utilisateur',
      icon: AlertTriangle,
      content: [
        'Vous vous engagez à utiliser la plateforme dans le respect des lois marocaines.',
        'Il est interdit de créer de faux comptes, d\'effectuer de fausses réservations ou de publier des avis mensongers.',
        'Tout comportement abusif ou frauduleux pourra entraîner la suspension ou la suppression du compte.'
      ]
    },
    {
      id: 'reservations',
      title: '5. Réservations et paiements',
      icon: Clock,
      content: [
        'Les réservations sont effectuées directement via la plateforme, selon les disponibilités des partenaires.',
        'Les paiements, le cas échéant, sont traités via un prestataire externe sécurisé.',
        'Les politiques d\'annulation et de remboursement sont définies par les partenaires et affichées sur chaque fiche.'
      ]
    },
    {
      id: 'intellectual',
      title: '6. Propriété intellectuelle',
      icon: Shield,
      content: `Tous les éléments présents sur la plateforme (textes, visuels, logos, code, etc.) sont la propriété exclusive de l'équipe de développement ou de leurs partenaires. Toute reproduction ou utilisation non autorisée est interdite.`
    },
    {
      id: 'responsibilities',
      title: '7. Responsabilités',
      icon: Scale,
      content: [
        'Nous mettons tout en œuvre pour assurer un service fiable, mais nous ne garantissons pas l\'absence totale d\'erreurs ou d\'interruptions.',
        'Nous ne sommes pas responsables de la qualité ou de la conformité des activités proposées par les partenaires.',
        'Chaque utilisateur est responsable de l\'usage qu\'il fait du service.'
      ]
    },
    {
      id: 'suspension',
      title: '8. Suspension et suppression de compte',
      icon: AlertTriangle,
      content: `Nous nous réservons le droit de suspendre ou de supprimer un compte utilisateur en cas de non-respect des présentes conditions ou de comportement frauduleux. L'utilisateur peut également demander la suppression de son compte à tout moment.`
    },
    {
      id: 'modifications',
      title: '9. Modification des conditions',
      icon: FileText,
      content: `Nous pouvons modifier les présentes conditions d'utilisation à tout moment. Toute modification sera communiquée via l'application. L'utilisation continue du service implique l'acceptation des nouvelles conditions.`
    },
    {
      id: 'jurisdiction',
      title: '10. Droit applicable et juridiction compétente',
      icon: Scale,
      content: `Les présentes conditions sont régies par le droit marocain. En cas de litige, les tribunaux compétents de Casablanca seront seuls habilités.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/register" 
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à l'inscription</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Veuillez lire attentivement ces conditions avant d'utiliser notre plateforme
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Last updated */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            <strong>Dernière mise à jour :</strong> June 2025
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {section.title}
                </h2>
              </div>
              
              <div className="ml-16">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Questions sur nos conditions ?</h3>
          <p className="text-orange-100 mb-6">
            Notre équipe est là pour vous aider à comprendre nos conditions d'utilisation
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            <span>Nous contacter</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};