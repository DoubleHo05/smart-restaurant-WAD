import api from './axiosConfig';

export interface PaymentMethod {
  id: string;
  code: string;
  name: string;
  description?: string;
  logo_url?: string;
  display_order: number;
}

export interface Payment {
  id: string;
  order_id?: string;
  bill_request_id?: string;
  payment_method_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway_request_id?: string;
  gateway_trans_id?: string;
  gateway_response?: any;
  received_by?: string;
  cash_amount?: number;
  change_amount?: number;
  notes?: string;
  completed_at?: string;
  failed_reason?: string;
  refund_reason?: string;
  refunded_at?: string;
  refunded_by?: string;
  created_at: string;
  updated_at: string;
  merged_order_ids?: string[];
  tips_amount?: number;
  payment_method?: {
    id: string;
    code: string;
    name: string;
    description?: string;
    logo_url?: string;
    is_active: boolean;
  };
}

export interface VNPayReturnResponse {
  success: boolean;
  payment_id?: string;
  amount?: number;
  response_code?: string;
  transaction_no?: string;
  error?: string;
  RspCode?: string;
  Message?: string;
}

export interface CashConfirmDto {
  payment_id: string;
  received_amount: number;
  waiter_id?: string;
}

export interface ListPaymentsDto {
  status?: string;
  payment_method_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

const paymentsApi = {
  // Get all active payment methods (Public)
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get('/payment-methods');
    return response.data;
  },

  // Verify VNPay payment result (called from return URL)
  verifyVNPayReturn: async (queryParams: Record<string, string>): Promise<VNPayReturnResponse> => {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await api.get(`/payments/vnpay/return?${queryString}`);
    return response.data;
  },

  // Confirm cash payment (waiter only)
  confirmCashPayment: async (data: CashConfirmDto): Promise<Payment> => {
    const response = await api.post('/payments/cash/confirm', data);
    return response.data;
  },

  // Get payment details by ID
  getPaymentDetail: async (paymentId: string): Promise<Payment> => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  // List all payments with filters (admin only)
  listPayments: async (params: ListPaymentsDto): Promise<{
    data: Payment[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Get revenue by payment method (admin only)
  getRevenueByMethod: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get('/payments/analytics/revenue-by-method', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};

export default paymentsApi;
