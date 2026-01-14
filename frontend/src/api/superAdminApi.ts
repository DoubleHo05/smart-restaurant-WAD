import axiosInstance from "./axiosConfig";

/**
 * Super Admin API Client
 * For Task 3.3 - Super Admin Backend
 */

export interface SystemStats {
  restaurants: {
    total: number;
    active: number;
    inactive: number;
  };
  users: {
    total: number;
    active: number;
    by_role: Array<{
      role: string;
      count: number;
    }>;
  };
  orders: {
    total: number;
    today: number;
    growth_vs_yesterday: number;
  };
  revenue: {
    total: number;
    today: number;
    last_7_days: number;
    growth_vs_yesterday: number;
  };
  payments: {
    by_status: Array<{
      status: string;
      count: number;
      amount: number;
    }>;
  };
}

export interface RestaurantWithStats {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  owner: {
    id: string;
    email: string;
    full_name: string | null;
    status: string;
  };
  stats: {
    total_orders: number;
    total_revenue: number;
    tables_count: number;
    categories_count: number;
    active_menu_items: number;
  };
}

export interface RestaurantDetails extends RestaurantWithStats {
  tables: any[];
  menu_categories: any[];
  statistics: {
    orders: {
      total: number;
      completed: number;
      completion_rate: string;
    };
    revenue: {
      total: number;
      average_order_value: number;
    };
    menu: {
      total_categories: number;
      total_items: number;
    };
    top_selling_items: Array<{
      name: string;
      category: string;
      total_sold: number;
      revenue: number;
    }>;
  };
}

export const superAdminApi = {
  /**
   * GET /api/super-admin/stats
   * Get system-wide statistics
   */
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await axiosInstance.get<SystemStats>(
      "/api/super-admin/stats"
    );
    return response.data;
  },

  /**
   * GET /api/super-admin/restaurants
   * Get all restaurants with statistics
   */
  getAllRestaurants: async (): Promise<RestaurantWithStats[]> => {
    const response = await axiosInstance.get<RestaurantWithStats[]>(
      "/api/super-admin/restaurants"
    );
    return response.data;
  },

  /**
   * GET /api/super-admin/restaurants/:id
   * Get restaurant details with full statistics
   */
  getRestaurantDetails: async (
    restaurantId: string
  ): Promise<RestaurantDetails> => {
    const response = await axiosInstance.get<RestaurantDetails>(
      `/api/super-admin/restaurants/${restaurantId}`
    );
    return response.data;
  },
};
