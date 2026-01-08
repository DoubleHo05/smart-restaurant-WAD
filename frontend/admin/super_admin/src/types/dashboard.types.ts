export interface DashboardStats {
  todayRevenue: number;
  ordersToday: number;
  tablesOccupied: number;
  totalTables: number;
  avgPrepTime: number;
  revenueChange: number; // percentage
  ordersChange: number; // percentage
}

export interface TopSellingItem {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  category?: string;
}

export interface RevenueChartData {
  day: string;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  table: string;
  items: number;
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  created_at: string;
}
