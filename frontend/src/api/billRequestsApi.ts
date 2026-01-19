import api from "./axiosConfig";

export interface BillRequest {
  id: string;
  restaurant_id: string;
  table_id: string;
  payment_method_code: string;
  subtotal: number;
  tips_amount: number;
  total_amount: number;
  order_ids: string[];
  customer_note?: string;
  status: string;
  accepted_by?: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
  payment_method?: {
    id: string;
    code: string;
    name: string;
    logo_url?: string;
  };
  orders?: any[];
  tables?: {
    id: string;
    table_number: string;
    location?: string;
  };
  restaurants?: {
    id: string;
    name: string;
  };
}

export interface CreateBillRequestDto {
  table_id: string;
  payment_method_code: string;
  tips_amount?: number;
  customer_note?: string;
}

export const billRequestsApi = {
  /**
   * Create a new bill request
   */
  create: async (data: CreateBillRequestDto): Promise<BillRequest> => {
    const response = await api.post("/api/bill-requests", data);
    return response.data;
  },

  /**
   * Get bill request details
   */
  get: async (id: string): Promise<BillRequest> => {
    const response = await api.get(`/api/bill-requests/${id}`);
    return response.data;
  },

  /**
   * Get active bill request for a table
   */
  getActiveByTable: async (tableId: string): Promise<BillRequest | null> => {
    const response = await api.get(
      `/api/bill-requests/table/${tableId}/active`,
    );
    return response.data;
  },

  /**
   * Get all bill requests for a restaurant
   */
  getByRestaurant: async (restaurantId: string): Promise<BillRequest[]> => {
    const response = await api.get(
      `/api/bill-requests/restaurant/${restaurantId}`,
    );
    return response.data;
  },

  /**
   * Accept bill request (waiter)
   */
  accept: async (id: string, acceptedBy?: string): Promise<any> => {
    const response = await api.post(
      `/api/bill-requests/${id}/accept`,
      acceptedBy ? { accepted_by: acceptedBy } : {},
    );
    return response.data;
  },

  /**
   * Reject bill request (waiter)
   */
  reject: async (id: string, reason: string): Promise<{ message: string }> => {
    const response = await api.post(`/api/bill-requests/${id}/reject`, {
      rejection_reason: reason,
    });
    return response.data;
  },

  /**
   * Cancel bill request
   */
  cancel: async (id: string): Promise<{ message: string }> => {
    const response = await api.patch(`/api/bill-requests/${id}/cancel`);
    return response.data;
  },

  /**
   * Complete cash payment (waiter)
   */
  completeCashPayment: async (
    billRequestId: string,
    receivedAmount: number,
  ): Promise<{
    success: boolean;
    message: string;
    payment_id: string;
    bill_request_id: string;
  }> => {
    const response = await api.post(
      `/api/bill-requests/${billRequestId}/complete-cash`,
      { received_amount: receivedAmount },
    );
    return response.data;
  },
};

export default billRequestsApi;
