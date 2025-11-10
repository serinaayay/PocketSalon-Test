import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from './productRecommendations';

const FAVORITES_KEY = '@favorites';

export const getFavorites = async (): Promise<Product[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    if (favoritesJson) {
      return JSON.parse(favoritesJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = async (product: Product): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.id === product.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, product];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

export const removeFavorite = async (productId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== productId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

export const isFavorite = async (productId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.id === productId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

