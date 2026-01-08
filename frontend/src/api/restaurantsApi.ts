import axiosInstance from "./axiosConfig";
import type {
  Restaurant,
  CreateRestaurantData,
  UpdateRestaurantData,
} from "../types/restaurant.types";

export const restaurantsApi = {
  // Get all restaurants (admin sees owned, super_admin sees all)
  getAll: async () => {
    const response = await axiosInstance.get<Restaurant[]>(
      "/api/admin/restaurants"
    );
    return response.data;
  },

  // Get single restaurant
  getOne: async (id: string) => {
    const response = await axiosInstance.get<Restaurant>(
      `/api/admin/restaurants/${id}`
    );
    return response.data;
  },

  // Create restaurant
  create: async (data: CreateRestaurantData) => {
    const response = await axiosInstance.post<Restaurant>(
      "/api/admin/restaurants",
      data
    );
    return response.data;
  },

  // Update restaurant
  update: async (id: string, data: UpdateRestaurantData) => {
    const response = await axiosInstance.put<Restaurant>(
      `/api/admin/restaurants/${id}`,
      data
    );
    return response.data;
  },

  // Delete restaurant (soft delete)
  delete: async (id: string) => {
    await axiosInstance.delete(`/api/admin/restaurants/${id}`);
  },
};
