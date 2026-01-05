import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types
export interface Category {
    id: string;
    name: string;
    description?: string;
    display_order: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    itemCount?: number;
}

export interface CreateCategoryData {
    name: string;
    description?: string;
    display_order?: number;
    status?: string;
}

export interface UpdateCategoryData {
    name?: string;
    description?: string;
    display_order?: number;
    status?: string;
}

// API Methods
export const categoriesApi = {
    // Get all categories
    getAll: async (filters?: { status?: string; sortBy?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append("status", filters.status);
        if (filters?.sortBy) params.append("sortBy", filters.sortBy);

        const response = await api.get<Category[]>(
            `/api/admin/menu/categories?${params.toString()}`
        );
        return response.data;
    },

    // Get single category
    getOne: async (id: string) => {
        const response = await api.get<Category>(
            `/api/admin/menu/categories/${id}`
        );
        return response.data;
    },

    // Create category
    create: async (data: CreateCategoryData) => {
        const response = await api.post<Category>(
            "/api/admin/menu/categories",
            data
        );
        return response.data;
    },

    // Update category
    update: async (id: string, data: UpdateCategoryData) => {
        const response = await api.put<Category>(
            `/api/admin/menu/categories/${id}`,
            data
        );
        return response.data;
    },

    // Update status
    updateStatus: async (id: string, status: string) => {
        const response = await api.patch<Category>(
            `/api/admin/menu/categories/${id}/status`,
            { status }
        );
        return response.data;
    },

    // Delete category
    delete: async (id: string) => {
        await api.delete(`/api/admin/menu/categories/${id}`);
    },
};
