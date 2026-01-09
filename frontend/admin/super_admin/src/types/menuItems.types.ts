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
  restaurant_id?: string;
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
  restaurant_id?: string;
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
