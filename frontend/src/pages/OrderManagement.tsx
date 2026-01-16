import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi, Order, OrdersResponse } from "../api/ordersApi";
import OrderDetailModal, { OrderDetail } from "../components/OrderDetailModal";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useRestaurant } from "../contexts/RestaurantContext";
import "../App.css";

type OrderStatusFilter =
  | "all"
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed";

type ViewMode = "active" | "history";

export default function OrderManagement() {
  const navigate = useNavigate();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("active");

  // Filters
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<
    "today" | "yesterday" | "week" | "month" | "all"
  >("today");

  // Advanced filters for history
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [tableSearch, setTableSearch] = useState("");

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
    if (!selectedRestaurant || restaurantLoading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const restaurantId = selectedRestaurant.id;

      let response;

      if (viewMode === "history") {
        // Use history endpoint for completed orders
        const filters: any = {
          restaurant_id: restaurantId,
        };

        if (startDate) filters.start_date = startDate;
        if (endDate) filters.end_date = endDate;
        if (customerSearch) filters.customer_id = customerSearch;
        if (tableSearch) filters.table_id = tableSearch;
        if (statusFilter !== "all") filters.status = statusFilter;

        response = await ordersApi.getHistory(filters);
      } else {
        // Active orders (today by default)
        const dateRange = getDateRange();
        const params: any = {
          restaurant_id: restaurantId,
          ...dateRange,
        };

        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        response = await ordersApi.getAll(params);
      }

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
  }, [
    statusFilter,
    dateFilter,
    viewMode,
    startDate,
    endDate,
    customerSearch,
    tableSearch,
    getDateRange,
  ]);

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
      const result = await ordersApi.complete(orderId);

      // Show success message with table info
      const message = result.tableReleased
        ? `Order completed! Table ${result.tableNumber} has been released and is now available.`
        : `Order completed! Table ${result.tableNumber} still has other active orders.`;

      alert(message);
      loadOrders();
    } catch (err: any) {
      console.error("Failed to complete order:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to complete order. Please try again.";
      alert(errorMsg);
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

  const handleExportCSV = async () => {
    try {
      const restaurantId = localStorage.getItem("restaurant_id");
      if (!restaurantId) {
        alert("Restaurant ID not found");
        return;
      }

      const filters: any = {
        restaurant_id: restaurantId,
        export: "csv",
      };

      if (viewMode === "history") {
        if (startDate) filters.start_date = startDate;
        if (endDate) filters.end_date = endDate;
        if (customerSearch) filters.customer_id = customerSearch;
        if (tableSearch) filters.table_id = tableSearch;
        if (statusFilter !== "all") filters.status = statusFilter;
      } else {
        const dateRange = getDateRange();
        Object.assign(filters, dateRange);
        if (statusFilter !== "all") filters.status = statusFilter;
      }

      const csvData = await ordersApi.getHistory(filters);

      // Create download link
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-${viewMode}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Failed to export CSV:", err);
      alert(err.response?.data?.message || "Failed to export CSV");
    }
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setCustomerSearch("");
    setTableSearch("");
    setStatusFilter("all");
    setDateFilter("today");
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
          <button className="btn-secondary" onClick={handleExportCSV}>
            📥 Export CSV
          </button>
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

      {/* View Mode Tabs */}
      <div className="status-tabs" style={{ marginBottom: "10px" }}>
        <button
          className={`status-tab ${viewMode === "active" ? "active" : ""}`}
          onClick={() => {
            setViewMode("active");
            setStatusFilter("all");
            setDateFilter("today");
          }}
        >
          📋 Active Orders
          <span className="tab-count">
            {viewMode === "active" ? totalOrders : ""}
          </span>
        </button>
        <button
          className={`status-tab ${viewMode === "history" ? "active" : ""}`}
          onClick={() => {
            setViewMode("history");
            setStatusFilter("all");
            setDateFilter("all");
          }}
        >
          📚 Order History
        </button>
      </div>

      {/* Status Tabs */}
      {viewMode === "active" && (
        <div className="status-tabs">
          <button
            className={`status-tab ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Orders
            <span className="tab-count">{totalOrders}</span>
          </button>
          <button
            className={`status-tab ${
              statusFilter === "pending" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
            <span className="tab-count warning">
              {getStatusCount("pending")}
            </span>
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
            className={`status-tab ${
              statusFilter === "served" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("served")}
          >
            Served
            <span className="tab-count">{getStatusCount("served")}</span>
          </button>
        </div>
      )}

      {/* Filters */}
      {viewMode === "active" ? (
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
      ) : (
        <div className="filters-bar" style={{ flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px", flex: "1" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <label style={{ fontSize: "12px", color: "#6b7280" }}>
                Start Date
              </label>
              <input
                type="date"
                className="filter-select"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: "auto" }}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <label style={{ fontSize: "12px", color: "#6b7280" }}>
                End Date
              </label>
              <input
                type="date"
                className="filter-select"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: "auto" }}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <label style={{ fontSize: "12px", color: "#6b7280" }}>
                Status
              </label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatusFilter)
                }
                style={{ width: "auto" }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <button className="btn-secondary" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

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
