import axiosInstance from "./axiosConfig";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../types/auth.types";

export const authApi = {
  // POST /auth/login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      data
    );
    return response.data;
  },

  // POST /auth/register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  // GET /auth/me - Lấy thông tin user hiện tại
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  },

  // POST /auth/logout
  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },
};
