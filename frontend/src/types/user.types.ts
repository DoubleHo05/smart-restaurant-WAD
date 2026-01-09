export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  status: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  roles: string[];
}

export interface UpdateUserData {
  full_name?: string;
  phone?: string;
  status?: string;
  roles?: string[];
}
