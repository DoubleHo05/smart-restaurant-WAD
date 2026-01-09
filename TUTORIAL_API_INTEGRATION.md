# 📚 TUTORIAL: TÍCH HỢP API CHO SMART RESTAURANT FRONTEND

> **Mục tiêu**: Kết nối Frontend React với Backend NestJS để thay thế mock data bằng dữ liệu thật từ database
> **Thời gian ước tính**: 4-6 giờ cho Phase 1-3 (Authentication + Dashboard)
> **Cấp độ**: Intermediate

---

## 📋 MỤC LỤC

1. [Setup & Chuẩn bị](#step-1-setup--chuẩn-bị)
2. [Tạo Axios Configuration](#step-2-tạo-axios-configuration)
3. [Tích hợp Authentication API](#step-3-tích-hợp-authentication-api)
4. [Tích hợp Dashboard API](#step-4-tích-hợp-dashboard-api)
5. [Testing & Debugging](#step-5-testing--debugging)

---

## STEP 1: Setup & Chuẩn bị

### 1.1. Kiểm tra Backend đang chạy

Mở terminal và chạy backend:

```bash
cd d:\Hk1-2526\Project-Web\smart-restaurant-WAD\backend
npm run start:dev
```

**Kiểm tra**: Mở browser `http://localhost:3000` - nếu thấy "Hello World!" là OK!

### 1.2. Cài đặt Axios (nếu chưa có)

```bash
cd d:\Hk1-2526\Project-Web\smart-restaurant-WAD\frontend
npm install axios
```

### 1.3. Tạo file .env

**File**: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

✅ **Checkpoint**: Backend chạy trên port 3000, axios đã cài đặt

---

## STEP 2: Tạo Axios Configuration

### 2.1. Tạo Axios instance với interceptors

**File**: `frontend/src/api/axiosConfig.ts`

```typescript
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Tự động thêm JWT token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

**Giải thích**:

- `baseURL`: URL của backend API
- `Request Interceptor`: Lấy token từ localStorage và tự động thêm vào header
- `Response Interceptor`: Nếu API trả về 401, xóa token và redirect về login

✅ **Checkpoint**: File axiosConfig.ts đã tạo

---

## STEP 3: Tích hợp Authentication API

### 3.1. Tạo API Types/Interfaces

**File**: `frontend/src/types/api.ts`

```typescript
// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  roles: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
```

### 3.2. Tạo Auth API Service

**File**: `frontend/src/api/authApi.ts`

```typescript
import axiosInstance from "./axiosConfig";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../types/api";

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
```

### 3.3. Update AuthContext để sử dụng API thật

**File**: `frontend/src/contexts/AuthContext.tsx`

```typescript
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi } from "../api/authApi";
import { User } from "../types/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khi app load, kiểm tra token và lấy user info
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to get user info:", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.access_token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    authApi.logout().catch(console.error);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

**Những thay đổi chính**:

- ✅ Xóa mock login
- ✅ Gọi API `authApi.login()` thật
- ✅ Lưu token vào localStorage
- ✅ useEffect để check token khi app load
- ✅ Xử lý error từ API

### 3.4. Test Authentication Flow

#### Test 1: Login thành công

1. Chạy frontend: `npm run dev`
2. Mở `http://localhost:5173`
3. Redirect tới `/admin/login`
4. Nhập:
   - Email: `superadmin@restaurant.com`
   - Password: `Admin@123`
5. Click "Sign In"

**Expected Result**:

- ✅ Redirect tới `/dashboard`
- ✅ Thấy user info trên sidebar
- ✅ Token lưu trong localStorage

#### Test 2: Login thất bại

1. Nhập sai password
2. Click "Sign In"

**Expected Result**:

- ❌ Hiển thị error message: "Invalid credentials"
- ❌ Không redirect
- ❌ Không có token trong localStorage

#### Test 3: Auto-logout khi token hết hạn

1. Mở DevTools → Application → Local Storage
2. Xóa hoặc sửa token thành giá trị không hợp lệ
3. Refresh page hoặc gọi một API bất kỳ

**Expected Result**:

- ✅ Tự động redirect về `/admin/login`

✅ **Checkpoint**: Authentication hoạt động với backend API

---

## STEP 4: Tích hợp Dashboard API

### 4.1. Tạo Dashboard Types

**File**: `frontend/src/types/api.ts` (thêm vào cuối file)

```typescript
// Dashboard Types
export interface DashboardStats {
  todayRevenue: number;
  ordersToday: number;
  tablesOccupied: number;
  totalTables: number;
  avgPrepTime: number;
  revenueChange: number; // percentage
  ordersChange: number; // percentage
}

export interface TopSellingItem {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  category?: string;
}

export interface RevenueChartData {
  day: string;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  table: string;
  items: number;
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  created_at: string;
}
```

### 4.2. Tạo Dashboard API Service

**File**: `frontend/src/api/dashboardApi.ts`

```typescript
import axiosInstance from "./axiosConfig";
import {
  DashboardStats,
  TopSellingItem,
  RevenueChartData,
  RecentOrder,
} from "../types/api";

export const dashboardApi = {
  // GET /api/dashboard/stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>(
      "/dashboard/stats"
    );
    return response.data;
  },

  // GET /api/dashboard/revenue?period=week
  getRevenueChart: async (
    period: "week" | "month" = "week"
  ): Promise<RevenueChartData[]> => {
    const response = await axiosInstance.get<RevenueChartData[]>(
      "/dashboard/revenue",
      {
        params: { period },
      }
    );
    return response.data;
  },

  // GET /api/dashboard/top-items?limit=4
  getTopItems: async (limit: number = 4): Promise<TopSellingItem[]> => {
    const response = await axiosInstance.get<TopSellingItem[]>(
      "/dashboard/top-items",
      {
        params: { limit },
      }
    );
    return response.data;
  },

  // GET /api/orders/recent?limit=5
  getRecentOrders: async (limit: number = 5): Promise<RecentOrder[]> => {
    const response = await axiosInstance.get<RecentOrder[]>("/orders/recent", {
      params: { limit },
    });
    return response.data;
  },
};
```

### 4.3. Update Dashboard Component

**File**: `frontend/src/pages/Dashboard.tsx`

```typescript
import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { DashboardStats, TopSellingItem, RecentOrder } from "../types/api";
import "./Dashboard.css";

export default function Dashboard() {
  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingTopItems, setIsLoadingTopItems] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topItems, setTopItems] = useState<TopSellingItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  // Error states
  const [error, setError] = useState<string | null>(null);

  // Chart filter
  const [chartFilter, setChartFilter] = useState<"week" | "month">("week");
  const [revenueData, setRevenueData] = useState<any[]>([]);

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch stats:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch Top Items
  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        setIsLoadingTopItems(true);
        const data = await dashboardApi.getTopItems(4);
        setTopItems(data);
      } catch (err: any) {
        console.error("Failed to fetch top items:", err);
      } finally {
        setIsLoadingTopItems(false);
      }
    };

    fetchTopItems();
  }, []);

  // Fetch Recent Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const data = await dashboardApi.getRecentOrders(5);
        setRecentOrders(data);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch Revenue Chart Data
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await dashboardApi.getRevenueChart(chartFilter);
        setRevenueData(data);
      } catch (err: any) {
        console.error("Failed to fetch revenue data:", err);
      }
    };

    fetchRevenueData();
  }, [chartFilter]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (error && isLoadingStats) {
    return (
      <div className="dashboard-error">
        <h2>Failed to load dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📺 Open KDS</button>
          <button className="btn-primary">+ New Order</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {isLoadingStats ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card skeleton">
                <div className="skeleton-icon"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </>
        ) : stats ? (
          <>
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: "#e8f8f5", color: "#27ae60" }}
              >
                💵
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {formatCurrency(stats.todayRevenue)}
                </div>
                <div className="stat-label">Today's Revenue</div>
                <div
                  className={`stat-change ${
                    stats.revenueChange >= 0 ? "positive" : "negative"
                  }`}
                >
                  {stats.revenueChange >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(stats.revenueChange)}% from yesterday
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: "#ebf5fb", color: "#3498db" }}
              >
                📦
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.ordersToday}</div>
                <div className="stat-label">Orders Today</div>
                <div
                  className={`stat-change ${
                    stats.ordersChange >= 0 ? "positive" : "negative"
                  }`}
                >
                  {stats.ordersChange >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(stats.ordersChange)}% from yesterday
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: "#fef9e7", color: "#f39c12" }}
              >
                🪑
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {stats.tablesOccupied}/{stats.totalTables}
                </div>
                <div className="stat-label">Tables Occupied</div>
                <div className="stat-change neutral">
                  {Math.round((stats.tablesOccupied / stats.totalTables) * 100)}
                  % occupancy
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: "#fdedec", color: "#e74c3c" }}
              >
                ⏰
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.avgPrepTime} min</div>
                <div className="stat-label">Avg. Prep Time</div>
                <div className="stat-change neutral">Target: 15 min</div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue This {chartFilter === "week" ? "Week" : "Month"}</h3>
            <select
              className="chart-filter"
              value={chartFilter}
              onChange={(e) =>
                setChartFilter(e.target.value as "week" | "month")
              }
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="chart-placeholder">
            {revenueData.length > 0 && (
              <div className="bar-chart">
                {revenueData.map((data, index) => (
                  <div
                    key={index}
                    className="bar"
                    style={{
                      height: `${
                        (data.revenue /
                          Math.max(...revenueData.map((d) => d.revenue))) *
                        100
                      }%`,
                    }}
                  >
                    <span>{data.day}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Items */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Selling Items</h3>
            <a href="#" className="view-all">
              View All
            </a>
          </div>
          <div className="top-items">
            {isLoadingTopItems ? (
              <div>Loading...</div>
            ) : (
              topItems.map((item, index) => (
                <div key={item.id} className="top-item">
                  <span className="top-rank">{index + 1}</span>
                  <span className="top-icon">🍴</span>
                  <div className="top-info">
                    <div className="top-name">{item.name}</div>
                    <div className="top-stats">
                      {item.orders} orders | {formatCurrency(item.revenue)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="table-card">
        <div className="table-header">
          <h3>Recent Orders</h3>
          <a href="/orders" className="view-all">
            View All Orders →
          </a>
        </div>
        {isLoadingOrders ? (
          <div>Loading orders...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.table}</td>
                  <td>{order.items} items</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatTimeAgo(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

**Những thay đổi chính**:

- ✅ Xóa mock data
- ✅ Sử dụng `useEffect` để fetch data từ API
- ✅ Thêm loading states
- ✅ Thêm error handling
- ✅ Format currency và time
- ✅ Real-time data từ backend

### 4.4. Thêm Loading Skeleton CSS

**File**: `frontend/src/pages/Dashboard.css` (thêm vào cuối)

```css
/* Loading Skeleton */
.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton-icon {
  width: 60px;
  height: 60px;
  background: #e0e0e0;
  border-radius: 12px;
}

.skeleton-content {
  flex: 1;
}

.skeleton-line {
  height: 20px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-line.short {
  width: 60%;
  height: 14px;
}

.dashboard-error {
  text-align: center;
  padding: 50px;
}

.dashboard-error button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
```

✅ **Checkpoint**: Dashboard hiển thị dữ liệu thật từ API

---

## STEP 5: Testing & Debugging

### 5.1. Test Dashboard với Backend

#### Test Case 1: Dashboard load successfully

**Steps**:

1. Login vào admin panel
2. Navigate to Dashboard

**Expected**:

- ✅ Stats cards hiển thị dữ liệu từ database
- ✅ Loading skeleton hiện trong khi fetch data
- ✅ Chart và tables hiển thị đúng

#### Test Case 2: Handle API errors

**Steps**:

1. Stop backend server
2. Refresh dashboard

**Expected**:

- ❌ Hiển thị error message
- ✅ Có button "Retry"

#### Test Case 3: Network tab inspection

**Steps**:

1. Mở DevTools → Network tab
2. Refresh dashboard
3. Check các API calls

**Expected**:

- ✅ GET `/dashboard/stats` - Status 200
- ✅ GET `/dashboard/top-items` - Status 200
- ✅ GET `/orders/recent` - Status 200
- ✅ Header có `Authorization: Bearer <token>`

### 5.2. Common Issues & Solutions

#### Issue 1: CORS Error

```
Access to XMLHttpRequest at 'http://localhost:3000/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Thêm CORS middleware vào backend

**File**: `backend/src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  });

  await app.listen(3000);
}
```

#### Issue 2: 401 Unauthorized after login

```
Failed to fetch user info: Unauthorized
```

**Solution**: Check JWT token trong localStorage

- Mở DevTools → Application → Local Storage
- Verify token có tồn tại
- Check token format: phải là string không có quotes

#### Issue 3: Data không hiển thị

```
Dashboard shows empty or undefined
```

**Solution**: Check API response structure

```typescript
// In Dashboard.tsx, add console.log
useEffect(() => {
  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      console.log("Stats data:", data); // ADD THIS
      setStats(data);
    } catch (err) {
      console.error("Error:", err); // ADD THIS
    }
  };
  fetchStats();
}, []);
```

### 5.3. Debug Tools

#### Tool 1: React DevTools

- Install extension: React Developer Tools
- Check component state và props
- Verify data flow

#### Tool 2: Network Tab

- Monitor all API calls
- Check request headers
- Check response data

#### Tool 3: Console Logs

```typescript
// Add strategic console.logs
console.log("Token:", localStorage.getItem("token"));
console.log("User:", user);
console.log("API Response:", response.data);
```

---

## 📊 PROGRESS CHECKLIST

Sau khi hoàn thành tutorial này, bạn đã có:

```
✅ Axios instance với interceptors
✅ API types/interfaces
✅ Auth API service
✅ AuthContext tích hợp API
✅ Login flow hoạt động
✅ Dashboard API service
✅ Dashboard hiển thị dữ liệu thật
✅ Loading states
✅ Error handling
✅ Token management
```

---

## 🎯 NEXT STEPS

1. **Tích hợp các trang còn lại**:

   - Tables Management
   - Menu Items
   - Categories
   - Modifiers
   - Users Management

2. **Thêm tính năng nâng cao**:

   - Toast notifications
   - Optimistic updates
   - Real-time với WebSocket
   - Infinite scroll
   - Search & filter

3. **Optimize performance**:
   - React Query hoặc SWR
   - Debouncing
   - Lazy loading
   - Code splitting

---

## 🆘 NEED HELP?

Nếu gặp vấn đề:

1. Check console logs (F12)
2. Check Network tab
3. Verify backend đang chạy
4. Check API endpoints
5. Verify token trong localStorage

**Common Commands**:

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev

# Check ports
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

---

**Chúc mừng! 🎉** Bạn đã hoàn thành việc tích hợp API cho Authentication và Dashboard!
