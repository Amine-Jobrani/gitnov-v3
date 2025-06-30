import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventReservationService } from '../services/eventReservation';
import { EventReservationWithDetails } from '../services/types';
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, X as XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type ReservationType = 'event';
type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

interface Reservation {
  id: number;
  type: ReservationType;
  name: string;
  image: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  address: string;
  note?: string;
  paymentIntentId?: string;
}

export const ReservationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const navigate = useNavigate();

  const {
    data: evRes = [],
    isLoading: evLoading,
    isError: evError,
  } = useQuery<EventReservationWithDetails[], Error>({
    queryKey: ['reservations', 'events', 'me'],
    queryFn: async () => await eventReservationService.listMyReservations(),
  });

  const transformedReservations: Reservation[] = useMemo(() => {
    return evRes.map((r) => ({
      id: r.id,
      type: 'event',
      name: r.planner.event.title,
      image: '/placeholder.jpg',
      date: r.planner.startDate,
      time: r.planner.startDate,
      guests: r.numberOfGuests,
      status: r.status as ReservationStatus,
      address: `${r.planner.event.address}, ${r.planner.event.city}`,
      note: r.note,
      paymentIntentId: r.paymentIntentId,
    }));
  }, [evRes]);

  const allReservations = useMemo(
    () => [...transformedReservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [transformedReservations]
  );

  const filteredReservations = useMemo(() => {
    const now = Date.now();
    if (activeTab === 'all') return allReservations;
    return allReservations.filter((r) =>
      activeTab === 'upcoming'
        ? new Date(r.date).getTime() >= now
        : new Date(r.date).getTime() < now
    );
  }, [allReservations, activeTab]);

  const handlePayNow = async (reservationId: number) => {
    const stripe = await stripePromise;
    const res = await eventReservationService.createStripeCheckoutSession(reservationId);
    stripe?.redirectToCheckout({ sessionId: res.sessionId });
  };

  if (evLoading) return <Spinner />;
  if (evError) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mes Réservations</h1>
          <p className="text-xl text-gray-600">Gérez vos réservations d'événements et restaurants</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {["all","upcoming","past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {tab === 'all' ? 'Toutes' : tab === 'upcoming' ? 'À venir' : 'Passées'}
              </button>
            ))}
          </div>
        </div>

        {filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {filteredReservations.map((res, i) => (
              <ReservationCard key={res.id} reservation={res} index={i} onPayNow={handlePayNow} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-600">
              {activeTab === 'upcoming'
                ? "Vous n'avez aucune réservation à venir"
                : activeTab === 'past'
                ? "Vous n'avez aucune réservation passée"
                : "Vous n'avez aucune réservation"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ReservationCard: React.FC<{ reservation: Reservation; index: number; onPayNow: (id: number) => void }> = ({ reservation, index, onPayNow }) => {
  const date = new Date(reservation.date);
  const formattedDate = format(date, 'PPP', { locale: fr });
  const formattedTime = format(date, 'p', { locale: fr });

  return (
    <motion.div className="bg-white shadow rounded-lg p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <div className="flex items-center">
        <img src={reservation.image} alt={reservation.name} className="w-16 h-16 rounded mr-4" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{reservation.name}</h3>
          <p className="text-sm text-gray-500">{reservation.address}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500"><Calendar size={16} /> {formattedDate}</p>
          <p className="text-sm text-gray-500"><Clock size={16} /> {formattedTime}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          <Users size={16} className="text-gray-500" />
          <span className="ml-1 text-sm">{reservation.guests} invités</span>
        </div>
        <div className={`flex items-center ${reservation.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>
          {reservation.status === 'confirmed' ? (
            <>
              <CheckCircle size={16} /> <span className="ml-1">Confirmé</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} /> <span className="ml-1">En attente</span>
            </>
          )}
        </div>
      </div>
      {reservation.status === 'pending' && (
        <button onClick={() => onPayNow(reservation.id)} className="mt-4 text-sm font-medium text-orange-600 hover:underline">
          Payer maintenant
        </button>
      )}
      {reservation.note && <p className="mt-2 text-sm text-gray-600 italic">Note : {reservation.note}</p>}
    </motion.div>
  );
};

const Spinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-12 w-12 border-b-2 border-orange-500 rounded-full animate-spin" />
  </div>
);

const ErrorMessage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
      <XIcon className="inline-block mr-2" /> Une erreur est survenue lors du chargement des réservations.
    </div>
  </div>
);
