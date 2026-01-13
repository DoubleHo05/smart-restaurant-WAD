import axiosInstance from "./axiosConfig";
import type {
  DailyRevenueData,
  PopularItem,
  OrdersByStatus,
  DashboardSummary,
  AveragePrepTimeData,
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
};
