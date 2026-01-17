import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WaiterDashboard.css";
import {
  getWaiterPerformance,
  getWaiterLeaderboard,
  WaiterPerformance,
  LeaderboardEntry,
} from "../../api/waiterApi";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { useAuth } from "../../contexts/AuthContext";

export default function WaiterDashboard() {
  const navigate = useNavigate();
  const { restaurants } = useRestaurant();
  const { user } = useAuth();
  const [performance, setPerformance] = useState<WaiterPerformance | null>(
    null
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "all"
  >("today");

  const waiterId = user?.id || "";
  const restaurantId = restaurants.length > 0 ? restaurants[0].id : null;
  const waiterName = user?.full_name || "Waiter";

  useEffect(() => {
    if (restaurantId && waiterId) {
      loadData();
    }
  }, [restaurantId, waiterId]);

  const loadData = async () => {
    if (!restaurantId || !waiterId) return;
    
    setLoading(true);
    try {
      const [perfData, leaderData] = await Promise.all([
        getWaiterPerformance(waiterId, restaurantId),
        getWaiterLeaderboard(restaurantId),
      ]);
      setPerformance(perfData);
      setLeaderboard(leaderData);
    } catch (error) {
      console.error("Error loading waiter dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStats = () => {
    if (!performance) return null;

    if (selectedPeriod === "today") {
      return {
        orders: performance.today_stats.orders_accepted,
        served: performance.today_stats.orders_served,
        rejected: performance.today_stats.orders_rejected,
        avgTime: performance.today_stats.average_service_time_minutes,
        acceptanceRate:
          performance.today_stats.orders_accepted > 0
            ? (
                (performance.today_stats.orders_accepted /
                  (performance.today_stats.orders_accepted +
                    performance.today_stats.orders_rejected)) *
                100
              ).toFixed(1)
            : "0",
      };
    } else if (selectedPeriod === "week") {
      return {
        orders: performance.week_stats.total_orders,
        served: performance.week_stats.total_orders, // Approximation
        rejected: 0,
        avgTime: 0,
        acceptanceRate: performance.week_stats.acceptance_rate.toFixed(1),
      };
    } else {
      return {
        orders: performance.all_time_stats.total_orders_accepted,
        served: performance.all_time_stats.total_orders_served,
        rejected: performance.all_time_stats.total_orders_rejected,
        avgTime: 0,
        acceptanceRate:
          performance.all_time_stats.total_orders_accepted > 0
            ? (
                (performance.all_time_stats.total_orders_accepted /
                  (performance.all_time_stats.total_orders_accepted +
                    performance.all_time_stats.total_orders_rejected)) *
                100
              ).toFixed(1)
            : "0",
      };
    }
  };

  const getMyRank = () => {
    const myEntry = leaderboard.find((entry) => entry.waiter_id === waiterId);
    return myEntry?.rank || "-";
  };

  const stats = getCurrentStats();

  if (loading) {
    return (
      <div className="waiter-dashboard loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="waiter-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="waiter-info">
            <div className="waiter-avatar">{waiterName.charAt(0)}</div>
            <div className="waiter-details">
              <h1>{waiterName}</h1>
              <p className="waiter-role">Waiter</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate("/waiter/orders")}
            >
              📋 Orders
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/waiter/tables")}
            >
              🍽️ Tables
            </button>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="period-selector">
        <button
          className={`period-btn ${selectedPeriod === "today" ? "active" : ""}`}
          onClick={() => setSelectedPeriod("today")}
        >
          Today
        </button>
        <button
          className={`period-btn ${selectedPeriod === "week" ? "active" : ""}`}
          onClick={() => setSelectedPeriod("week")}
        >
          This Week
        </button>
        <button
          className={`period-btn ${selectedPeriod === "all" ? "active" : ""}`}
          onClick={() => setSelectedPeriod("all")}
        >
          All Time
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.orders || 0}</div>
            <div className="stat-label">Orders Handled</div>
          </div>
        </div>

        <div className="stat-card served">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.served || 0}</div>
            <div className="stat-label">Orders Served</div>
          </div>
        </div>

        <div className="stat-card acceptance">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.acceptanceRate}%</div>
            <div className="stat-label">Acceptance Rate</div>
          </div>
        </div>

        <div className="stat-card rank">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">#{getMyRank()}</div>
            <div className="stat-label">Team Rank</div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      {selectedPeriod === "today" && stats && (
        <div className="performance-section">
          <h2 className="section-title">Today's Performance</h2>
          <div className="performance-chart">
            <div className="chart-bars">
              <div className="chart-bar">
                <div
                  className="bar-fill accepted"
                  style={{
                    height: `${Math.min(
                      ((stats.orders - stats.rejected) /
                        Math.max(stats.orders, 1)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
                <div className="bar-label">Accepted</div>
                <div className="bar-value">{stats.orders - stats.rejected}</div>
              </div>
              <div className="chart-bar">
                <div
                  className="bar-fill rejected"
                  style={{
                    height: `${Math.min(
                      (stats.rejected / Math.max(stats.orders, 1)) * 100,
                      100
                    )}%`,
                  }}
                ></div>
                <div className="bar-label">Rejected</div>
                <div className="bar-value">{stats.rejected}</div>
              </div>
              <div className="chart-bar">
                <div
                  className="bar-fill served"
                  style={{
                    height: `${Math.min(
                      (stats.served / Math.max(stats.orders, 1)) * 100,
                      100
                    )}%`,
                  }}
                ></div>
                <div className="bar-label">Served</div>
                <div className="bar-value">{stats.served}</div>
              </div>
            </div>

            {stats.avgTime > 0 && (
              <div className="avg-time-card">
                <div className="avg-time-icon">⏱️</div>
                <div className="avg-time-content">
                  <div className="avg-time-value">
                    {stats.avgTime.toFixed(1)}
                  </div>
                  <div className="avg-time-label">Avg. Service Time (min)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="leaderboard-section">
        <h2 className="section-title">🏆 Team Leaderboard</h2>
        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.waiter_id === waiterId;
            return (
              <div
                key={entry.waiter_id}
                className={`leaderboard-item ${
                  isCurrentUser ? "current-user" : ""
                } ${index < 3 ? `rank-${index + 1}` : ""}`}
              >
                <div className="leaderboard-rank">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `#${entry.rank}`}
                </div>
                <div className="leaderboard-info">
                  <div className="leaderboard-name">
                    {entry.waiter_name}
                    {isCurrentUser && <span className="you-badge">You</span>}
                  </div>
                  <div className="leaderboard-stats">
                    {entry.orders_served} orders ·{" "}
                    {entry.acceptance_rate.toFixed(0)}% acceptance
                    {entry.average_service_time > 0 &&
                      ` · ${entry.average_service_time.toFixed(1)} min avg`}
                  </div>
                </div>
                <div className="leaderboard-badge">{entry.orders_served}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="action-card"
          onClick={() => navigate("/waiter/orders")}
        >
          <div className="action-icon">📋</div>
          <div className="action-label">View Orders</div>
        </button>
        <button
          className="action-card"
          onClick={() => navigate("/waiter/tables")}
        >
          <div className="action-icon">🍽️</div>
          <div className="action-label">Manage Tables</div>
        </button>
        <button className="action-card" onClick={loadData}>
          <div className="action-icon">🔄</div>
          <div className="action-label">Refresh Stats</div>
        </button>
      </div>
    </div>
  );
}
