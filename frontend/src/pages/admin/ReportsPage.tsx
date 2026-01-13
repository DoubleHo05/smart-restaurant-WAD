import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { reportsApi } from "../../api/reportsApi";
import { format, subDays } from "date-fns";
import RestaurantSelector from "../../components/RestaurantSelector";
import type {
  DailyRevenueData,
  PopularItem,
  OrdersByStatus,
  AveragePrepTimeData,
} from "../../types/reports.types";
import type { Restaurant } from "../../types/restaurant.types";
import "./ReportsPage.css";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export const ReportsPage: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const [revenueData, setRevenueData] = useState<DailyRevenueData[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus[]>([]);
  const [avgPrepTime, setAvgPrepTime] = useState<AveragePrepTimeData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedRestaurant?.id) {
      fetchAllReports();
    }
  }, [dateRange, selectedRestaurant]);

  const fetchAllReports = async () => {
    if (!selectedRestaurant?.id) return;

    setLoading(true);
    try {
      const [revenue, items, statusData, prepTime] = await Promise.all([
        reportsApi.getDailyRevenue(
          selectedRestaurant.id,
          dateRange.startDate,
          dateRange.endDate
        ),
        reportsApi.getPopularItems(selectedRestaurant.id, 10, 30),
        reportsApi.getOrdersByStatus(
          selectedRestaurant.id,
          dateRange.startDate,
          dateRange.endDate
        ),
        reportsApi.getAveragePrepTime(selectedRestaurant.id, 7),
      ]);

      setRevenueData(revenue);
      setPopularItems(items);
      setOrdersByStatus(statusData);
      setAvgPrepTime(prepTime);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="reports-page">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
        </div>
        <RestaurantSelector
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={setSelectedRestaurant}
        />
        <div className="loading">Please select a restaurant to view reports</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="reports-page">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
        </div>
        <RestaurantSelector
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={setSelectedRestaurant}
        />
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <div className="date-range-picker">
          <label>
            From:
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </label>
          <label>
            To:
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </label>
        </div>
      </div>

      {/* Restaurant Selector */}
      <RestaurantSelector
        selectedRestaurant={selectedRestaurant}
        onSelectRestaurant={setSelectedRestaurant}
      />

      {/* Empty State Warning */}
      {revenueData.length === 0 && (
        <div
          style={{
            padding: "20px",
            margin: "20px 0",
            background: "#fef3c7",
            border: "1px solid #fbbf24",
            borderRadius: "8px",
            color: "#92400e",
            textAlign: "center",
          }}
        >
          ℹ️ No order data available for the selected period. Charts will appear once
          you have orders.
        </div>
      )}

      {/* Revenue Chart */}
      <div className="chart-card">
        <h2>Daily Revenue</h2>
        {revenueData.length === 0 ? (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            No revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="total_orders"
                stroke="#10b981"
                strokeWidth={2}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="charts-grid">
        {/* Popular Items Chart */}
        <div className="chart-card">
          <h2>Top 10 Popular Items</h2>
          {popularItems.length === 0 ? (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              No popular items data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="total_quantity"
                  fill="#3b82f6"
                  name="Quantity Sold"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders by Status */}
        <div className="chart-card">
          <h2>Orders by Status</h2>
          {ordersByStatus.length === 0 ? (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              No orders data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus as any}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Average Prep Time</h3>
          <p className="stat-value">
            {avgPrepTime?.average_prep_time_minutes || 0} min
          </p>
          <p className="stat-label">
            Based on {avgPrepTime?.orders_analyzed || 0} orders
          </p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">
            $
            {revenueData
              .reduce((sum: number, d: any) => sum + d.total_revenue, 0)
              .toFixed(2)}
          </p>
          <p className="stat-label">Last 30 days</p>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">
            {revenueData.reduce(
              (sum: number, d: any) => sum + d.total_orders,
              0
            )}
          </p>
          <p className="stat-label">Last 30 days</p>
        </div>
      </div>
    </div>
  );
};
