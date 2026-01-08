export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  owner_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    email: string;
    full_name?: string;
  };
  _count?: {
    tables: number;
    menu_categories: number;
  };
}

export interface CreateRestaurantData {
  name: string;
  address?: string;
  phone?: string;
  ownerId?: string;
}

export interface UpdateRestaurantData {
  name?: string;
  address?: string;
  phone?: string;
  status?: string;
}
