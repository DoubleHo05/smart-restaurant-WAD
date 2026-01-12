import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./WaiterLayout.css";

interface WaiterLayoutProps {
  children: ReactNode;
}

export default function WaiterLayout({ children }: WaiterLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate("/admin/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="waiter-layout">
      {/* Sidebar */}
      <div className="waiter-sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: "30px" }}>🍴</span>
          <span>Waiter Panel</span>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/waiter/orders"
            className={`nav-link ${isActive("/waiter/orders") ? "active" : ""}`}
          >
            <span className="nav-icon">📋</span>
            Orders
          </Link>
          <Link
            to="/waiter/tables"
            className={`nav-link ${isActive("/waiter/tables") ? "active" : ""}`}
          >
            <span className="nav-icon">🪑</span>
            Tables
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="waiter-profile">
            <div className="waiter-avatar">TN</div>
            <div className="waiter-info">
              <div className="waiter-name">Waiter</div>
              <div className="waiter-role">Staff</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-link">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="waiter-main">{children}</div>
    </div>
  );
}
