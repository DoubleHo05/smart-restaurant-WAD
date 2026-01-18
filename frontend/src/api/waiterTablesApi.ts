import axiosInstance from "./axiosConfig";
import { Table } from "../types/tables.types";

export interface TableStatusOverview {
  id: string;
  table_number: string;
  capacity: number;
  location?: string;
  status: "available" | "occupied" | "reserved";
  current_orders?: {
    id: string;
    order_number: string;
    status: string;
    total_price: number;
    items_count: number;
  }[];
  last_order_time?: string;
}

export interface UpdateTableOccupancyDto {
  restaurant_id: string;
  status: "available" | "occupied" | "reserved";
}

// Get table status overview for waiter
export const getTableStatusOverview = async (
  restaurantId: string,
): Promise<TableStatusOverview[]> => {
  const response = await axiosInstance.get("/tables/status/overview", {
    params: { restaurant_id: restaurantId },
  });
  return response.data.data.tables;
};

// Update table occupancy status manually
export const updateTableOccupancyStatus = async (
  tableId: string,
  data: UpdateTableOccupancyDto,
): Promise<Table> => {
  const response = await axiosInstance.patch(
    `/tables/${tableId}/occupancy-status`,
    data,
  );
  return response.data;
};

// Get table details with current orders
export const getTableWithOrders = async (
  tableId: string,
  restaurantId: string,
) => {
  const response = await axiosInstance.get(`/tables/${tableId}`, {
    params: { restaurant_id: restaurantId, include_orders: true },
  });
  return response.data;
};
