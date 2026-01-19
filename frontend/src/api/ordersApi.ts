import api from "./axiosConfig";

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
  status?: "QUEUED" | "COOKING" | "READY" | "REJECTED";
  rejection_reason?: string;
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

// DTO for creating orders (matches backend expectations)
export interface CreateOrderItemDto {
  menu_item_id: string;
  quantity: number;
  special_requests?: string;
  modifiers?: Array<{
    modifier_option_id: string;
  }>;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id: string;
  customer_id?: string;
  guest_name?: string;
  order_number: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  total_price?: number; // Alias for total
  discount?: number;
  special_requests?: string;
  special_instructions?: string; // Alias for special_requests
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  preparing_at?: string;
  ready_at?: string;
  served_at?: string;
  completed_at?: string;
  table?: Table;
  order_items?: OrderItem[];
  items?: OrderItem[]; // Alias for order_items
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
    restaurant_id: string;
    table_id: string;
    customer_id?: string;
    guest_name?: string;
    session_id?: string;
    items: CreateOrderItemDto[];
    special_requests?: string;
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

  // Get my orders (for logged-in customer)
  async getMyOrders(params?: {
    status?: string;
    limit?: number;
    date?: string;
  }): Promise<{ data: Order[]; total: number }> {
    try {
      const response = await api.get('/api/orders/my-orders', {
        params: {
          status: params?.status,
          limit: params?.limit,
          date: params?.date,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching my orders:", error);
      throw error;
    }
  },

  // Complete an order (verify payment, release table, archive)
  async complete(id: string): Promise<{
    message: string;
    order: Order;
    tableReleased: boolean;
    tableId: string;
    tableNumber: string;
  }> {
    try {
      const response = await api.post(`/api/orders/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error("Error completing order:", error);
      throw error;
    }
  },

  // Get order history with advanced filters and CSV export
  async getHistory(params?: {
    restaurant_id?: string;
    start_date?: string;
    end_date?: string;
    customer_id?: string;
    table_id?: string;
    status?: string;
    export?: "csv";
  }): Promise<any> {
    try {
      const response = await api.get("/api/orders/history", {
        params,
        responseType: params?.export === "csv" ? "text" : "json",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order history:", error);
      throw error;
    }
  },

  async getOrderStatus(orderId: string): Promise<any> {
    try {
      const response = await api.get(`/api/orders/${orderId}/status`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order status:", error);
      throw error;
    }
  },

  async getOrderById(orderId: string): Promise<any> {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },

  async addItemsToOrder(orderId: string, items: any[]): Promise<any> {
    try {
      const response = await api.post(`/api/orders/${orderId}/add-items`, {
        items,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding items to order:", error);
      throw error;
    }
  },
};

export default ordersApi;
