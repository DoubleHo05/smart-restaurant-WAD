import axiosInstance from "./axiosConfig";
import type { User, CreateUserData, UpdateUserData } from "../types/user.types";

export const usersApi = {
  // Get all users (super_admin, admin)
  getAll: async (roleFilter?: string) => {
    const params = new URLSearchParams();
    if (roleFilter) params.append("role", roleFilter);
    
    const response = await axiosInstance.get<User[]>(
      `/users?${params.toString()}`
    );
    return response.data;
  },

  // Get single user
  getOne: async (id: string) => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create user (super_admin only)
  create: async (data: CreateUserData) => {
    const response = await axiosInstance.post<User>("/users", data);
    return response.data;
  },

  // Update user
  update: async (id: string, data: UpdateUserData) => {
    const response = await axiosInstance.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  // Delete user (super_admin only)
  delete: async (id: string) => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
