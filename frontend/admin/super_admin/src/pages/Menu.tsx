import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./Menu.css";

interface Category {
  id: string;
  name: string;
  description?: string;
  display_order: number;
}

interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  selectionType: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  options: ModifierOption[];
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  prepTimeMinutes: number;
  isChefRecommended: boolean;
  category: {
    id: string;
    name: string;
  };
  primaryPhoto: string | null;
  photos: Photo[];
  modifierGroups: ModifierGroup[];
}

interface MenuData {
  success: boolean;
  message: string;
  tableInfo: {
    id: string;
    number: string;
    capacity: number;
    location?: string;
  };
  categories: Category[];
  items: MenuItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Menu() {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table");
  const token = searchParams.get("token");

  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const loadMenu = async () => {
    if (!tableId || !token) {
      setError("Invalid QR code: Missing table or token");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        table: tableId,
        token: token,
      });

      if (selectedCategory) {
        params.append("categoryId", selectedCategory);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/menu?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load menu");
      }

      const data = await response.json();
      setMenuData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [tableId, token, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-spinner">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <p className="error-hint">
            Please scan the QR code again or contact staff for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return null;
  }

  return (
    <div className="menu-container">
      {/* Header */}
      <div className="menu-header">
        <h1>🍽️ Smart Restaurant</h1>
        <div className="table-info">
          <p className="welcome-message">{menuData.message}</p>
          <div className="table-details">
            {menuData.tableInfo.location && (
              <span>📍 {menuData.tableInfo.location}</span>
            )}
            <span>👥 Capacity: {menuData.tableInfo.capacity}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="menu-controls">
        <input
          type="text"
          placeholder="Search menu items..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="category-filter">
          <button
            className={`category-btn ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {menuData.categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-section">
        <h2>Menu</h2>
        {menuData.items.length === 0 ? (
          <p className="no-items">No items found</p>
        ) : (
          <div className="menu-grid">
            {menuData.items.map((item) => (
              <div key={item.id} className="menu-item-card">
                <div className="menu-item-image">
                  <img
                    src={
                      item.primaryPhoto
                        ? `${API_BASE_URL}${item.primaryPhoto}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  {item.isChefRecommended && (
                    <span className="chef-badge">👨‍🍳 Chef's Pick</span>
                  )}
                </div>
                <div className="menu-item-info">
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    <span className="category-tag">{item.category.name}</span>
                  </div>
                  {item.description && (
                    <p className="menu-item-description">{item.description}</p>
                  )}
                  {item.prepTimeMinutes > 0 && (
                    <p className="prep-time">⏱️ {item.prepTimeMinutes} min</p>
                  )}
                  <p className="menu-item-price">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </p>
                  {item.modifierGroups.length > 0 && (
                    <div className="modifiers-info">
                      <p className="modifiers-label">Customization available</p>
                    </div>
                  )}
                </div>
                <button className="order-button">Add to Order</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="menu-footer">
        <p>Need assistance? Please call a staff member</p>
        <p className="item-count">
          Showing {menuData.items.length} of {menuData.pagination.total} items
        </p>
      </div>
    </div>
  );
}
