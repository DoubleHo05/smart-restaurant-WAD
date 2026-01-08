import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navigation.css";

export default function Navigation() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  const isSuperAdmin = user?.roles?.includes("super_admin");

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h2 className="nav-logo">🍽️ Smart Restaurant</h2>
        <div className="nav-links">
          <Link to="/" className={isActive("/")}>
            🪑 Tables
          </Link>
          <Link to="/categories" className={isActive("/categories")}>
            📁 Categories
          </Link>
          <Link to="/items" className={isActive("/items")}>
            🍜 Menu Items
          </Link>
          <Link to="/modifiers" className={isActive("/modifiers")}>
            ➕ Modifiers
          </Link>
          <Link to="/menu" className={isActive("/menu")}>
            📱 Guest Menu
          </Link>
          {isSuperAdmin && (
            <Link
              to="/system-admin"
              className={isActive("/system-admin")}
            >
              ⚙️ System Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
