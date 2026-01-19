import axiosInstance from "./axiosConfig";

export interface KitchenOrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  status?: "QUEUED" | "COOKING" | "READY" | "REJECTED";
  rejection_reason?: string;
  menu_item: {
    id: string;
    name: string;
    prep_time_minutes: number;
  };
  modifiers?: Array<{
    id: string;
    modifier_option: {
      id: string;
      name: string;
      price_adjustment: number;
    };
  }>;
}

export interface KitchenOrder {
  id: string;
  order_number: string;
  table_id: string;
  status: string;
  special_instructions?: string;
  created_at: string;
  accepted_at?: string;
  preparing_started_at?: string;
  ready_at?: string;
  table: {
    id: string;
    table_number: string;
    location?: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    prep_time_minutes?: number;
    status?: "QUEUED" | "COOKING" | "READY" | "REJECTED";
    rejection_reason?: string;
    modifiers?: Array<{
      name: string;
    }>;
    special_requests?: string;
  }>;
  time_elapsed?: number;
  estimated_prep_time?: number;
  urgency?: "normal" | "warning" | "critical";
  priority_score?: number;
  delay_minutes?: number;
  is_delayed?: boolean;
}

export interface KitchenOrdersResponse {
  success: boolean;
  data: KitchenOrder[];
}

export interface KitchenStats {
  pending: number;
  cooking: number;
  ready: number;
  overdue: number;
}

// Get all kitchen orders (accepted & preparing)
export const getKitchenOrders = async (
  restaurantId: string,
  tableId?: string,
): Promise<KitchenOrder[]> => {
  const params: any = { restaurant_id: restaurantId };
  if (tableId) params.table_id = tableId;

  const response = await axiosInstance.get<KitchenOrdersResponse>(
    "/api/kitchen/orders",
    { params },
  );
  return response.data.data || [];
};

// Start preparing an order
export const startPreparing = async (
  orderId: string,
  restaurantId: string,
): Promise<KitchenOrder> => {
  const response = await axiosInstance.post(
    `/api/kitchen/orders/${orderId}/start-preparing`,
    {},
    {
      params: { restaurant_id: restaurantId },
    },
  );
  return response.data.data || response.data;
};

// Mark order as ready
export const markReady = async (
  orderId: string,
  restaurantId: string,
): Promise<KitchenOrder> => {
  const response = await axiosInstance.post(
    `/api/kitchen/orders/${orderId}/mark-ready`,
    {},
    {
      params: { restaurant_id: restaurantId },
    },
  );
  return response.data.data || response.data;
};

// Get kitchen statistics
export const getKitchenStats = async (
  restaurantId: string,
): Promise<KitchenStats> => {
  const response = await axiosInstance.get("/api/kitchen/stats", {
    params: { restaurant_id: restaurantId },
  });
  return response.data;
};

// Batch start preparing multiple orders
export const batchStartPreparing = async (
  orderIds: string[],
  restaurantId: string,
): Promise<any> => {
  const response = await axiosInstance.post(
    "/api/kitchen/orders/batch-prepare",
    {
      order_ids: orderIds,
      restaurant_id: restaurantId,
    },
  );
  return response.data;
};

// Get delayed orders (auto-alert feature)
export const getDelayedOrders = async (
  restaurantId: string,
  delayThresholdMinutes?: number,
  tableId?: string,
): Promise<KitchenOrder[]> => {
  const params: any = { restaurant_id: restaurantId };
  if (delayThresholdMinutes !== undefined) {
    params.delay_threshold_minutes = delayThresholdMinutes;
  }
  if (tableId) params.table_id = tableId;

  const response = await axiosInstance.get<KitchenOrdersResponse>(
    "/api/kitchen/delayed-orders",
    { params },
  );
  return response.data.data || [];
};

// Update individual order item status
export const updateItemStatus = async (
  orderId: string,
  itemId: string,
  status: "QUEUED" | "COOKING" | "READY",
): Promise<KitchenOrder> => {
  const response = await axiosInstance.patch(
    `/api/orders/${orderId}/items/${itemId}/status`,
    { status },
  );
  return response.data;
};
