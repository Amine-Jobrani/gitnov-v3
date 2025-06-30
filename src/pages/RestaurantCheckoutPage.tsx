import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Users, Loader2, MapPin, Star, Globe } from 'lucide-react';

import { restaurantService } from '../services/restaurant';
import { restaurantReservationService } from '../services/restaurantReservation';
import { useAuth } from '../context/AuthContext';

export const RestaurantCheckoutPage: React.FC = () => {
    const { slug = '' } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: restaurant, isLoading, isError } = useQuery({
        queryKey: ['restaurant', slug],
        queryFn: () => restaurantService.getBySlug(slug),
        enabled: !!slug,
    });
    
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [guests, setGuests] = useState(2);
    const [note, setNote] = useState('');

    const today = new Date().toISOString().split('T')[0];
    const timeSlots = [
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
    ];

    const mutation = useMutation({
        mutationFn: () =>
            restaurantReservationService.create({
                restaurantId: restaurant!.id,
                reservationDate: date,
                reservationTime: time,
                numberOfGuests: guests,
                note,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations', 'restaurants', 'me'] });
            navigate('/reservations/restaurants/me');
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
            </div>
        );
    }

    if (isError || !restaurant) {
        return (
            <div className="text-center text-red-600 py-12">
                Erreur de chargement du restaurant.
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">
            <h1 className="text-3xl font-bold text-gray-900">
                Réserver chez <span className="text-orange-600">{restaurant.name}</span>
            </h1>

            {/* Restaurant Info Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        {restaurant.address}, {restaurant.city}
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        Prix moyen : {restaurant.average_price} MAD
                    </div>
                    {restaurant.website_url && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-orange-500" />
                            <a
                                href={restaurant.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:underline"
                            >
                                Site web
                            </a>
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-600">{restaurant.description}</p>
            </div>

            {/* Reservation Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setTime(slot)}
                                className={`py-2 px-3 text-sm rounded-lg border transition-colors ${time === slot
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                                    }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <option key={n} value={n}>
                                    {n} personne{n > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note (facultatif)</label>
                    <textarea
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                        placeholder="Allergies, occasions spéciales, etc."
                    />
                </div>

                <button
                    onClick={() => mutation.mutate()}
                    disabled={!date || !time || mutation.isPending}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                    {mutation.isPending ? 'Réservation en cours…' : 'Confirmer la réservation'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    Annulation gratuite jusqu’à 2 h avant l’heure prévue
                </p>
            </div>
        </div>
    );
};
