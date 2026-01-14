import axiosInstance from "./axiosConfig";
import type {
  DailyRevenueData,
  PopularItem,
  OrdersByStatus,
  DashboardSummary,
  AveragePrepTimeData,
  RevenueByCategoryResponse,
  WaiterPerformanceResponse,
  KitchenEfficiencyResponse,
  CustomerRetentionResponse,
  PeakHoursResponse,
} from "../types/reports.types";

export const reportsApi = {
  // GET /reports/daily-revenue - Lấy doanh thu theo ngày
  getDailyRevenue: async (
    restaurantId: string,
    startDate: string,
    endDate: string
  ): Promise<DailyRevenueData[]> => {
    const response = await axiosInstance.get<DailyRevenueData[]>(
      "/reports/daily-revenue",
      {
        params: {
          restaurant_id: restaurantId,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  },

  // GET /reports/popular-items - Lấy món ăn phổ biến
  getPopularItems: async (
    restaurantId: string,
    limit = 10,
    days = 30
  ): Promise<PopularItem[]> => {
    const response = await axiosInstance.get<PopularItem[]>(
      "/reports/popular-items",
      {
        params: {
          restaurant_id: restaurantId,
          limit,
          days,
        },
      }
    );
    return response.data;
  },

  // GET /reports/orders-by-status - Lấy đơn hàng theo trạng thái
  getOrdersByStatus: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<OrdersByStatus[]> => {
    const response = await axiosInstance.get<OrdersByStatus[]>(
      "/reports/orders-by-status",
      {
        params: {
          restaurant_id: restaurantId,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  },

  // GET /reports/average-prep-time - Lấy thời gian chuẩn bị trung bình
  getAveragePrepTime: async (
    restaurantId: string,
    days = 7
  ): Promise<AveragePrepTimeData> => {
    const response = await axiosInstance.get<AveragePrepTimeData>(
      "/reports/average-prep-time",
      {
        params: {
          restaurant_id: restaurantId,
          days,
        },
      }
    );
    return response.data;
  },

  // GET /reports/dashboard-summary - Lấy tổng quan dashboard
  getDashboardSummary: async (
    restaurantId: string
  ): Promise<DashboardSummary> => {
    const response = await axiosInstance.get<DashboardSummary>(
      "/reports/dashboard-summary",
      {
        params: {
          restaurant_id: restaurantId,
        },
      }
    );
    return response.data;
  },

  // ============================================
  // ADVANCED REPORTS (Task 3.4)
  // ============================================

  // GET /reports/revenue-by-category - Doanh thu theo danh mục
  getRevenueByCategory: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<RevenueByCategoryResponse> => {
    const response = await axiosInstance.get<RevenueByCategoryResponse>(
      "/reports/revenue-by-category",
      {
        params: {
          restaurant_id: restaurantId,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  },

  // GET /reports/waiter-performance - Hiệu suất phục vụ
  getWaiterPerformance: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<WaiterPerformanceResponse> => {
    const response = await axiosInstance.get<WaiterPerformanceResponse>(
      "/reports/waiter-performance",
      {
        params: {
          restaurant_id: restaurantId,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  },

  // GET /reports/kitchen-efficiency - Hiệu suất bếp
  getKitchenEfficiency: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<KitchenEfficiencyResponse> => {
    const response = await axiosInstance.get<KitchenEfficiencyResponse>(
      "/reports/kitchen-efficiency",
      {
        params: {
          restaurant_id: restaurantId,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  },

  // GET /reports/customer-retention - Khách hàng quay lại
  getCustomerRetention: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CustomerRetentionResponse> => {
    const response = await axiosInstance.get<CustomerRetentionResponse>(
      "/reports/customer-retention",
      {
        params: {
          restaurant_id: restaurantId,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  },

  // GET /reports/peak-hours - Giờ cao điểm
  getPeakHours: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<PeakHoursResponse> => {
    const response = await axiosInstance.get<PeakHoursResponse>(
      "/reports/peak-hours",
      {
        params: {
          restaurant_id: restaurantId,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  },
};
