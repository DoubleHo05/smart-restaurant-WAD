import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerOrderHistory } from "../../api/customersApi";
import "./OrderHistory.css";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  restaurant: {
    id: string;
    name: string;
  };
  table: {
    table_number: string;
  };
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    menu_item: {
      id: string;
      name: string;
      price: number;
    };
    modifiers: Array<{
      modifier_option: {
        name: string;
        price_adjustment: number;
      };
    }>;
  }>;
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const authUser = localStorage.getItem("auth_user");
      if (!authUser) {
        navigate("/");
        return;
      }

      const user = JSON.parse(authUser);
      const filters =
        statusFilter !== "all" ? { status: statusFilter } : undefined;

      const response = await getCustomerOrderHistory(user.id, filters);
      setOrders(response.data);
    } catch (err: any) {
      console.error("Error loading orders:", err);
      setError(err.response?.data?.message || "Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "status-pending",
      accepted: "status-accepted",
      preparing: "status-preparing",
      ready: "status-ready",
      served: "status-served",
      cancelled: "status-cancelled",
      rejected: "status-rejected",
    };
    return statusMap[status] || "status-pending";
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      pending: "Pending",
      accepted: "Accepted",
      preparing: "Preparing",
      ready: "Ready",
      served: "Served",
      cancelled: "Cancelled",
      rejected: "Rejected",
    };
    return statusLabels[status] || status;
  };

  const getStatusEmoji = (status: string) => {
    const emojiMap: { [key: string]: string } = {
      pending: "⏳",
      accepted: "✅",
      preparing: "👨‍🍳",
      ready: "🔔",
      served: "✨",
      cancelled: "❌",
      rejected: "⛔",
    };
    return emojiMap[status] || "📦";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const handleReorder = (order: Order) => {
    // Store order items in localStorage for re-ordering
    const cartItems = order.order_items.map((item) => ({
      id: item.menu_item.id,
      name: item.menu_item.name,
      price: item.menu_item.price,
      quantity: item.quantity,
      modifiers: item.modifiers.map((mod) => ({
        name: mod.modifier_option.name,
        price_adjustment: mod.modifier_option.price_adjustment,
      })),
    }));

    localStorage.setItem("reorder_items", JSON.stringify(cartItems));
    localStorage.setItem("reorder_restaurant_id", order.restaurant.id);

    // Navigate to ordering menu
    navigate(`/customer/order?restaurant=${order.restaurant.id}`);
  };

  const filteredOrders = orders.filter((order) => {
    if (searchQuery.trim() === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.restaurant.name.toLowerCase().includes(query)
    );
  });

  const user = JSON.parse(localStorage.getItem("auth_user") || "{}");

  return (
    <div className="order-history-container">
      {/* Header */}
      <div className="order-history-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span>←</span>
        </button>
        <div className="header-content">
          <h1 className="header-title">Order History</h1>
          <p className="header-subtitle">View your past orders</p>
        </div>
        <div className="user-avatar">
          {user.full_name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="filter-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by order number or restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="status-filters">
          <button
            className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${statusFilter === "served" ? "active" : ""}`}
            onClick={() => setStatusFilter("served")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${statusFilter === "preparing" ? "active" : ""}`}
            onClick={() => setStatusFilter("preparing")}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${statusFilter === "cancelled" ? "active" : ""}`}
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="order-history-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button className="retry-btn" onClick={loadOrders}>
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No orders found</h3>
            <p>
              {searchQuery
                ? "Try adjusting your search"
                : statusFilter !== "all"
                  ? "No orders with this status"
                  : "You haven't placed any orders yet"}
            </p>
            <button
              className="browse-btn"
              onClick={() => navigate("/customer/order")}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3 className="order-number">{order.order_number}</h3>
                    <p className="order-restaurant">
                      📍 {order.restaurant.name}
                    </p>
                    <p className="order-time">
                      🕐 {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span
                    className={`order-status-badge ${getStatusBadgeClass(order.status)}`}
                  >
                    <span className="status-emoji">
                      {getStatusEmoji(order.status)}
                    </span>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-items-preview">
                  <h4 className="items-title">
                    Items ({order.order_items.length})
                  </h4>
                  {order.order_items.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <span className="item-qty">{item.quantity}x</span>
                      <span className="item-name">{item.menu_item.name}</span>
                      <span className="item-price">
                        {Math.round(item.subtotal).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">
                      {Math.round(order.total).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <button
                    className="reorder-btn"
                    onClick={() => handleReorder(order)}
                  >
                    <span className="reorder-icon">🔄</span>
                    Re-order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
