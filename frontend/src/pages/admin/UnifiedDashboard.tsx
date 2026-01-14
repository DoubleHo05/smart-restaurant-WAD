import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRestaurant } from "../../contexts/RestaurantContext";
import RestaurantSelector from "../../components/RestaurantSelector";
import { reportsApi } from "../../api/reportsApi";
import { superAdminApi } from "../../api/superAdminApi";
import type {
  DashboardSummary,
  RevenueByCategoryResponse,
  WaiterPerformanceResponse,
  KitchenEfficiencyResponse,
  CustomerRetentionResponse,
  PeakHoursResponse,
} from "../../types/reports.types";
import type { SystemStats, RestaurantWithStats } from "../../api/superAdminApi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import "./UnifiedDashboard.css";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const { restaurants } = useRestaurant();
  const isSuperAdmin = user?.role === "super_admin";

  // Local restaurant selection (scope limited to this dashboard)
  const [localSelectedRestaurant, setLocalSelectedRestaurant] = useState<any>(null);

  // State for dashboard data
  const [loading, setLoading] = useState(false);
  const [superAdminLoading, setSuperAdminLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<RestaurantWithStats[]>(
    []
  );

  // State for advanced reports
  const [revenueByCategory, setRevenueByCategory] =
    useState<RevenueByCategoryResponse | null>(null);
  const [waiterPerformance, setWaiterPerformance] =
    useState<WaiterPerformanceResponse | null>(null);
  const [kitchenEfficiency, setKitchenEfficiency] =
    useState<KitchenEfficiencyResponse | null>(null);
  const [customerRetention, setCustomerRetention] =
    useState<CustomerRetentionResponse | null>(null);
  const [peakHours, setPeakHours] = useState<PeakHoursResponse | null>(null);

  // Date range filter
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  // Load super admin stats (only for super_admin role)
  useEffect(() => {
    if (!isSuperAdmin) return;

    let mounted = true;

    const loadSuperAdminStats = async () => {
      setSuperAdminLoading(true);
      try {
        const [stats, restaurants] = await Promise.all([
          superAdminApi.getSystemStats(),
          superAdminApi.getAllRestaurants(),
        ]);
        
        if (mounted) {
          setSystemStats(stats);
          setAllRestaurants(restaurants);
        }
      } catch (error) {
        console.error("Failed to load super admin stats:", error);
        if (mounted) {
          setError("Failed to load system statistics");
        }
      } finally {
        if (mounted) {
          setSuperAdminLoading(false);
        }
      }
    };

    loadSuperAdminStats();

    return () => {
      mounted = false;
    };
  }, [isSuperAdmin]);

  // Load per-restaurant data
  useEffect(() => {
    if (!localSelectedRestaurant?.id) {
      // Reset data when no restaurant selected
      setSummary(null);
      setRevenueByCategory(null);
      setWaiterPerformance(null);
      setKitchenEfficiency(null);
      setCustomerRetention(null);
      setPeakHours(null);
      return;
    }

    let mounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [
          summaryData,
          categoryData,
          waiterData,
          kitchenData,
          retentionData,
          hoursData,
        ] = await Promise.all([
          reportsApi.getDashboardSummary(localSelectedRestaurant.id),
          reportsApi.getRevenueByCategory(
            localSelectedRestaurant.id,
            dateRange.start,
            dateRange.end
          ),
          reportsApi
            .getWaiterPerformance(
              localSelectedRestaurant.id,
              dateRange.start,
              dateRange.end
            )
            .catch(() => null), // Waiter performance might fail if migration not run
          reportsApi.getKitchenEfficiency(
            localSelectedRestaurant.id,
            dateRange.start,
            dateRange.end
          ),
          reportsApi.getCustomerRetention(
            localSelectedRestaurant.id,
            dateRange.start,
            dateRange.end
          ),
          reportsApi.getPeakHours(
            localSelectedRestaurant.id,
            dateRange.start,
            dateRange.end
          ),
        ]);

        if (mounted) {
          setSummary(summaryData);
          setRevenueByCategory(categoryData);
          setWaiterPerformance(waiterData);
          setKitchenEfficiency(kitchenData);
          setCustomerRetention(retentionData);
          setPeakHours(hoursData);
        }
      } catch (error: any) {
        console.error("Failed to load dashboard data:", error);
        if (mounted) {
          setError(error?.response?.data?.message || "Failed to load dashboard data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, [localSelectedRestaurant, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleDateChange = (field: "start" | "end", value: string) => {
    setDateRange((prev) => {
      const newRange = { ...prev, [field]: value };
      
      // Validate date range
      if (new Date(newRange.start) > new Date(newRange.end)) {
        console.warn("Start date cannot be after end date");
        return prev;
      }
      
      return newRange;
    });
  };

  // Show loading for initial load
  if (superAdminLoading && isSuperAdmin && !systemStats) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading system statistics...</p>
      </div>
    );
  }

  return (
    <div className="unified-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">
            {isSuperAdmin ? "Super Admin Dashboard" : "Dashboard"}
          </h1>
          <p className="page-subtitle">
            {localSelectedRestaurant
              ? `${localSelectedRestaurant.name} - Analytics & Reports`
              : "Select a restaurant to view analytics"}
          </p>
        </div>
        
        {/* Restaurant Selector - Only for non-super-admin */}
        {!isSuperAdmin && (
          <div style={{ marginRight: "20px" }}>
            <RestaurantSelector 
              selectedRestaurant={localSelectedRestaurant}
              onSelectRestaurant={setLocalSelectedRestaurant}
            />
          </div>
        )}
        
        <div className="date-range-filter">
          <label>From:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateChange("start", e.target.value)}
            max={dateRange.end}
          />
          <label>To:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateChange("end", e.target.value)}
            min={dateRange.start}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner" style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          border: "1px solid #fecaca"
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Super Admin Stats (Only for super_admin) */}
      {isSuperAdmin && systemStats && (
        <div className="super-admin-section">
          <h2 className="section-title">System-Wide Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#e8f8f5" }}>
                🏢
              </div>
              <div className="stat-content">
                <div className="stat-value">{systemStats.restaurants.total}</div>
                <div className="stat-label">Total Restaurants</div>
                <div className="stat-change positive">
                  {systemStats.restaurants.active} active
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#ebf5fb" }}>
                👥
              </div>
              <div className="stat-content">
                <div className="stat-value">{systemStats.users.total}</div>
                <div className="stat-label">Total Users</div>
                <div className="stat-change positive">
                  {systemStats.users.active} active
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#fef9e7" }}>
                📦
              </div>
              <div className="stat-content">
                <div className="stat-value">{systemStats.orders.total}</div>
                <div className="stat-label">Total Orders</div>
                <div className={`stat-change ${systemStats.orders.growth_vs_yesterday >= 0 ? 'positive' : 'negative'}`}>
                  {systemStats.orders.today} today (
                  {systemStats.orders.growth_vs_yesterday > 0 ? "+" : ""}
                  {systemStats.orders.growth_vs_yesterday.toFixed(1)}%)
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#fdedec" }}>
                💰
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {formatCurrency(systemStats.revenue.total)}
                </div>
                <div className="stat-label">Total Revenue</div>
                <div className={`stat-change ${systemStats.revenue.growth_vs_yesterday >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(systemStats.revenue.today)} today (
                  {systemStats.revenue.growth_vs_yesterday > 0 ? "+" : ""}
                  {systemStats.revenue.growth_vs_yesterday.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>

          {/* All Restaurants Table */}
          {allRestaurants.length > 0 && (
            <div className="card">
              <h3>All Restaurants Overview</h3>
              <div className="table-container">
                <table className="restaurants-table">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Status</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                      <th>Tables</th>
                      <th>Menu Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRestaurants.map((restaurant) => (
                      <tr key={restaurant.id}>
                        <td>
                          <strong>{restaurant.name}</strong>
                          <br />
                          <small>{restaurant.address}</small>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              restaurant.status === "active"
                                ? "badge-success"
                                : "badge-danger"
                            }`}
                          >
                            {restaurant.status}
                          </span>
                        </td>
                        <td>{restaurant.stats.total_orders}</td>
                        <td>{formatCurrency(restaurant.stats.total_revenue)}</td>
                        <td>{restaurant.stats.tables_count}</td>
                        <td>{restaurant.stats.active_menu_items}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Per-Restaurant Analytics */}
      {localSelectedRestaurant && (
        <>
          {/* Loading Indicator */}
          {loading && (
            <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Loading dashboard data...</p>
            </div>
          )}

          {/* Quick Summary Cards */}
          {!loading && summary && (
            <div className="quick-summary">
              <h2 className="section-title">Today's Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div
                    className="stat-icon"
                    style={{ background: "#e8f8f5", color: "#27ae60" }}
                  >
                    💵
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {formatCurrency(summary.today_revenue)}
                    </div>
                    <div className="stat-label">Today's Revenue</div>
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
                    <div className="stat-value">{summary.today_orders_count}</div>
                    <div className="stat-label">Orders Today</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div
                    className="stat-icon"
                    style={{ background: "#fef9e7", color: "#f39c12" }}
                  >
                    ⏳
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{summary.pending_orders}</div>
                    <div className="stat-label">Pending Orders</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div
                    className="stat-icon"
                    style={{ background: "#fdedec", color: "#e74c3c" }}
                  >
                    🍳
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{summary.preparing_orders}</div>
                    <div className="stat-label">Preparing Orders</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Reports */}
          {!loading && (
            <div className="advanced-reports">
              <h2 className="section-title">Advanced Analytics</h2>

              <div className="charts-grid">
                {/* Revenue by Category */}
                {revenueByCategory && revenueByCategory.categories.length > 0 && (
                  <div className="card chart-card">
                    <h3>Revenue by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueByCategory.categories}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category_name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend />
                        <Bar dataKey="total_revenue" fill="#3b82f6" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="chart-summary">
                      <strong>Total:</strong>{" "}
                      {formatCurrency(revenueByCategory.total_revenue)}
                    </div>
                  </div>
                )}

                {/* Kitchen Efficiency */}
                {kitchenEfficiency && kitchenEfficiency.orders_by_prep_time.length > 0 && (
                  <div className="card chart-card">
                    <h3>Kitchen Efficiency</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={kitchenEfficiency.orders_by_prep_time as any}
                          dataKey="order_count"
                          nameKey="time_range"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {kitchenEfficiency.orders_by_prep_time.map(
                            (_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-summary">
                      <strong>Avg Prep Time:</strong>{" "}
                      {kitchenEfficiency.average_prep_time_minutes.toFixed(1)} min
                    </div>
                  </div>
                )}

                {/* Peak Hours */}
                {peakHours && peakHours.hourly_breakdown.length > 0 && (
                  <div className="card chart-card full-width">
                    <h3>Peak Hours Analysis</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={peakHours.hourly_breakdown}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="hour"
                          tickFormatter={(hour) => `${hour}:00`}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(hour) => `${hour}:00`}
                          formatter={(value, name) =>
                            name === "total_revenue"
                              ? formatCurrency(Number(value))
                              : value
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="order_count"
                          stroke="#3b82f6"
                          name="Orders"
                        />
                        <Line
                          type="monotone"
                          dataKey="total_revenue"
                          stroke="#10b981"
                          name="Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="chart-summary">
                      <strong>Peak Hour:</strong> {peakHours.peak_hour.hour}:00 (
                      {peakHours.peak_hour.order_count} orders,{" "}
                      {formatCurrency(peakHours.peak_hour.total_revenue)})
                    </div>
                  </div>
                )}

                {/* Waiter Performance */}
                {waiterPerformance && waiterPerformance.waiters.length > 0 && (
                  <div className="card chart-card full-width">
                    <h3>Waiter Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={waiterPerformance.waiters}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="waiter_name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => {
                            const nameStr = String(name);
                            return nameStr.includes("revenue") || nameStr.includes("value")
                              ? formatCurrency(Number(value))
                              : value;
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="total_orders"
                          fill="#3b82f6"
                          name="Orders"
                        />
                        <Bar
                          dataKey="total_revenue"
                          fill="#10b981"
                          name="Revenue"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {/* Waiter Performance - Empty State */}
                {waiterPerformance && waiterPerformance.waiters.length === 0 && (
                  <div className="card full-width" style={{
                    padding: "2rem",
                    textAlign: "center",
                    background: "#f8f9fa",
                    border: "1px dashed #cbd5e1"
                  }}>
                    <h3 style={{ color: "#64748b", marginBottom: "0.5rem" }}>
                      No Waiter Performance Data
                    </h3>
                    <p style={{ color: "#94a3b8", margin: 0 }}>
                      No orders with assigned waiters found in the selected period. 
                      Assign waiters to orders to track their performance.
                    </p>
                  </div>
                )}

                {/* Customer Retention */}
                {customerRetention && (
                  <div className="card full-width">
                    <h3>Customer Retention</h3>
                    <div className="retention-stats">
                      <div className="retention-card">
                        <div className="retention-value">
                          {customerRetention.summary.total_customers}
                        </div>
                        <div className="retention-label">Total Customers</div>
                      </div>
                      <div className="retention-card">
                        <div className="retention-value">
                          {customerRetention.summary.new_customers}
                        </div>
                        <div className="retention-label">New Customers</div>
                      </div>
                      <div className="retention-card">
                        <div className="retention-value">
                          {customerRetention.summary.returning_customers}
                        </div>
                        <div className="retention-label">Returning Customers</div>
                      </div>
                      <div className="retention-card">
                        <div className="retention-value">
                          {typeof customerRetention.summary.retention_rate === 'string' 
                            ? customerRetention.summary.retention_rate 
                            : `${customerRetention.summary.retention_rate.toFixed(1)}%`}
                        </div>
                        <div className="retention-label">Retention Rate</div>
                      </div>
                      <div className="retention-card">
                        <div className="retention-value">
                          {typeof customerRetention.average_orders_per_customer === 'string'
                            ? customerRetention.average_orders_per_customer
                            : customerRetention.average_orders_per_customer.toFixed(1)}
                        </div>
                        <div className="retention-label">Avg Orders/Customer</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Data Message */}
                {!revenueByCategory && !kitchenEfficiency && !peakHours && !customerRetention && (
                  <div className="card full-width">
                    <div className="empty-state">
                      <h3>No Analytics Data Available</h3>
                      <p>There is no data for the selected date range. Try selecting a different period.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!localSelectedRestaurant && !isSuperAdmin && (
        <div className="empty-state">
          <h3>No Restaurant Selected</h3>
          <p>Please select a restaurant above to view analytics</p>
        </div>
      )}
    </div>
  );
}
