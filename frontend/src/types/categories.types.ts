export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  display_order: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  itemCount?: number;
}

export interface CreateCategoryData {
  restaurant_id: string;
  name: string;
  description?: string;
  display_order?: number;
  status?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  display_order?: number;
  status?: string;
}
