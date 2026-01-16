import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface RestaurantStaff {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: "waiter" | "kitchen";
  status: string;
  created_at: string;
  updated_at: string;
  restaurant?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
  };
  user?: {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
  };
}

export interface CreateRestaurantStaffData {
  restaurant_id: string;
  user_id: string;
  role: "waiter" | "kitchen";
  status?: string;
}

export interface UpdateRestaurantStaffData {
  role?: "waiter" | "kitchen";
  status?: string;
}

export const restaurantStaffApi = {
  getAll: async (restaurantId?: string): Promise<RestaurantStaff[]> => {
    const token = localStorage.getItem("auth_token");
    const params = restaurantId ? { restaurant_id: restaurantId } : {};
    const response = await axios.get(`${API_URL}/restaurant-staff`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  },

  getOne: async (id: string): Promise<RestaurantStaff> => {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get(`${API_URL}/restaurant-staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getByUserId: async (userId: string): Promise<RestaurantStaff[]> => {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get(
      `${API_URL}/restaurant-staff/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getMyRestaurant: async (): Promise<RestaurantStaff | null> => {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get(
      `${API_URL}/restaurant-staff/my-restaurant`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  create: async (data: CreateRestaurantStaffData): Promise<RestaurantStaff> => {
    const token = localStorage.getItem("auth_token");
    const response = await axios.post(`${API_URL}/restaurant-staff`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateRestaurantStaffData
  ): Promise<RestaurantStaff> => {
    const token = localStorage.getItem("auth_token");
    const response = await axios.put(
      `${API_URL}/restaurant-staff/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("auth_token");
    await axios.delete(`${API_URL}/restaurant-staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
