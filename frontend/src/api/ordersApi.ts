import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaces matching backend Prisma schema
export interface OrderItemModifier {
  id: string;
  modifier_option_id: string;
  price_adjustment: number;
  modifier_option?: {
    id: string;
    name: string;
    price_adjustment: number;
  };
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_requests?: string;
  menu_item?: {
    id: string;
    name: string;
    description?: string;
    price: number;
  };
  modifiers?: OrderItemModifier[];
}

export interface Table {
  id: string;
  table_number: string;
  location?: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id: string;
  customer_id?: string;
  order_number: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  preparing_at?: string;
  ready_at?: string;
  served_at?: string;
  completed_at?: string;
  table?: Table;
  order_items?: OrderItem[];
}

export interface GetOrdersParams {
  status?: string;
  restaurant_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
}

export const ordersApi = {
  // Get all orders with filters
  async getAll(params?: GetOrdersParams): Promise<OrdersResponse | Order[]> {
    try {
      const response = await api.get("/api/orders", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get single order by ID
  async getById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create new order
  async create(orderData: {
    table_id: string;
    customer_id?: string;
    items: OrderItem[];
    special_instructions?: string;
  }): Promise<Order> {
    try {
      const response = await api.post("/api/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order status
  async updateStatus(id: string, status: string): Promise<Order> {
    try {
      const response = await api.patch(`/api/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Update order
  async update(id: string, orderData: Partial<Order>): Promise<Order> {
    try {
      const response = await api.patch(`/api/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Delete order
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/orders/${id}`);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  // Get orders by table
  async getByTable(tableId: string): Promise<Order[]> {
    try {
      const response = await api.get(`/api/orders/table/${tableId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by table:", error);
      throw error;
    }
  },

  // Get orders by customer
  async getByCustomer(customerId: string): Promise<Order[]> {
    try {
      const response = await api.get(`/api/orders/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by customer:", error);
      throw error;
    }
  },
};
