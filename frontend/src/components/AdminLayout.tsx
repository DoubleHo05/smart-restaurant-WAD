import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminLayout.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path: string) => location.pathname === path;

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
            className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link
            to="/admin/menu"
            className={`nav-link ${isActive("/admin/menu") ? "active" : ""}`}
          >
            <span className="nav-icon">📋</span>
            Menu
          </Link>
          <Link
            to="/admin/menu-items"
            className={`nav-link ${isActive("/admin/menu-items") ? "active" : ""}`}
          >
            <span className="nav-icon">🍴</span>
            Menu Items
          </Link>
          <Link
            to="/admin/categories"
            className={`nav-link ${isActive("/admin/categories") ? "active" : ""}`}
          >
            <span className="nav-icon">📁</span>
            Categories
          </Link>
          <Link
            to="/admin/modifiers"
            className={`nav-link ${isActive("/admin/modifiers") ? "active" : ""}`}
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
          <Link
            to="/admin/users"
            className={`nav-link ${isActive("/admin/users") ? "active" : ""}`}
          >
            <span className="nav-icon">�</span>
            Users
          </Link>
          <Link            to="/admin/reports"
            className={`nav-link ${isActive("/admin/reports") ? "active" : ""}`}
          >
            <span className="nav-icon">📈</span>
            Reports
          </Link>
          <Link            to="/admin/system"
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
                {user?.roles?.includes("super_admin")
                  ? "Super Admin"
                  : user?.roles?.includes("admin")
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
