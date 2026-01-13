import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi, Order, OrdersResponse } from "../api/ordersApi";
import OrderDetailModal, { OrderDetail } from "../components/OrderDetailModal";
import OrderStatusBadge from "../components/OrderStatusBadge";
import "../App.css";

type OrderStatusFilter =
  | "all"
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed";

export default function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<
    "today" | "yesterday" | "week" | "month" | "all"
  >("today");

  // Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;

  // Calculate date range based on filter
  const getDateRange = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case "today":
        return { start_date: today.toISOString() };
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          start_date: yesterday.toISOString(),
          end_date: today.toISOString(),
        };
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start_date: weekAgo.toISOString() };
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { start_date: monthAgo.toISOString() };
      case "all":
      default:
        return {};
    }
  }, [dateFilter]);

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = getDateRange();
      const params: any = {
        ...dateRange,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await ordersApi.getAll(params);

      // Handle both array and object response formats
      if (Array.isArray(response)) {
        setOrders(response);
        setTotalOrders(response.length);
      } else {
        const data = response as OrdersResponse;
        setOrders(data.data || []);
        setTotalOrders(data.total || 0);
      }
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      setError(err.response?.data?.message || "Failed to load orders");
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter, getDateRange]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter]);

  // Cleanup state on unmount
  useEffect(() => {
    return () => {
      setShowDetailsModal(false);
      setSelectedOrder(null);
    };
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await ordersApi.updateStatus(orderId, "accepted");
      loadOrders();
    } catch (err) {
      console.error("Failed to accept order:", err);
      alert("Failed to accept order. Please try again.");
    }
  };

  const handleStartPreparing = async (orderId: string) => {
    try {
      await ordersApi.updateStatus(orderId, "preparing");
      loadOrders();
    } catch (err) {
      console.error("Failed to start preparing order:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  const handleMarkReady = async (orderId: string) => {
    try {
      await ordersApi.updateStatus(orderId, "ready");
      loadOrders();
    } catch (err) {
      console.error("Failed to mark order as ready:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  const handleMarkServed = async (orderId: string) => {
    try {
      await ordersApi.updateStatus(orderId, "served");
      loadOrders();
    } catch (err) {
      console.error("Failed to mark order as served:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await ordersApi.updateStatus(orderId, "completed");
      loadOrders();
    } catch (err) {
      console.error("Failed to complete order:", err);
      alert("Failed to complete order. Please try again.");
    }
  };

  // Convert Order to OrderDetail format for modal
  const convertToOrderDetail = (order: Order): OrderDetail => {
    return {
      id: order.id,
      order_number: order.order_number,
      table_id: order.table_id,
      table_number: order.table?.table_number,
      customer_id: order.customer_id,
      status: order.status,
      total_price: Number(order.total) || 0,
      special_instructions: order.special_requests,
      items: (order.order_items || []).map((item) => ({
        id: item.id,
        menu_item_id: item.menu_item_id,
        name: item.menu_item?.name || "Unknown Item",
        quantity: item.quantity,
        unit_price: Number(item.unit_price) || 0,
        notes: item.special_requests,
        modifiers: (item.modifiers || []).map((m) => ({
          id: m.id,
          name: m.modifier_option?.name || "Unknown Modifier",
          price: Number(m.price_adjustment) || 0,
        })),
      })),
      created_at: order.created_at,
      updated_at: order.updated_at,
      accepted_at: order.accepted_at,
      preparing_started_at: order.preparing_at,
      ready_at: order.ready_at,
      served_at: order.served_at,
      completed_at: order.completed_at,
    };
  };

  // Get status counts from loaded orders
  const getStatusCount = (status: OrderStatusFilter) => {
    if (status === "all") return totalOrders;
    return orders.filter((o) => o.status.toLowerCase() === status).length;
  };

  // Filter orders by status client-side (since API might not support all filters)
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === statusFilter);

  // Pagination
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleOpenKDS = () => {
    navigate("/kitchen/kds");
  };

  const handleManualOrder = () => {
    alert("Manual order creation feature coming soon!");
  };

  const handleRefresh = () => {
    loadOrders();
  };

  // Get action buttons based on order status
  const getActionButtons = (order: Order) => {
    const status = order.status.toLowerCase();
    const buttons: React.ReactElement[] = [];

    if (status === "pending") {
      buttons.push(
        <button
          key="accept"
          className="btn-action accept"
          onClick={(e) => {
            e.stopPropagation();
            handleAcceptOrder(order.id);
          }}
        >
          Accept
        </button>
      );
    }

    if (status === "accepted") {
      buttons.push(
        <button
          key="preparing"
          className="btn-action preparing"
          onClick={(e) => {
            e.stopPropagation();
            handleStartPreparing(order.id);
          }}
        >
          Start Preparing
        </button>
      );
    }

    if (status === "preparing") {
      buttons.push(
        <button
          key="ready"
          className="btn-action ready"
          onClick={(e) => {
            e.stopPropagation();
            handleMarkReady(order.id);
          }}
        >
          Mark Ready
        </button>
      );
    }

    if (status === "ready") {
      buttons.push(
        <button
          key="served"
          className="btn-action complete"
          onClick={(e) => {
            e.stopPropagation();
            handleMarkServed(order.id);
          }}
        >
          Mark Served
        </button>
      );
    }

    if (status === "served") {
      buttons.push(
        <button
          key="complete"
          className="btn-action complete"
          onClick={(e) => {
            e.stopPropagation();
            handleCompleteOrder(order.id);
          }}
        >
          Complete
        </button>
      );
    }

    buttons.push(
      <button
        key="view"
        className="btn-action view"
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetails(order);
        }}
      >
        View
      </button>
    );

    return buttons;
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get items preview text
  const getItemsPreview = (order: Order) => {
    const items = order.order_items || [];
    if (items.length === 0) return "No items";

    const preview = items
      .slice(0, 2)
      .map((item) => `${item.quantity}x ${item.menu_item?.name || "Unknown"}`)
      .join(", ");

    if (items.length > 2) {
      return `${preview} +${items.length - 2} more`;
    }
    return preview;
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="page-title">Orders Management</h1>
          <p className="page-subtitle">
            Manage and track all restaurant orders
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-secondary" onClick={handleRefresh}>
            🔄 Refresh
          </button>
          <button className="btn-secondary" onClick={handleOpenKDS}>
            📺 Open KDS
          </button>
          <button className="btn-primary" onClick={handleManualOrder}>
            + Manual Order
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button
          className={`status-tab ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All Orders
          <span className="tab-count">{totalOrders}</span>
        </button>
        <button
          className={`status-tab ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
          <span className="tab-count warning">{getStatusCount("pending")}</span>
        </button>
        <button
          className={`status-tab ${
            statusFilter === "accepted" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("accepted")}
        >
          Accepted
          <span className="tab-count">{getStatusCount("accepted")}</span>
        </button>
        <button
          className={`status-tab ${
            statusFilter === "preparing" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("preparing")}
        >
          Preparing
          <span className="tab-count">{getStatusCount("preparing")}</span>
        </button>
        <button
          className={`status-tab ${statusFilter === "ready" ? "active" : ""}`}
          onClick={() => setStatusFilter("ready")}
        >
          Ready
          <span className="tab-count success">{getStatusCount("ready")}</span>
        </button>
        <button
          className={`status-tab ${statusFilter === "served" ? "active" : ""}`}
          onClick={() => setStatusFilter("served")}
        >
          Served
          <span className="tab-count">{getStatusCount("served")}</span>
        </button>
        <button
          className={`status-tab ${
            statusFilter === "completed" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("completed")}
        >
          Completed
          <span className="tab-count">{getStatusCount("completed")}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select
          className="filter-select"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="table-card">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}
          >
            <p>⚠️ {error}</p>
            <button
              className="btn-primary"
              onClick={handleRefresh}
              style={{ marginTop: "10px" }}
            >
              Try Again
            </button>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}
          >
            <p>📋 No orders found</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              {statusFilter !== "all"
                ? `No ${statusFilter} orders for the selected time period.`
                : "No orders for the selected time period."}
            </p>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`order-row ${order.status.toLowerCase()}`}
                    onClick={() => handleViewDetails(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong>#{order.order_number}</strong>
                    </td>
                    <td>
                      <span className="table-badge">
                        Table{" "}
                        {order.table?.table_number || order.table_id.slice(-4)}
                      </span>
                    </td>
                    <td>
                      <div className="order-items-preview">
                        {getItemsPreview(order)}
                      </div>
                    </td>
                    <td>
                      <strong>${Number(order.total).toFixed(2)}</strong>
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>{formatTime(order.created_at)}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexWrap: "wrap",
                        }}
                      >
                        {getActionButtons(order)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages} ({filteredOrders.length}{" "}
                  orders)
                </span>
                <button
                  className="page-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailModal
          order={convertToOrderDetail(selectedOrder)}
          role="admin"
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          onAccept={async () => {
            await handleAcceptOrder(selectedOrder.id);
          }}
          onStartPreparing={async () => {
            await handleStartPreparing(selectedOrder.id);
          }}
          onMarkReady={async () => {
            await handleMarkReady(selectedOrder.id);
          }}
          onServe={async () => {
            await handleMarkServed(selectedOrder.id);
          }}
        />
      )}
    </div>
  );
}
