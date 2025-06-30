// src/components/RoleSwitchForm.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form as AntForm,
  Input,
  Radio,
  Card,
  Button,
  Badge,
  message,
  Upload,
  Select,
} from 'antd';
import {
  Users,
  Building,
  ArrowRight,
  CheckCircle,
  Upload as UploadIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ---------- services & auth ---------- */
import {
  sendPartnerRequest,
  sendOrganizerRequest,
} from '../services/dashboardAdminService';
import { useAuth } from '../context/AuthContext';

/* ------------------------------------------------------------------ */
/* Validation avec Zod                                                */
/* ------------------------------------------------------------------ */
const formSchema = z.object({
  role: z.enum(['partenaire', 'organisateur'], {
    required_error: 'Veuillez sélectionner un rôle',
  }),
  companyName: z
    .string()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  contactEmail: z
    .string()
    .email('Veuillez entrer une adresse email valide'),
  phone: z
    .string()
    .min(10, 'Veuillez entrer un numéro de téléphone valide'),
  address: z
    .string()
    .min(5, 'Veuillez entrer une adresse complète'),
  experience: z
    .string()
    .min(2, 'Veuillez décrire votre expérience'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères'),
  motivation: z
    .string()
    .min(20, 'Veuillez expliquer votre motivation (minimum 20 caractères)'),
  documents: z.array(z.string()).min(1, 'Veuillez fournir au moins un document'),
});
type FormData = z.infer<typeof formSchema>;

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */
interface RoleSwitchFormProps {
  onSubmit?: (data: FormData) => void;
  currentRole?: string;
}

/* ------------------------------------------------------------------ */
/* Composant                                                          */
/* ------------------------------------------------------------------ */
export const RoleSwitchForm: React.FC<RoleSwitchFormProps> = ({
  onSubmit,
  currentRole,
}) => {
  const { user } = useAuth(); // ← récupère l'utilisateur avec le token
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'partenaire',
      companyName: '',
      contactEmail: '',
      phone: '',
      address: '',
      experience: '',
      description: '',
      motivation: '',
      documents: [],
    },
  });

  const selectedRole = watch('role');
  if (!user?.idToken) {
    console.warn('Pas de token', user);
    message.error('Utilisateur non authentifié');
    return;
  }
  
  

  /* ------------------------------------------------------------------ */
  /* Options rôle & documents                                           */
  /* ------------------------------------------------------------------ */
  const roleOptions = [
    {
      value: 'partenaire',
      title: 'Devenir Partenaire',
      description: 'Proposez vos services et établissements sur notre plateforme',
      icon: <Building className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
    },
    {
      value: 'organisateur',
      title: 'Devenir Organisateur',
      description: 'Créez et gérez vos événements sur notre plateforme',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
    },
  ];

  const getDocumentOptions = (role: string) =>
    role === 'partenaire'
      ? [
          'Licence commerciale',
          "Certificat d\'hygiène",
          'Photos du restaurant',
          'Registre de commerce',
          'Assurance établissement',
        ]
      : [
          "Statuts de l'entreprise",
          "Portfolio d'événements",
          'Références clients',
          'Certificat professionnel',
          'Assurance événementielle',
        ];

  /* ------------------------------------------------------------------ */
  /* Upload fichiers                                                     */
  /* ------------------------------------------------------------------ */
  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    const uploaded = newFileList.map(
      (f: any) => f.name || f.originFileObj?.name,
    );
    setValue('documents', uploaded);
  };

  /* ------------------------------------------------------------------ */
  /* Soumission                                                          */
  /* ------------------------------------------------------------------ */
  const onValid = async (data: FormData) => {
    console.log('Form data being submitted:', data);
    console.log('User token:', user?.idToken ? 'Present' : 'Missing');
    console.log(`User token: ${user.idToken}`);
    
    try {
      if (!user?.idToken) {
        message.error('Utilisateur non authentifié');
        return;
      }

      /* -------- appel API réel -------- */
      if (data.role === 'partenaire') {
        console.log('Sending partner request with data:', data);
        await sendPartnerRequest(user.idToken, data);
      } else {
        console.log('Sending organizer request with data:', data);
        await sendOrganizerRequest(user.idToken, data);
      }

      message.success('Demande envoyée !');
      onSubmit?.(data);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      message.error(
        err?.response?.data?.message || "Erreur lors de l'envoi",
      );
    }
  };

  /* ------------------------------------------------------------------ */
  /* Écran succès                                                        */
  /* ------------------------------------------------------------------ */
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="mb-4 text-2xl font-bold text-gray-900">
          Demande envoyée avec succès&nbsp;!
        </h3>
        <p className="mx-auto mb-6 max-w-md text-gray-600">
          Votre demande pour devenir <b>{selectedRole}</b> a été soumise.
          Notre équipe vous contactera sous 24&nbsp;h.
        </p>
        <Button
          onClick={() => {
            reset();
            setIsSuccess(false);
            setFileList([]);
          }}
          type="default"
        >
          Faire une nouvelle demande
        </Button>
      </motion.div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Formulaire principal                                                */
  /* ------------------------------------------------------------------ */
  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* -------- Entête -------- */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Choisissez votre rôle
        </h2>
        <p className="text-xl text-gray-600">
          Rejoignez notre communauté et développez votre activité
        </p>
        {currentRole && (
          <Badge className="mt-2" count={`Rôle actuel : ${currentRole}`} />
        )}
      </div>

      {/* -------- Form -------- */}
      <form 
        onSubmit={(e) => {
          console.log('Form onSubmit event triggered');
          console.log('Event:', e);
          handleSubmit(onValid)(e);
        }}
      >
        {/* Sélection rôle */}
        <AntForm.Item
          label={<span className="text-lg font-semibold">Sélection du rôle</span>}
          validateStatus={errors.role ? 'error' : ''}
          help={errors.role?.message}
        >
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field} className="grid gap-6 md:grid-cols-2">
                {roleOptions.map((opt) => (
                  <Card
                    key={opt.value}
                    hoverable
                    onClick={() => field.onChange(opt.value)}
                    className={`border-2 transition-all ${
                      field.value === opt.value
                        ? 'border-orange-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Card.Meta
                      avatar={
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${opt.color}`}
                        >
                          {opt.icon}
                        </div>
                      }
                      title={opt.title}
                      description={opt.description}
                    />
                  </Card>
                ))}
              </Radio.Group>
            )}
          />
        </AntForm.Item>

        {/* --- Infos supplémentaires --- */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Informations de l'entreprise */}
            <AntForm.Item
              label="Nom de l'entreprise"
              validateStatus={errors.companyName ? 'error' : ''}
              help={errors.companyName?.message}
            >
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nom de votre entreprise" />
                )}
              />
            </AntForm.Item>

            {/* Email de contact */}
            <AntForm.Item
              label="Email de contact"
              validateStatus={errors.contactEmail ? 'error' : ''}
              help={errors.contactEmail?.message}
            >
              <Controller
                name="contactEmail"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="email@entreprise.com" />
                )}
              />
            </AntForm.Item>

            {/* Téléphone */}
            <AntForm.Item
              label="Téléphone"
              validateStatus={errors.phone ? 'error' : ''}
              help={errors.phone?.message}
            >
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="+33 1 23 45 67 89" />
                )}
              />
            </AntForm.Item>

            {/* Adresse */}
            <AntForm.Item
              label="Adresse complète"
              validateStatus={errors.address ? 'error' : ''}
              help={errors.address?.message}
            >
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input.TextArea 
                    {...field} 
                    placeholder="123 Rue de la Paix, 75001 Paris, France"
                    rows={3}
                  />
                )}
              />
            </AntForm.Item>

            {/* Expérience */}
            <AntForm.Item
              label="Expérience professionnelle"
              validateStatus={errors.experience ? 'error' : ''}
              help={errors.experience?.message}
            >
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <Input.TextArea 
                    {...field} 
                    placeholder="Décrivez votre expérience dans le domaine..."
                    rows={4}
                  />
                )}
              />
            </AntForm.Item>

            {/* Description */}
            <AntForm.Item
              label="Description de l'activité"
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input.TextArea 
                    {...field} 
                    placeholder="Décrivez votre activité, vos services..."
                    rows={4}
                  />
                )}
              />
            </AntForm.Item>

            {/* Motivation */}
            <AntForm.Item
              label="Motivation"
              validateStatus={errors.motivation ? 'error' : ''}
              help={errors.motivation?.message}
            >
              <Controller
                name="motivation"
                control={control}
                render={({ field }) => (
                  <Input.TextArea 
                    {...field} 
                    placeholder="Pourquoi souhaitez-vous rejoindre notre plateforme ?"
                    rows={4}
                  />
                )}
              />
            </AntForm.Item>

            {/* Documents */}
            <AntForm.Item
              label="Documents requis"
              validateStatus={errors.documents ? 'error' : ''}
              help={errors.documents?.message}
            >
              <Controller
                name="documents"
                control={control}
                render={({ field }) => (
                  <div>
                    <Upload
                      listType="text"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      beforeUpload={() => false}
                      multiple
                    >
                      <Button icon={<UploadIcon className="h-4 w-4" />}>
                        Sélectionner les fichiers
                      </Button>
                    </Upload>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Documents requis pour {selectedRole === 'partenaire' ? 'partenaire' : 'organisateur'} :</p>
                      <ul className="mt-1 list-disc list-inside">
                        {getDocumentOptions(selectedRole).map((doc, index) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              />
            </AntForm.Item>

            {/* Submit */}
            <div className="flex items-center justify-between border-t pt-6">
              <p className="text-sm text-gray-600">
                En soumettant ce formulaire, vous acceptez nos conditions
                d'utilisation
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    console.log('Manual test - Current form values:', watch());
                    console.log('Manual test - Current form errors:', errors);
                    console.log('Manual test - Is form valid:', Object.keys(errors).length === 0);
                  }}
                  type="default"
                >
                  Test Form
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<ArrowRight className="h-4 w-4" />}
                  loading={isSubmitting}
                >
                  Envoyer la demande
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};
