import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types
export interface ModifierOption {
    id: string;
    name: string;
    price_adjustment: number;
    status: string;
}

export interface ModifierGroup {
    id: string;
    name: string;
    selection_type: "single" | "multiple";
    is_required: boolean;
    min_selections: number;
    max_selections: number;
    display_order: number;
    status: string;
    options?: ModifierOption[];
    itemsUsingCount?: number;
}

export interface CreateModifierGroupData {
    name: string;
    selection_type: "single" | "multiple";
    is_required?: boolean;
    min_selections?: number;
    max_selections?: number;
    display_order?: number;
    status?: string;
}

export interface UpdateModifierGroupData {
    name?: string;
    selection_type?: "single" | "multiple";
    is_required?: boolean;
    min_selections?: number;
    max_selections?: number;
    display_order?: number;
    status?: string;
}

export interface CreateModifierOptionData {
    name: string;
    price_adjustment: number;
    status?: string;
}

export interface UpdateModifierOptionData {
    name?: string;
    price_adjustment?: number;
    status?: string;
}

// API Methods
export const modifiersApi = {
    // ━━━ GROUPS ━━━

    // Get all groups
    getAllGroups: async (filters?: {
        status?: string;
        includeOptions?: boolean;
    }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append("status", filters.status);
        if (filters?.includeOptions)
            params.append("includeOptions", filters.includeOptions.toString());

        const response = await api.get<ModifierGroup[]>(
            `/api/admin/menu/modifier-groups?${params.toString()}`
        );
        return response.data;
    },

    // Get single group
    getGroup: async (id: string) => {
        const response = await api.get<ModifierGroup>(
            `/api/admin/menu/modifier-groups/${id}`
        );
        return response.data;
    },

    // Create group
    createGroup: async (data: CreateModifierGroupData) => {
        const response = await api.post<ModifierGroup>(
            "/api/admin/menu/modifier-groups",
            data
        );
        return response.data;
    },

    // Update group
    updateGroup: async (id: string, data: UpdateModifierGroupData) => {
        const response = await api.put<ModifierGroup>(
            `/api/admin/menu/modifier-groups/${id}`,
            data
        );
        return response.data;
    },

    // ━━━ OPTIONS ━━━

    // Create option
    createOption: async (groupId: string, data: CreateModifierOptionData) => {
        const response = await api.post<ModifierOption>(
            `/api/admin/menu/modifier-groups/${groupId}/options`,
            data
        );
        return response.data;
    },

    // Get option
    getOption: async (id: string) => {
        const response = await api.get<ModifierOption>(
            `/api/admin/menu/modifier-options/${id}`
        );
        return response.data;
    },

    // Update option
    updateOption: async (id: string, data: UpdateModifierOptionData) => {
        const response = await api.put<ModifierOption>(
            `/api/admin/menu/modifier-options/${id}`,
            data
        );
        return response.data;
    },

    // Delete option
    deleteOption: async (id: string) => {
        await api.delete(`/api/admin/menu/modifier-options/${id}`);
    },
};
