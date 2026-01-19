import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ordersApi, { Order } from "../../api/ordersApi";
import "./OrderStatus.css";

function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const isRegistered = !!localStorage.getItem("auth_token");

  useEffect(() => {
    fetchOrders();
    // Poll every 10 seconds for updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [id]); // Re-fetch when id changes

  const fetchOrders = async () => {
    try {
      let ordersData: Order[] = [];

      // Always fetch all orders for current table to show session total
      const tableInfo = localStorage.getItem("table_info");
      if (tableInfo) {
        const { id: tableId } = JSON.parse(tableInfo);
        const response = await ordersApi.getByTable(tableId);
        // Backend returns { data: [], total: N }, extract the data array
        const allOrders = (response as any).data || response;
        
        // Filter out completed orders (already paid)
        ordersData = allOrders.filter((order: Order) => order.status !== 'completed');
      }

      setOrders(ordersData);

      // Calculate total (backend returns 'total', not 'total_price')
      const total = ordersData.reduce(
        (sum, order) => sum + Number((order as any).total || 0),
        0,
      );
      setSessionTotal(total);

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Received",
      accepted: "Accepted",
      preparing: "Preparing",
      ready: "Ready",
      served: "Served",
      completed: "Completed",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    if (status === "preparing") return "preparing";
    if (status === "ready") return "ready";
    if (status === "completed" || status === "served") return "completed";
    return "";
  };

  const getProgressSteps = (status: string) => {
    const steps = ["pending", "preparing", "ready"];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      label: getStatusText(step),
      completed:
        index < currentIndex || (index === currentIndex && status === "ready"),
      active: index === currentIndex && status !== "ready",
      stepName: step,
    }));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const created = new Date(timestamp).getTime();
    const diff = Math.floor((now - created) / 1000 / 60); // minutes

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} mins ago`;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m ago`;
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  };

  const toggleOrderItems = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getItemStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; icon: string; className: string }
    > = {
      QUEUED: { label: "Queued", icon: "⏳", className: "status-queued" },
      COOKING: { label: "Cooking", icon: "🔥", className: "status-cooking" },
      READY: { label: "Ready", icon: "✓", className: "status-ready" },
      REJECTED: { label: "Rejected", icon: "❌", className: "status-rejected" },
    };
    return statusConfig[status] || statusConfig.QUEUED;
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
        <span className="header-title">Your Orders</span>
        <span className="header-table">
          {(() => {
            const tableInfo = localStorage.getItem("table_info");
            if (tableInfo) {
              const { tableNumber } = JSON.parse(tableInfo);
              return `Table ${tableNumber}`;
            }
            return "Table";
          })()}
        </span>
      </div>

      {/* Content */}
      <div className="content" style={{ paddingBottom: "100px" }}>
        {/* Current Session Card */}
        <div className="session-card">
          <div className="session-header">
            <span className="session-title">Current Session</span>
            <span className="session-total">
              {Math.round(Number(sessionTotal)).toLocaleString("vi-VN")}₫
            </span>
          </div>
          <button
            className="request-bill-btn"
            onClick={() => navigate("/customer/payment")}
          >
            💳 Request Bill
          </button>
          <div className="session-meta">
            <span>📄 {orders.length} Orders</span>
            <span>
              🍽️{" "}
              {orders.reduce(
                (sum, o) => sum + ((o as any).order_items?.length || 0),
                0,
              )}{" "}
              Items
            </span>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="empty-icon">📋</div>
            <h2>No orders yet</h2>
            <p>Start by browsing our menu and placing your first order!</p>
            <button
              className="browse-menu-btn"
              onClick={() => navigate("/customer/order")}
            >
              🍽️ Browse Menu
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const steps = getProgressSteps(order.status);
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-number">
                      Order #{order.order_number}
                    </span>
                    <span className="order-time">
                      {getTimeAgo(order.created_at)}
                    </span>
                  </div>
                  <span
                    className={`order-status ${getStatusClass(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="order-progress">
                  {steps.map((step, index) => (
                    <React.Fragment key={index}>
                      <div
                        className={`progress-step ${step.completed ? "completed" : ""} ${step.active ? "active" : ""} ${step.active && (step as any).stepName === "preparing" ? "preparing" : ""}`}
                      >
                        <div className="progress-dot">
                          {step.completed ? "✓" : ""}
                        </div>
                        <span>{step.label}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`progress-line ${step.completed ? "completed" : ""}`}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Ready notification */}
                {order.status === "ready" && (
                  <div className="ready-notification">
                    <span style={{ fontSize: "20px" }}>🎉</span>
                    <span>
                      Your order is ready! Please pick up at the counter.
                    </span>
                  </div>
                )}

                {/* View Items Button - Registered Users Only */}
                {isRegistered && (order as any).order_items?.length > 0 && (
                  <button
                    className="view-items-btn"
                    onClick={() => toggleOrderItems(order.id)}
                  >
                    <span className="btn-icon">📋</span>
                    <span>
                      View Items ({(order as any).order_items.length})
                    </span>
                    <span className="btn-arrow">
                      {expandedOrders.has(order.id) ? "▲" : "▼"}
                    </span>
                  </button>
                )}

                {/* Expandable Order Items - Registered Users Only */}
                {isRegistered && expandedOrders.has(order.id) && (
                  <div className="order-items-expanded">
                    {(order as any).order_items?.map((item: any) => {
                      const statusBadge = getItemStatusBadge(
                        item.status || "QUEUED",
                      );
                      return (
                        <div key={item.id} className="order-item-detailed">
                          <div className="item-main">
                            <span className="item-qty">{item.quantity}x</span>
                            <div className="item-info">
                              <span className="item-name">
                                {item.menu_item?.name || "Item"}
                              </span>
                              {item.modifiers && item.modifiers.length > 0 && (
                                <span className="item-mods">
                                  {item.modifiers
                                    .map((m: any) => m.modifier_option?.name)
                                    .join(", ")}
                                </span>
                              )}
                              {item.special_requests && (
                                <span className="item-special-requests">
                                  Note: {item.special_requests}
                                </span>
                              )}
                              {item.status === "REJECTED" &&
                                item.rejection_reason && (
                                  <span className="item-rejection-reason">
                                    Reason: {item.rejection_reason}
                                  </span>
                                )}
                            </div>
                          </div>
                          <span
                            className={`item-status-badge ${statusBadge.className}`}
                          >
                            <span className="status-icon">
                              {statusBadge.icon}
                            </span>
                            <span className="status-label">
                              {statusBadge.label}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Order Items Summary - Always Visible */}
                {!isRegistered && (
                  <div className="order-items">
                    {(order as any).order_items?.map((item: any) => (
                      <div key={item.id} className="order-item">
                        <span className="item-qty">{item.quantity}x</span>
                        <span className="item-name">
                          {item.menu_item?.name || "Item"}
                          {item.modifiers && item.modifiers.length > 0 && (
                            <span className="item-mods">
                              {" "}
                              (
                              {item.modifiers
                                .map((m: any) => m.modifier_option?.name)
                                .join(", ")}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-total">
                  <span>Order Total</span>
                  <span>
                    {Math.round((order as any).total || 0).toLocaleString(
                      "vi-VN",
                    )}
                    ₫
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Add more items prompt - only show when there are orders */}
        {orders.length > 0 && (
          <div className="add-more-section">
            <p>Want to order more?</p>
            <button
              className="add-more-btn"
              onClick={() => navigate("/customer/order")}
            >
              🍽️ Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderStatus;
