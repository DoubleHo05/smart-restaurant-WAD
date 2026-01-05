import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  prepTimeMinutes: number;
  status: string;
  isChefRecommended: boolean;
  category: {
    id: string;
    name: string;
  };
  primaryPhoto?: string | null;
  photos?: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
  modifierGroups?: Array<{
    id: string;
    name: string;
  }>;
  modifierGroupsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemData {
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  prep_time_minutes?: number;
  status: string;
  is_chef_recommended?: boolean;
  modifier_group_ids?: string[];
}

export interface UpdateMenuItemData {
  category_id?: string;
  name?: string;
  description?: string;
  price?: number;
  prep_time_minutes?: number;
  status?: string;
  is_chef_recommended?: boolean;
  modifier_group_ids?: string[];
}

export interface MenuItemFilters {
  search?: string;
  category_id?: string;
  status?: string;
  is_chef_recommended?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface MenuItemsResponse {
  data: MenuItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const menuItemsApi = {
  /**
   * Get all menu items with filters
   */
  async getAll(
    restaurantId: string,
    filters?: MenuItemFilters
  ): Promise<MenuItemsResponse> {
    const params = new URLSearchParams();
    params.append("restaurant_id", restaurantId);

    if (filters?.search) params.append("search", filters.search);
    if (filters?.category_id) params.append("category_id", filters.category_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.is_chef_recommended)
      params.append("is_chef_recommended", filters.is_chef_recommended);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/api/admin/menu/items?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single menu item by ID
   */
  async getOne(id: string): Promise<MenuItem> {
    const response = await axios.get(`${API_BASE_URL}/api/admin/menu/items/${id}`);
    return response.data;
  },

  /**
   * Create a new menu item
   */
  async create(data: CreateMenuItemData): Promise<MenuItem> {
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/menu/items`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing menu item
   */
  async update(id: string, data: UpdateMenuItemData): Promise<MenuItem> {
    const response = await axios.put(
      `${API_BASE_URL}/api/admin/menu/items/${id}`,
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
    const response = await axios.patch(
      `${API_BASE_URL}/api/admin/menu/items/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Delete a menu item (soft delete)
   */
  async delete(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(
      `${API_BASE_URL}/api/admin/menu/items/${id}`
    );
    return response.data;
  },
};
