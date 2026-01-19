import axiosInstance from "./axiosConfig";

export interface OrderModifier {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  modifiers?: OrderModifier[];
  status?: "QUEUED" | "COOKING" | "READY" | "REJECTED";
  rejection_reason?: string;
}

export interface WaiterOrder {
  id: string;
  order_number: string;
  table_id: string;
  table_number?: string;
  customer_id?: string;
  customer_name?: string;
  status: string;
  total_price: number;
  special_instructions?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PendingOrdersParams {
  restaurant_id: string;
  table_id?: string;
}

export interface RejectOrderDto {
  restaurant_id: string;
  rejection_reason: string;
}

export interface AcceptOrderDto {
  restaurant_id: string;
}

// Get pending orders for waiter
export const getPendingOrders = async (
  params: PendingOrdersParams,
): Promise<WaiterOrder[]> => {
  const response = await axiosInstance.get("/api/waiter/pending-orders", {
    params,
  });
  return response.data;
};

// Accept an order
export const acceptOrder = async (
  orderId: string,
  data: AcceptOrderDto,
): Promise<WaiterOrder> => {
  const response = await axiosInstance.post(
    `/api/waiter/${orderId}/accept?restaurant_id=${data.restaurant_id}`,
  );
  return response.data;
};

// Reject an order
export const rejectOrder = async (
  orderId: string,
  data: RejectOrderDto,
): Promise<WaiterOrder> => {
  const response = await axiosInstance.post(
    `/api/waiter/${orderId}/reject?restaurant_id=${data.restaurant_id}`,
    { reason: data.rejection_reason },
  );
  return response.data.data || response.data;
};

// Mark order as served
export const serveOrder = async (
  orderId: string,
  restaurantId: string,
): Promise<WaiterOrder> => {
  const response = await axiosInstance.post(
    `/api/waiter/${orderId}/serve?restaurant_id=${restaurantId}`,
  );
  return response.data.data || response.data;
};

// Complete an order (paid at counter)
export const completeOrder = async (
  orderId: string,
  restaurantId: string,
): Promise<WaiterOrder> => {
  const response = await axiosInstance.post(
    `/api/waiter/${orderId}/complete?restaurant_id=${restaurantId}`,
  );
  return response.data.data || response.data;
};

// Get all restaurant orders (for waiter)
export const getRestaurantOrders = async (
  restaurantId: string,
  status?: string,
): Promise<WaiterOrder[]> => {
  const params: any = { restaurant_id: restaurantId };
  if (status) params.status = status;
  const response = await axiosInstance.get("/api/waiter/orders", { params });
  return response.data;
};

export interface WaiterPerformance {
  waiter_id: string;
  waiter_name: string;
  today_stats: {
    orders_accepted: number;
    orders_rejected: number;
    orders_served: number;
    average_service_time_minutes: number;
  };
  week_stats: {
    total_orders: number;
    acceptance_rate: number;
    rejection_rate: number;
    average_daily_orders: number;
  };
  all_time_stats: {
    total_orders_served: number;
    total_orders_accepted: number;
    total_orders_rejected: number;
  };
}

export interface LeaderboardEntry {
  waiter_id: string;
  waiter_name: string;
  orders_served: number;
  acceptance_rate: number;
  average_service_time: number;
  rank: number;
}

// Get waiter performance stats
export const getWaiterPerformance = async (
  waiterId: string,
  restaurantId: string,
): Promise<WaiterPerformance> => {
  const response = await axiosInstance.get(
    `/api/waiter/performance/${waiterId}`,
    {
      params: { restaurant_id: restaurantId },
    },
  );
  return response.data.data;
};

// Get leaderboard (all waiters performance)
export const getWaiterLeaderboard = async (
  restaurantId: string,
): Promise<LeaderboardEntry[]> => {
  const response = await axiosInstance.get("/api/waiter/leaderboard", {
    params: { restaurant_id: restaurantId },
  });
  return response.data.data;
};

// Reject individual order item
export const rejectOrderItem = async (
  orderId: string,
  itemId: string,
  reason?: string,
): Promise<WaiterOrder> => {
  const response = await axiosInstance.post(
    `/api/orders/${orderId}/items/${itemId}/reject`,
    { reason },
  );
  return response.data;
};
