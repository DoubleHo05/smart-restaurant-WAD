import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import UsersTab from "./tabs/UsersTab";
import RestaurantsTab from "./tabs/RestaurantsTab";
import "../../App.css";

type TabType = "users" | "restaurants";

export default function SystemAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const { user } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = user?.roles?.includes("super_admin");
  const isAdmin = user?.roles?.includes("admin");

  // Only super_admin and admin can access
  if (!isSuperAdmin && !isAdmin) {
    return (
      <div className="app">
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            background: "#1e293b",
            borderRadius: "12px",
            border: "2px solid #ef4444",
          }}
        >
          <h2 style={{ color: "#ef4444", marginBottom: "20px" }}>
            🚫 Access Denied
          </h2>
          <p style={{ color: "#cbd5e1" }}>
            Only Administrators can access system administration.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")}
            style={{ marginTop: "20px" }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>
          ⚙️ {isSuperAdmin ? "System Administration" : "Staff Management"}
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "2px solid #334155",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px 8px 0 0",
            cursor: "pointer",
            background: activeTab === "users" ? "#6366f1" : "#1e293b",
            color: activeTab === "users" ? "white" : "#94a3b8",
            transition: "all 0.3s ease",
            borderBottom:
              activeTab === "users"
                ? "3px solid #6366f1"
                : "3px solid transparent",
          }}
        >
          {isSuperAdmin ? "👥 All Users" : "👥 Staff (Waiter/Kitchen)"}
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab("restaurants")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              background: activeTab === "restaurants" ? "#6366f1" : "#1e293b",
              color: activeTab === "restaurants" ? "white" : "#94a3b8",
              transition: "all 0.3s ease",
              borderBottom:
                activeTab === "restaurants"
                  ? "3px solid #6366f1"
                  : "3px solid transparent",
            }}
          >
            🏪 Restaurants
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "users" && <UsersTab />}
        {activeTab === "restaurants" && isSuperAdmin && <RestaurantsTab />}
      </div>
    </div>
  );
}
