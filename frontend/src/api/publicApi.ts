import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// QR Access API
export const verifyQrToken = async (token: string) => {
  const response = await api.get(`/api/qr/${token}`);
  return response.data;
};

// Public Restaurants API
export const getPublicRestaurants = async () => {
  const response = await api.get('/api/public/menu/restaurants');
  return response.data;
};

// Public Menu API
export const getPublicMenu = async (
  categoryId?: string,
  searchTerm?: string,
  restaurantId?: string,
  sortBy?: string,
  page?: number,
  limit?: number,
) => {
  const params = new URLSearchParams();
  if (categoryId) params.append('category', categoryId);
  if (searchTerm) params.append('search', searchTerm);
  if (restaurantId) params.append('restaurant', restaurantId);
  if (sortBy) params.append('sortBy', sortBy);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const response = await api.get(`/api/public/menu?${params.toString()}`);
  return response.data;
};

export const getMenuItem = async (itemId: string) => {
  const response = await api.get(`/api/public/menu/items/${itemId}`);
  return response.data;
};

export const getRelatedItems = async (itemId: string) => {
  const response = await api.get(`/api/public/menu/items/${itemId}/related`);
  return response.data;
};

export const getMenuCategories = async (restaurantId?: string) => {
  const params = new URLSearchParams();
  if (restaurantId) params.append('restaurant', restaurantId);

  const response = await api.get(`/api/public/menu/categories?${params.toString()}`);
  return response.data;
};

export default {
  verifyQrToken,
  getPublicRestaurants,
  getPublicMenu,
  getMenuItem,
  getRelatedItems,
  getMenuCategories,
};
