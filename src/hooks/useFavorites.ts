import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from './useLocalStorage';

interface FavoriteItem {
  id: number;
  type: 'event' | 'restaurant';
  addedAt: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>('casavibes_favorites', []);

  const addToFavorites = (id: number, type: 'event' | 'restaurant') => {
    if (!user) return false;
    
    const newFavorite: FavoriteItem = {
      id,
      type,
      addedAt: new Date().toISOString(),
    };
    
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === id && fav.type === type);
      if (exists) return prev;
      return [...prev, newFavorite];
    });
    
    return true;
  };

  const removeFromFavorites = (id: number, type: 'event' | 'restaurant') => {
    setFavorites((prev) => prev.filter((fav) => !(fav.id === id && fav.type === type)));
  };

  const isFavorite = (id: number, type: 'event' | 'restaurant') => {
    return favorites.some((fav) => fav.id === id && fav.type === type);
  };

  const getFavoritesByType = (type: 'event' | 'restaurant') => {
    return favorites.filter((fav) => fav.type === type);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByType,
  };
}