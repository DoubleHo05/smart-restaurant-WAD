import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WaiterTables.css";
import {
  getTableStatusOverview,
  updateTableOccupancyStatus,
  TableStatusOverview,
} from "../../api/waiterTablesApi";
import { useRestaurant } from "../../contexts/RestaurantContext";

type FilterType = "all" | "available" | "occupied" | "reserved";

export default function WaiterTables() {
  const navigate = useNavigate();
  const { restaurants } = useRestaurant();
  const [tables, setTables] = useState<TableStatusOverview[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTable, setSelectedTable] =
    useState<TableStatusOverview | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const restaurantId = restaurants.length > 0 ? restaurants[0].id : null;

  useEffect(() => {
    if (restaurantId) {
      loadTables();
    }
    // TODO: Setup Socket.IO for real-time updates
    // const socket = io(API_URL);
    // socket.on('table_status_updated', () => loadTables());
    // return () => socket.disconnect();
  }, [restaurantId]);

  const loadTables = async () => {
    if (!restaurantId) return;

    setLoading(true);
    try {
      const data = await getTableStatusOverview(restaurantId);
      setTables(data);
    } catch (error) {
      console.error("Error loading tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = (table: TableStatusOverview) => {
    setSelectedTable(table);
    setShowDetailModal(true);
  };

  const handleStatusChange = async (
    tableId: string,
    newStatus: "available" | "occupied" | "reserved"
  ) => {
    try {
      if (!restaurantId) return;
      await updateTableOccupancyStatus(tableId, {
        restaurant_id: restaurantId,
        status: newStatus,
      });
      await loadTables();
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error updating table status:", error);
      alert("Failed to update table status. Please try again.");
    }
  };

  const getFilteredTables = (): TableStatusOverview[] => {
    if (filter === "all") return tables;
    return tables.filter((table) => table.status === filter);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "available":
        return "#10b981"; // Green
      case "occupied":
        return "#ef4444"; // Red
      case "reserved":
        return "#f59e0b"; // Orange
      default:
        return "#6b7280"; // Gray
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "available":
        return "✓";
      case "occupied":
        return "👥";
      case "reserved":
        return "🔒";
      default:
        return "?";
    }
  };

  const getStats = () => {
    const available = tables.filter((t) => t.status === "available").length;
    const occupied = tables.filter((t) => t.status === "occupied").length;
    const reserved = tables.filter((t) => t.status === "reserved").length;
    return { available, occupied, reserved, total: tables.length };
  };

  const stats = getStats();

  return (
    <div className="waiter-tables-page">
      <div className="page-title">
        <h1>Table Overview</h1>
        <p className="page-subtitle">Manage table status and view orders</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#e8f8f5", color: "#10b981" }}
          >
            ✓
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.available}</div>
            <div className="stat-label">Available</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#fef2f2", color: "#ef4444" }}
          >
            👥
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.occupied}</div>
            <div className="stat-label">Occupied</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#fef9e7", color: "#f59e0b" }}
          >
            🔒
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.reserved}</div>
            <div className="stat-label">Reserved</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#ebf5fb", color: "#3498db" }}
          >
            🪑
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tables</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Tables ({tables.length})
        </button>
        <button
          className={`filter-tab ${filter === "available" ? "active" : ""}`}
          onClick={() => setFilter("available")}
        >
          Available ({stats.available})
        </button>
        <button
          className={`filter-tab ${filter === "occupied" ? "active" : ""}`}
          onClick={() => setFilter("occupied")}
        >
          Occupied ({stats.occupied})
        </button>
        <button
          className={`filter-tab ${filter === "reserved" ? "active" : ""}`}
          onClick={() => setFilter("reserved")}
        >
          Reserved ({stats.reserved})
        </button>
      </div>

      {/* Tables Grid */}
      <div className="tables-grid">
        {loading ? (
          <div className="loading-state">Loading tables...</div>
        ) : getFilteredTables().length === 0 ? (
          <div className="empty-state">
            <p>No tables found</p>
          </div>
        ) : (
          getFilteredTables().map((table) => (
            <div
              key={table.id}
              className="table-card"
              style={{ borderLeftColor: getStatusColor(table.status) }}
              onClick={() => handleTableClick(table)}
            >
              <div className="table-header">
                <div className="table-number">{table.table_number}</div>
                <div
                  className="table-status-badge"
                  style={{
                    background: getStatusColor(table.status) + "20",
                    color: getStatusColor(table.status),
                  }}
                >
                  {getStatusIcon(table.status)} {table.status}
                </div>
              </div>
              <div className="table-details">
                <div className="table-info-item">
                  <span className="info-icon">👥</span>
                  <span className="info-text">Capacity: {table.capacity}</span>
                </div>
                {table.location && (
                  <div className="table-info-item">
                    <span className="info-icon">📍</span>
                    <span className="info-text">{table.location}</span>
                  </div>
                )}
                {table.current_orders && table.current_orders.length > 0 && (
                  <div className="table-info-item">
                    <span className="info-icon">📦</span>
                    <span className="info-text">
                      {table.current_orders.length} active order(s)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table Detail Modal */}
      {showDetailModal && selectedTable && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Table {selectedTable.table_number}</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="table-detail-info">
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span
                    className="info-value"
                    style={{
                      color: getStatusColor(selectedTable.status),
                      fontWeight: 600,
                    }}
                  >
                    {getStatusIcon(selectedTable.status)}{" "}
                    {selectedTable.status.toUpperCase()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Capacity:</span>
                  <span className="info-value">
                    {selectedTable.capacity} people
                  </span>
                </div>
                {selectedTable.location && (
                  <div className="info-row">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{selectedTable.location}</span>
                  </div>
                )}
              </div>

              {selectedTable.current_orders &&
                selectedTable.current_orders.length > 0 && (
                  <div className="current-orders-section">
                    <h3>Current Orders</h3>
                    {selectedTable.current_orders.map((order) => (
                      <div key={order.id} className="order-summary">
                        <div className="order-summary-header">
                          <span className="order-number">
                            {order.order_number}
                          </span>
                          <span className="order-status">{order.status}</span>
                        </div>
                        <div className="order-summary-info">
                          <span>{order.items_count} items</span>
                          <span className="order-total">
                            ${order.total_price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              <div className="status-actions">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  <button
                    className={`status-btn ${selectedTable.status === "available" ? "active" : ""
                      }`}
                    style={{ borderColor: "#10b981" }}
                    onClick={() =>
                      handleStatusChange(selectedTable.id, "available")
                    }
                  >
                    <span style={{ color: "#10b981" }}>✓</span> Available
                  </button>
                  <button
                    className={`status-btn ${selectedTable.status === "occupied" ? "active" : ""
                      }`}
                    style={{ borderColor: "#ef4444" }}
                    onClick={() =>
                      handleStatusChange(selectedTable.id, "occupied")
                    }
                  >
                    <span style={{ color: "#ef4444" }}>👥</span> Occupied
                  </button>
                  <button
                    className={`status-btn ${selectedTable.status === "reserved" ? "active" : ""
                      }`}
                    style={{ borderColor: "#f59e0b" }}
                    onClick={() =>
                      handleStatusChange(selectedTable.id, "reserved")
                    }
                  >
                    <span style={{ color: "#f59e0b" }}>🔒</span> Reserved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
