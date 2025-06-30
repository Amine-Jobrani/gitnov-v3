import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';

import { useAuth } from '../context/AuthContext';
import { useCreateEventReservation } from '../hooks/useCreateEventReservation';
import { FullEvent } from '../services/types';

// Load Stripe key from environment
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripeKey) throw new Error('VITE_STRIPE_PUBLIC_KEY is missing');
const stripePromise = loadStripe(stripeKey);

type LocationState = { event?: FullEvent };
const safeFmt = (d?: string | Date | null, fmt = 'dd MMMM yyyy') =>
  d ? format(new Date(d), fmt, { locale: fr }) : '–';

interface ReservationDataWithSecret {
  message?: string;
  reservation: any;
  clientSecret?: string;
}

// ─────────────────────────────────────────────
// Main export: wraps internal logic with Stripe <Elements>
// ─────────────────────────────────────────────
const ReservationCheckoutPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <ReservationCheckoutInner />
    </Elements>
  );
};

const ReservationCheckoutInner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const stripe = useStripe();
  const elements = useElements();

  const stateEvent = (location.state as LocationState | null)?.event;
  const cachedEvents = queryClient.getQueryData<FullEvent[]>(['events', {}]);
  const cachedEvent = cachedEvents?.find((e) => e.id === Number(id));

  const [event] = useState<FullEvent | undefined>(stateEvent ?? cachedEvent);
  const [loading, setLoading] = useState(!event);
  const [step, setStep] = useState<'reserve' | 'pay' | 'done'>('reserve');
  const [payLoading, setPayLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { mutate: createReservation, status: reserveStatus } =
    useCreateEventReservation();
  const isReserving = reserveStatus === 'pending';

  const planner = event?.planifications?.[0];

  useEffect(() => {
    setLoading(!event);
  }, [event]);

  const handleReserve = () => {
    if (!planner) return alert('Aucune planification disponible.');

    createReservation(
      {
        plannerId: planner.id,
        numberOfGuests: 1,
        confirmationMethod: 'email',
      },
      {
        onSuccess: ({ data }) => {
          const { clientSecret } = data as ReservationDataWithSecret;
          if (clientSecret) {
            setClientSecret(clientSecret);
            setStep('pay');
          } else {
            alert('Erreur: clientSecret manquant.');
          }
        },
        onError: (err) => {
          console.error(err);
          alert('Échec de la réservation.');
        },
      }
    );
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setPayLoading(true);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });
      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setStep('done');
      }
    } catch (err) {
      alert('Le paiement a échoué.');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading || !event)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-b-transparent rounded-full animate-spin" />
      </div>
    );

  const start = planner?.startDate;
  const end = planner?.endDate;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-3xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Réservation – {event.title}
        </h1>

        <div className="space-y-4 text-gray-700">
          <DetailRow icon={Calendar} label="Date" value={safeFmt(start, 'EEEE dd MMMM yyyy')} />
          <DetailRow icon={Clock} label="Heure" value={`${safeFmt(start, 'HH:mm')} – ${safeFmt(end, 'HH:mm')}`} />
          <DetailRow icon={MapPin} label="Adresse" value={`${event.address}, ${event.city}`} />
          <DetailRow icon={Users} label="Participants" value="1 personne" />
        </div>

        {(step === 'reserve' || step === 'pay') && (
          <div className="space-y-6">
            <button
              onClick={handleReserve}
              disabled={isReserving}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition disabled:opacity-50"
            >
              {isReserving ? 'Réservation en cours…' : 'Confirmer la réservation'}
            </button>

            {step === 'pay' && (
              <div className="border-t pt-4 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Paiement</h2>
                <div className="p-4 border rounded-xl bg-gray-50">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#333',
                          '::placeholder': { color: '#aaa' },
                        },
                        invalid: { color: '#e53e3e' },
                      },
                    }}
                  />
                </div>
                <button
                  onClick={handlePayment}
                  disabled={payLoading}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  {payLoading ? 'Paiement…' : 'Payer maintenant'}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Merci !</h2>
            <p className="text-gray-700">Votre réservation et paiement ont été confirmés.</p>
            <button
              onClick={() => navigate('/reservations/events/me')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
            >
              Voir mes réservations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface DetailRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl">
      <Icon className="w-5 h-5 text-orange-600" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  </div>
);

export default ReservationCheckoutPage;
export { ReservationCheckoutPage, ReservationCheckoutInner };