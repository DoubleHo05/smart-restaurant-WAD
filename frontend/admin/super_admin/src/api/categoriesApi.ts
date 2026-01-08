import axiosInstance from "./axiosConfig";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../types/categories.types";
// Types

// API Methods
export const categoriesApi = {
  // Get all categories
  getAll: async (filters?: { status?: string; sortBy?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);

    const response = await axiosInstance.get<Category[]>(
      `/api/admin/menu/categories?${params.toString()}`
    );
    return response.data;
  },

  // Get single category
  getOne: async (id: string) => {
    const response = await axiosInstance.get<Category>(
      `/api/admin/menu/categories/${id}`
    );
    return response.data;
  },

  // Create category
  create: async (data: CreateCategoryData) => {
    const response = await axiosInstance.post<Category>(
      "/api/admin/menu/categories",
      data
    );
    return response.data;
  },

  // Update category
  update: async (id: string, data: UpdateCategoryData) => {
    const response = await axiosInstance.put<Category>(
      `/api/admin/menu/categories/${id}`,
      data
    );
    return response.data;
  },

  // Update status
  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<Category>(
      `/api/admin/menu/categories/${id}/status`,
      { status }
    );
    return response.data;
  },

  // Delete category
  delete: async (id: string) => {
    await axiosInstance.delete(`/api/admin/menu/categories/${id}`);
  },
};
