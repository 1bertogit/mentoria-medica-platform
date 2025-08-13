'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';

export interface FavoriteItem {
  id: string;
  type: 'article' | 'case' | 'course' | 'archive';
  title: string;
  url: string;
  addedAt: string;
  metadata?: {
    author?: string;
    specialty?: string;
    thumbnail?: string;
    description?: string;
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mentoria-favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      logger.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('mentoria-favorites', JSON.stringify(favorites));
      } catch (error) {
        logger.error('Error saving favorites:', error);
      }
    }
  }, [favorites, isLoading]);

  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const newItem: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };
    
    setFavorites(prev => [newItem, ...prev]);
  };

  const removeFavorite = (id: string, type: FavoriteItem['type']) => {
    setFavorites(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const toggleFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const exists = favorites.some(fav => fav.id === item.id && fav.type === item.type);
    
    if (exists) {
      removeFavorite(item.id, item.type);
    } else {
      addFavorite(item);
    }
  };

  const isFavorite = (id: string, type: FavoriteItem['type']) => {
    return favorites.some(item => item.id === id && item.type === type);
  };

  const getFavoritesByType = (type: FavoriteItem['type']) => {
    return favorites.filter(item => item.type === type);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
    count: favorites.length,
  };
}