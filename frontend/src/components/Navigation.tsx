import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

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
        </div>
      </div>
    </nav>
  );
}
