import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminLayout.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path: string) => location.pathname === path;

  // Check user roles
  const isSuperAdmin = user?.roles?.includes("super_admin");
  const isAdmin = user?.roles?.includes("admin") && !isSuperAdmin;

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#7f8c8d",
        }}
      >
        Loading...
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: "30px" }}>🍴</span>
          <span>Smart Restaurant</span>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin/dashboard"
            className={`nav-link ${
              isActive("/admin/dashboard") ? "active" : ""
            }`}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>

          {/* Menu Management - Both Admin and SuperAdmin */}
          <Link
            to="/admin/menu-items"
            className={`nav-link ${
              isActive("/admin/menu-items") ? "active" : ""
            }`}
          >
            <span className="nav-icon">🍴</span>
            Menu Items
          </Link>
          <Link
            to="/admin/categories"
            className={`nav-link ${
              isActive("/admin/categories") ? "active" : ""
            }`}
          >
            <span className="nav-icon">📁</span>
            Categories
          </Link>
          <Link
            to="/admin/modifiers"
            className={`nav-link ${
              isActive("/admin/modifiers") ? "active" : ""
            }`}
          >
            <span className="nav-icon">🔧</span>
            Modifiers
          </Link>
          <Link
            to="/admin/tables"
            className={`nav-link ${isActive("/admin/tables") ? "active" : ""}`}
          >
            <span className="nav-icon">🪑</span>
            Tables
          </Link>

          {/* Operations - Only for Admin (not SuperAdmin) */}
          {isAdmin && (
            <>
              <Link
                to="/admin/orders"
                className={`nav-link ${
                  isActive("/admin/orders") ? "active" : ""
                }`}
              >
                <span className="nav-icon">📦</span>
                Orders
              </Link>
              <Link
                to="/kitchen/kds"
                className={`nav-link ${
                  isActive("/kitchen/kds") ? "active" : ""
                }`}
              >
                <span className="nav-icon">👨‍🍳</span>
                Kitchen Display
              </Link>
              <Link
                to="/admin/users"
                className={`nav-link ${
                  isActive("/admin/users") ? "active" : ""
                }`}
              >
                <span className="nav-icon">👥</span>
                Users
              </Link>
            </>
          )}

          {/* Reports - Both Admin and SuperAdmin */}
          <Link
            to="/admin/reports"
            className={`nav-link ${isActive("/admin/reports") ? "active" : ""}`}
          >
            <span className="nav-icon">📈</span>
            Reports
          </Link>

          {/* System - Both Admin and SuperAdmin but different functions */}
          <Link
            to="/admin/system"
            className={`nav-link ${isActive("/admin/system") ? "active" : ""}`}
          >
            <span className="nav-icon">⚙️</span>
            System
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">
              {user?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "AD"}
            </div>
            <div className="admin-info">
              <div className="admin-name">{user?.full_name || user?.email}</div>
              <div className="admin-role">
                {user?.role === "super_admin" ||
                user?.roles?.includes("super_admin")
                  ? "Super Admin"
                  : user?.role === "admin" || user?.roles?.includes("admin")
                    ? "Restaurant Admin"
                    : "Staff"}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-link">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">{children}</div>
    </div>
  );
}
