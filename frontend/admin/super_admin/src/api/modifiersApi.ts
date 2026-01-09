import axiosInstance from "./axiosConfig";

import {
  ModifierGroup,
  ModifierOption,
  CreateModifierGroupData,
  UpdateModifierGroupData,
  UpdateModifierOptionData,
  CreateModifierOptionData,
} from "../types/modifiers.types";
// Types

// API Methods
export const modifiersApi = {
  // ━━━ GROUPS ━━━

  // Get all groups
  getAllGroups: async (filters?: {
    status?: string;
    includeOptions?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.includeOptions)
      params.append("includeOptions", filters.includeOptions.toString());

    const response = await axiosInstance.get<ModifierGroup[]>(
      `/api/admin/menu/modifier-groups?${params.toString()}`
    );
    return response.data;
  },

  // Get single group
  getGroup: async (id: string) => {
    const response = await axiosInstance.get<ModifierGroup>(
      `/api/admin/menu/modifier-groups/${id}`
    );
    return response.data;
  },

  // Create group
  createGroup: async (data: CreateModifierGroupData) => {
    const response = await axiosInstance.post<ModifierGroup>(
      "/api/admin/menu/modifier-groups",
      data
    );
    return response.data;
  },

  // Update group
  updateGroup: async (id: string, data: UpdateModifierGroupData) => {
    const response = await axiosInstance.put<ModifierGroup>(
      `/api/admin/menu/modifier-groups/${id}`,
      data
    );
    return response.data;
  },

  // ━━━ OPTIONS ━━━

  // Create option
  createOption: async (groupId: string, data: CreateModifierOptionData) => {
    const response = await axiosInstance.post<ModifierOption>(
      `/api/admin/menu/modifier-groups/${groupId}/options`,
      data
    );
    return response.data;
  },

  // Get option
  getOption: async (id: string) => {
    const response = await axiosInstance.get<ModifierOption>(
      `/api/admin/menu/modifier-options/${id}`
    );
    return response.data;
  },

  // Update option
  updateOption: async (id: string, data: UpdateModifierOptionData) => {
    const response = await axiosInstance.put<ModifierOption>(
      `/api/admin/menu/modifier-options/${id}`,
      data
    );
    return response.data;
  },

  // Delete option
  deleteOption: async (id: string) => {
    await axiosInstance.delete(`/api/admin/menu/modifier-options/${id}`);
  },
};
