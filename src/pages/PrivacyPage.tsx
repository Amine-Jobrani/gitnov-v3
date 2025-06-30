import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, MapPin, UserCheck, Database, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrivacyPage: React.FC = () => {
  const sections = [
    {
      id: 'who-we-are',
      title: '1. Qui sommes-nous ?',
      icon: UserCheck,
      content: `Nous sommes GitNov, une jeune startup développant casavibes, une plateforme web et mobile de découverte et réservation d’activités locales à Casablanca. Notre mission est d’offrir une expérience utilisateur fluide, personnalisée et sécurisée.`
    },
    {
      id: 'data-collected',
      title: '2. Données collectées',
      icon: Database,
      content: {
        intro: 'Lors de l\'utilisation de la plateforme, nous collectons uniquement les données strictement nécessaires :',
        sections: [
          {
            title: 'Authentification',
            content: [
              'Via Firebase Authentication. Nous ne stockons que :',
              'L\'identifiant unique généré par Firebase',
              'L\'adresse email de l\'utilisateur'
            ]
          },
          {
            title: 'Données d\'usage',
            content: [
              'Historique de navigation et actions (clics, favoris)',
              'Activités réservées et notées, dans le but de générer des recommandations personnalisées'
            ]
          }
        ]
      }
    },
    {
      id: 'security',
      title: '3. Sécurité des données',
      icon: Lock,
      content: [
        'Les mots de passe ne sont jamais stockés sur nos serveurs : ils sont gérés et sécurisés directement par Firebase.',
        'Toutes les données utilisateur sont conservées de manière sécurisée et uniquement dans la limite nécessaire à l\'expérience sur la plateforme.',
        'Des mesures de sécurité standards (chiffrement, validation des entrées, restrictions d\'accès) sont mises en place pour prévenir les accès non autorisés.'
      ]
    },
    {
      id: 'data-usage',
      title: '4. Utilisation des données',
      icon: Settings,
      content: {
        intro: 'Les données sont utilisées pour :',
        list: [
          'Personnaliser les suggestions d\'activités',
          'Améliorer l\'expérience utilisateur',
          'Permettre la réservation et la gestion de contenu favori'
        ],
        note: 'Aucune donnée ne sera vendue, louée ou partagée avec des tiers sans consentement explicite.'
      }
    },
    {
      id: 'user-rights',
      title: '5. Droits des utilisateurs',
      icon: Shield,
      content: {
        intro: 'Conformément à la législation en vigueur en matière de protection des données, notamment le Règlement Général sur la Protection des Données (RGPD), tout utilisateur dispose des droits suivants concernant ses données personnelles :',
        rights: [
          {
            title: '5.1. Droit à l\'accès',
            content: 'Vous avez le droit d\'obtenir, à tout moment, une copie des données personnelles que nous détenons à votre sujet.'
          },
          {
            title: '5.2. Droit de rectification',
            content: 'Vous pouvez demander la mise à jour ou la correction de vos informations personnelles inexactes ou incomplètes à tout moment.'
          },
          {
            title: '5.3. Droit à la suppression',
            content: [
              'Vous pouvez demander la suppression de tout ou partie de vos données personnelles dans les cas suivants :',
              'Vos données ne sont plus nécessaires aux finalités pour lesquelles elles ont été collectées',
              'Vous retirez votre consentement',
              'Vous vous opposez au traitement de vos données',
              'Vos données ont été traitées de manière illicite',
              'La suppression sera effective dans un délai raisonnable (généralement sous 30 jours) après vérification de votre identité. Cela entraînera la désactivation complète de votre compte et la suppression de toutes les données associées (identifiants, favoris, historique, etc.).'
            ]
          }
        ]
      }
    },
    {
      id: 'location-data',
      title: '6. Traitement des données de localisation',
      icon: MapPin,
      content: {
        intro: 'Lorsque vous autorisez l\'accès à votre position géographique, notre plateforme peut traiter les données de localisation pour :',
        purposes: [
          'vous suggérer des activités proches de votre position actuelle',
          'afficher des résultats pertinents sur la carte',
          'améliorer la personnalisation de l\'expérience utilisateur'
        ],
        note: 'Les données de localisation sont utilisées uniquement si vous donnez votre consentement explicite via les paramètres de votre appareil ou navigateur. Elles ne sont ni stockées de manière permanente, ni transmises à des tiers, et peuvent être désactivées à tout moment dans vos réglages de confidentialité.'
      }
    }
  ];

  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <p className="text-gray-700 leading-relaxed">{content}</p>;
    }

    if (Array.isArray(content)) {
      return (
        <ul className="space-y-3">
          {content.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      );
    }

    if (content.intro) {
      return (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{content.intro}</p>
          
          {content.sections && (
            <div className="space-y-4">
              {content.sections.map((section: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.content.map((item: string, itemIdx: number) => (
                      <li key={itemIdx} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600 text-sm">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {content.list && (
            <ul className="space-y-2">
              {content.list.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{item}</p>
                </li>
              ))}
            </ul>
          )}

          {content.purposes && (
            <ul className="space-y-2">
              {content.purposes.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{item}</p>
                </li>
              ))}
            </ul>
          )}

          {content.rights && (
            <div className="space-y-6">
              {content.rights.map((right: any, idx: number) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">{right.title}</h4>
                  {Array.isArray(right.content) ? (
                    <ul className="space-y-2">
                      {right.content.map((item: string, itemIdx: number) => (
                        <li key={itemIdx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-800 text-sm">{item}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-blue-800">{right.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {content.note && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-800 font-medium">{content.note}</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

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
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nous protégeons et utilisons vos données personnelles
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Last updated */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm">
              <strong>Dernière mise à jour :</strong> June 2025 - Nous nous engageons à protéger votre vie privée
            </p>
          </div>
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {section.title}
                </h2>
              </div>
              
              <div className="ml-16">
                {renderContent(section.content)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Eye className="w-6 h-6" />
            <h3 className="text-2xl font-bold">Transparence totale</h3>
          </div>
          <p className="text-blue-100 mb-6">
            Vous avez des questions sur notre politique de confidentialité ? Nous sommes là pour vous répondre
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <span>Nous contacter</span>
            </Link>
            <button className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Gérer mes données</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};