import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerProfile } from "../../api/customersApi";
import { ordersApi } from "../../api/ordersApi";
import "./ProfileGuest.css"; // Use same CSS as ProfileGuest

interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

interface TableInfo {
  id: string;
  tableNumber: string;
  restaurantId: string;
}

interface SessionStats {
  ordersCount: number;
  sessionTotal: number;
  sessionStart: Date | null;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    ordersCount: 0,
    sessionTotal: 0,
    sessionStart: null,
  });

  useEffect(() => {
    loadProfile();
    loadTableInfo();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const authUser = localStorage.getItem("auth_user");
      if (!authUser) {
        navigate("/");
        return;
      }

      const user = JSON.parse(authUser);
      const profileData = await getCustomerProfile(user.id);
      setProfile(profileData);
    } catch (err: any) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTableInfo = () => {
    try {
      const storedTableInfo = localStorage.getItem("table_info");
      if (storedTableInfo) {
        const table = JSON.parse(storedTableInfo);
        setTableInfo(table);
        loadSessionStats(table.id);
      }
    } catch (error) {
      console.error("Error loading table info:", error);
    }
  };

  const loadSessionStats = async (tableId: string) => {
    try {
      const response = await ordersApi.getByTable(tableId);
      const orders = (response as any).data || response;

      // Filter active orders (not completed/cancelled)
      const activeOrders = orders.filter(
        (order: any) =>
          !["completed", "cancelled", "rejected"].includes(order.status),
      );

      const total = activeOrders.reduce(
        (sum: number, order: any) => sum + parseFloat(order.total || "0"),
        0,
      );

      const oldestOrder =
        activeOrders.length > 0
          ? new Date(
              Math.min(
                ...activeOrders.map((o: any) =>
                  new Date(o.created_at).getTime(),
                ),
              ),
            )
          : null;

      setSessionStats({
        ordersCount: activeOrders.length,
        sessionTotal: total,
        sessionStart: oldestOrder,
      });
    } catch (error) {
      console.error("Error loading session stats:", error);
    }
  };

  const getSessionDuration = () => {
    if (!sessionStats.sessionStart) return "0 min";

    const now = new Date();
    const diff = now.getTime() - sessionStats.sessionStart.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="header">
        <span className="header-title">Profile</span>
        <span className="header-table">
          {tableInfo ? `Table ${tableInfo.tableNumber}` : ""}
        </span>
      </div>

      {/* Content */}
      <div className="content" style={{ paddingBottom: "100px" }}>
        {/* Profile Card */}
        <div className="profile-card">
          <div
            className="profile-avatar"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            {profile ? getInitials(profile.full_name) : "U"}
          </div>
          <h2 className="profile-name">{profile?.full_name}</h2>
          <p className="profile-email">{profile?.email}</p>
          {profile?.phone && (
            <p className="profile-phone">📱 {profile.phone}</p>
          )}
        </div>

        {/* Session Stats */}
        {tableInfo && (
          <div className="stats-card">
            <h3 className="card-title">Current Session</h3>
            <div className="stats-row">
              <div className="stat-compact">
                <span className="stat-icon">🕐</span>
                <span className="stat-text">{getSessionDuration()}</span>
              </div>
              <div className="stat-compact">
                <span className="stat-icon">📋</span>
                <span className="stat-text">
                  {sessionStats.ordersCount} orders
                </span>
              </div>
              <div className="stat-compact">
                <span className="stat-icon">💰</span>
                <span className="stat-text">
                  {Math.round(Number(sessionStats.sessionTotal)).toLocaleString(
                    "vi-VN",
                  )}
                  ₫
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Account Section */}
        <div className="account-card">
          <h3 className="card-title">Account</h3>

          <button
            className="account-btn"
            onClick={() => navigate("/customer/dashboard-profile")}
          >
            <span className="account-icon">✏️</span>
            <span className="account-text">Edit Profile</span>
            <span className="account-arrow">→</span>
          </button>

          <button
            className="account-btn"
            onClick={() => navigate("/customer/order-history")}
          >
            <span className="account-icon">📦</span>
            <span className="account-text">Order History</span>
            <span className="account-arrow">→</span>
          </button>

          <button className="account-btn logout" onClick={handleLogout}>
            <span className="account-icon">🚪</span>
            <span className="account-text">Logout</span>
            <span className="account-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
