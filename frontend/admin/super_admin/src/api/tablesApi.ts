import axiosInstance from "./axiosConfig";

import {
  Table,
  CreateTableData,
  UpdateTableData,
  QrTokenResponse,
  MenuResponse,
  MenuItem,
} from "../types/tables.types";
// Types
const api = axiosInstance;


export const tablesApi = {
  // Get all tables with optional filters
  getAll: async (filters?: {
    status?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await api.get<Table[]>(`/tables?${params.toString()}`);
    return response.data;
  },

  // Get single table
  getOne: async (id: string) => {
    const response = await api.get<Table>(`/tables/${id}`);
    return response.data;
  },

  // Create new table
  create: async (data: CreateTableData) => {
    const response = await api.post<Table>("/tables", data);
    return response.data;
  },

  // Update table
  update: async (id: string, data: UpdateTableData) => {
    const response = await api.put<Table>(`/tables/${id}`, data);
    return response.data;
  },

  // Update table status
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch<Table>(`/tables/${id}/status`, { status });
    return response.data;
  },

  // Delete table
  delete: async (id: string) => {
    await api.delete(`/tables/${id}`);
  },

  // Get all locations
  getLocations: async () => {
    const response = await api.get<string[]>("/tables/locations");
    return response.data;
  },

  generateQr: async (id: string) => {
    const response = await api.post<QrTokenResponse>(
      `/tables/${id}/qr/generate`
    );
    return response.data;
  },

  regenerateQr: async (id: string) => {
    const response = await api.post<QrTokenResponse>(
      `/tables/${id}/qr/regenerate`
    );
    return response.data;
  },

  downloadPdf: async (id: string) => {
    const response = await api.get(`/tables/qr/${id}/download-pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  downloadPng: async (id: string) => {
    const response = await api.get(`/tables/qr/${id}/download-png`, {
      responseType: "blob",
    });
    return response.data;
  },

  downloadAllZip: async () => {
    const response = await api.get("/tables/qr/download-all-zip", {
      responseType: "blob",
    });
    return response.data;
  },
  verifyQrAndGetMenu: async (tableId: string, token: string) => {
    const response = await api.get<MenuResponse>("/api/menu", {
      params: { table: tableId, token: token },
    });
    return response.data;
  },
};
