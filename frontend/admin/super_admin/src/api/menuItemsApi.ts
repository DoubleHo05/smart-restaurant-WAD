import axiosInstance from "./axiosConfig";
import {
  MenuItem,
  CreateMenuItemData,
  UpdateMenuItemData,
  MenuItemFilters,
  MenuItemsResponse,
} from "../types/menuItems.types";

export const menuItemsApi = {
  /**
   * Get all menu items with filters
   */
  async getAll(filters?: MenuItemFilters): Promise<MenuItemsResponse> {
    const params = new URLSearchParams();

    if (filters?.restaurant_id)
      params.append("restaurant_id", filters.restaurant_id);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category_id) params.append("category_id", filters.category_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.is_chef_recommended)
      params.append("is_chef_recommended", filters.is_chef_recommended);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await axiosInstance.get<MenuItemsResponse>(
      `/api/admin/menu/items?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single menu item by ID
   */
  async getOne(id: string): Promise<MenuItem> {
    const response = await axiosInstance.get<MenuItem>(
      `/api/admin/menu/items/${id}`
    );
    return response.data;
  },

  /**
   * Create a new menu item
   */
  async create(data: CreateMenuItemData): Promise<MenuItem> {
    const response = await axiosInstance.post<MenuItem>(
      "/api/admin/menu/items",
      data
    );
    return response.data;
  },

  /**
   * Update an existing menu item
   */
  async update(id: string, data: UpdateMenuItemData): Promise<MenuItem> {
    const response = await axiosInstance.put<MenuItem>(
      `/api/admin/menu/items/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Update menu item status
   */
  async updateStatus(
    id: string,
    status: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.patch<{
      success: boolean;
      message: string;
    }>(`/api/admin/menu/items/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a menu item (soft delete)
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/api/admin/menu/items/${id}`);
    return response.data;
  },
};
