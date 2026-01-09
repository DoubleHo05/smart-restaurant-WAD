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

// Public Menu API
export const getPublicMenu = async (categoryId?: string, searchTerm?: string) => {
  const params = new URLSearchParams();
  if (categoryId) params.append('category', categoryId);
  if (searchTerm) params.append('search', searchTerm);
  
  const response = await api.get(`/api/public/menu?${params.toString()}`);
  return response.data;
};

export const getMenuItem = async (itemId: string) => {
  const response = await api.get(`/api/public/menu/items/${itemId}`);
  return response.data;
};

export const getMenuCategories = async () => {
  const response = await api.get('/api/public/menu/categories');
  return response.data;
};

export default {
  verifyQrToken,
  getPublicMenu,
  getMenuItem,
  getMenuCategories,
};
