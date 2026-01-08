export interface Table {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  location?: string;
  description?: string;
  status: string;
  qr_token?: string;
  qr_token_created_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTableData {
  table_number: string;
  capacity: number;
  location?: string;
  description?: string;
  restaurant_id: string;
}

export interface UpdateTableData {
  table_number?: string;
  capacity?: number;
  location?: string;
  description?: string;
}

export interface QrTokenResponse {
  token: string;
  qrUrl: string;
  tableNumber: string;
}
export interface MenuResponse {
  success: boolean;
  message: string;
  tableInfo: {
    id: string;
    number: string;
    capacity: number;
    location?: string;
  };
  menu: MenuItem[];
}
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image?: string;
}
