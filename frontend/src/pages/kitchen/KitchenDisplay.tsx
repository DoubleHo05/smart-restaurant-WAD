import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./KitchenDisplay.css";
import {
  getKitchenOrders,
  startPreparing,
  markReady,
  KitchenOrder,
} from "../../api/kitchenApi";

type OrderColumn = "received" | "preparing" | "ready";

export default function KitchenDisplay() {
  const navigate = useNavigate();
  const [receivedOrders, setReceivedOrders] = useState<KitchenOrder[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<KitchenOrder[]>([]);
  const [readyOrders, setReadyOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // TODO: Replace with actual restaurant ID from auth context
  const restaurantId = "temp-restaurant-id";

  useEffect(() => {
    loadOrders();

    // Auto-refresh every 5 seconds
    const refreshInterval = setInterval(() => {
      loadOrders();
    }, 5000);

    // Update clock every second
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // TODO: Setup Socket.IO for real-time updates
    // const socket = io(API_URL);
    // socket.on('order_accepted', () => loadOrders());
    // return () => socket.disconnect();

    return () => {
      clearInterval(refreshInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orders = await getKitchenOrders(restaurantId);

      // Separate orders by status
      const received = orders.filter((o) => o.status === "accepted");
      const preparing = orders.filter((o) => o.status === "preparing");
      const ready = orders.filter((o) => o.status === "ready");

      setReceivedOrders(received);
      setPreparingOrders(preparing);
      setReadyOrders(ready);
    } catch (error) {
      console.error("Error loading kitchen orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPreparing = async (orderId: string) => {
    try {
      await startPreparing(orderId, restaurantId);
      await loadOrders();
    } catch (error) {
      console.error("Error starting preparation:", error);
      alert("Failed to start preparing order. Please try again.");
    }
  };

  const handleMarkReady = async (orderId: string) => {
    try {
      await markReady(orderId, restaurantId);
      await loadOrders();
    } catch (error) {
      console.error("Error marking order ready:", error);
      alert("Failed to mark order as ready. Please try again.");
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getTimeElapsed = (order: KitchenOrder): string => {
    const startTime = new Date(
      order.preparing_started_at || order.accepted_at || order.created_at
    );
    const elapsed = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 1000 / 60
    );
    return `${elapsed}:${String(
      Math.floor(((currentTime.getTime() - startTime.getTime()) / 1000) % 60)
    ).padStart(2, "0")}`;
  };

  const getUrgencyClass = (order: KitchenOrder): string => {
    if (!order.urgency) return "";
    if (order.urgency === "critical") return "critical";
    if (order.urgency === "warning") return "warning";
    return "";
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins === 0) return "Just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };

  const renderOrderCard = (order: KitchenOrder, column: OrderColumn) => {
    const isOverdue = order.urgency === "critical";
    const isWarning = order.urgency === "warning";

    return (
      <div key={order.id} className={`order-card ${getUrgencyClass(order)}`}>
        <div className="order-card-header">
          <h3 className="order-number">{order.order_number}</h3>
          <div className="table-badge">{order.table.table_number}</div>
        </div>

        <div className="order-status-bar">
          {column === "received" && (
            <div className="status-indicator new-order">
              ⚠ NEW ORDER - {getTimeAgo(order.created_at)}
            </div>
          )}
          {column === "preparing" && isOverdue && (
            <div className="status-indicator overdue">
              ⚠ OVERDUE - Target {order.estimated_prep_time} min
            </div>
          )}
          {column === "ready" && (
            <div className="status-indicator ready-status">
              ✓ Ready {getTimeAgo(order.ready_at || order.created_at)}
            </div>
          )}
        </div>

        {column === "preparing" && (
          <div className="timer">⏱ {getTimeElapsed(order)}</div>
        )}

        <div className="order-items-list">
          {order.order_items.map((item, idx) => (
            <div key={idx} className="order-item">
              <div className="item-quantity">{item.quantity}</div>
              <div className="item-details">
                <div className="item-name">{item.menu_item.name}</div>
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className="item-modifiers">
                    +{" "}
                    {item.modifiers
                      .map((m) => m.modifier_option.name)
                      .join(", ")}
                  </div>
                )}
                {item.notes && (
                  <div className="item-notes">📝 {item.notes}</div>
                )}
              </div>
              {item.notes?.toLowerCase().includes("hot") && (
                <span className="hot-indicator">🔥</span>
              )}
            </div>
          ))}
        </div>

        {column === "received" && (
          <button
            className="action-btn start-btn"
            onClick={() => handleStartPreparing(order.id)}
          >
            Start Preparing
          </button>
        )}

        {column === "preparing" && (
          <button
            className="action-btn ready-btn"
            onClick={() => handleMarkReady(order.id)}
          >
            Mark Ready
          </button>
        )}
      </div>
    );
  };

  const getStats = () => {
    const pending = receivedOrders.length;
    const cooking = preparingOrders.length;
    const ready = readyOrders.length;
    const overdue = [...receivedOrders, ...preparingOrders].filter(
      (o) => o.urgency === "critical"
    ).length;

    return { pending, cooking, ready, overdue };
  };

  const stats = getStats();

  return (
    <div className="kitchen-display">
      <div className="kds-header">
        <div className="header-left">
          <div className="kds-title">
            <span className="title-icon">🍴</span>
            <h1>Kitchen Display</h1>
          </div>
        </div>

        <div className="header-center">
          <div className="stats-row">
            <div className="stat-item pending">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">PENDING</div>
            </div>
            <div className="stat-item cooking">
              <div className="stat-number">{stats.cooking}</div>
              <div className="stat-label">COOKING</div>
            </div>
            <div className="stat-item ready">
              <div className="stat-number">{stats.ready}</div>
              <div className="stat-label">READY</div>
            </div>
            <div className="stat-item overdue">
              <div className="stat-number">{stats.overdue}</div>
              <div className="stat-label">OVERDUE</div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="current-time">{formatTime(currentTime)}</div>
          <button
            className={`sound-toggle ${soundEnabled ? "active" : ""}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            <span className="sound-icon">🔊</span>
            Sound {soundEnabled ? "ON" : "OFF"}
          </button>
          <button className="settings-btn">⚙️ Settings</button>
          <button
            className="exit-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            🚪 Exit
          </button>
        </div>
      </div>

      <div className="kds-columns">
        <div className="kds-column received-column">
          <div className="column-header received-header">
            <span className="column-icon">⚠</span>
            <h2>RECEIVED</h2>
            <span className="column-count">{receivedOrders.length}</span>
          </div>
          <div className="column-content">
            {receivedOrders.map((order) => renderOrderCard(order, "received"))}
          </div>
        </div>

        <div className="kds-column preparing-column">
          <div className="column-header preparing-header">
            <span className="column-icon">🔥</span>
            <h2>PREPARING</h2>
            <span className="column-count">{preparingOrders.length}</span>
          </div>
          <div className="column-content">
            {preparingOrders.map((order) =>
              renderOrderCard(order, "preparing")
            )}
          </div>
        </div>

        <div className="kds-column ready-column">
          <div className="column-header ready-header">
            <span className="column-icon">✓</span>
            <h2>READY</h2>
            <span className="column-count">{readyOrders.length}</span>
          </div>
          <div className="column-content">
            {readyOrders.map((order) => renderOrderCard(order, "ready"))}
          </div>
        </div>
      </div>
    </div>
  );
}
