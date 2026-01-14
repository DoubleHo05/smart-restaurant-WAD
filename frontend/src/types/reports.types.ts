export interface DailyRevenueData {
  date: string;
  total_revenue: number;
  total_orders: number;
  subtotal: number;
  tax: number;
}

export interface PopularItem {
  menu_item_id: string;
  name: string;
  category: string;
  total_quantity: number;
  total_revenue: number;
  times_ordered: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
  total_revenue: number;
}

export interface DashboardSummary {
  today_revenue: number;
  today_orders_count: number;
  pending_orders: number;
  preparing_orders: number;
  ready_orders: number;
}

export interface AveragePrepTimeData {
  average_prep_time_minutes: number;
  orders_analyzed: number;
}

export interface GetReportsParams {
  restaurant_id: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  days?: number;
}

// ============================================
// ADVANCED REPORTS TYPES (Task 3.4)
// ============================================

// Revenue by Category
export interface CategoryRevenue {
  category_name: string;
  total_revenue: number;
  total_quantity: number;
  items_count: number;
}

export interface RevenueByCategoryResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  categories: CategoryRevenue[];
  total_revenue: number;
}

// Waiter Performance
export interface WaiterStats {
  waiter_id: string;
  waiter_name: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface WaiterPerformanceResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  waiters: WaiterStats[];
  total_waiters: number;
  total_revenue: number;
}

// Kitchen Efficiency
export interface PrepTimeRange {
  time_range: string;
  order_count: number;
  percentage: number;
}

export interface KitchenEfficiencyResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  average_prep_time_minutes: number;
  total_orders: number;
  orders_by_prep_time: PrepTimeRange[];
}

// Customer Retention
export interface CustomerStats {
  customer_id: string | null;
  order_count: number;
  total_spent: number;
  avg_order_value: number;
  first_order_date: string;
  last_order_date: string;
}

export interface CustomerRetentionResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_customers: number;
    new_customers: number;
    returning_customers: number;
    retention_rate: string | number; // Can be "X%" or number
  };
  top_customers: CustomerStats[];
  average_orders_per_customer: string | number; // Can be "X" or number
}

// Peak Hours
export interface HourlyStats {
  hour: number;
  order_count: number;
  total_revenue: number;
}

export interface PeakHoursResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  peak_hour: {
    hour: number;
    order_count: number;
    total_revenue: number;
  };
  hourly_breakdown: HourlyStats[];
}
