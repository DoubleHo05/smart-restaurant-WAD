export interface ModifierOption {
  id: string;
  name: string;
  price_adjustment: number;
  status: string;
}

export interface ModifierGroup {
  id: string;
  restaurant_id: string;
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
  restaurant_id: string;
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
