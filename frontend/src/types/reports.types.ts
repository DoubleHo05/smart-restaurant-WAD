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
