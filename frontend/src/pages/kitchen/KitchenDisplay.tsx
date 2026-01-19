import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./KitchenDisplay.css";
import {
  getKitchenOrders,
  startPreparing,
  markReady,
  KitchenOrder,
  batchStartPreparing,
  getDelayedOrders,
  updateItemStatus,
} from "../../api/kitchenApi";
import OrderDetailModal, {
  OrderDetail,
} from "../../components/OrderDetailModal";
import { useStaffRestaurant } from "../../hooks/useStaffRestaurant";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { useAuth } from "../../contexts/AuthContext";

type OrderColumn = "received" | "preparing" | "ready";

export default function KitchenDisplay() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // For kitchen/waiter staff - get restaurant from restaurant_staff table
  const {
    restaurantId: staffRestaurantId,
    restaurantName: staffRestaurantName,
    loading: staffLoading,
    error: staffError,
  } = useStaffRestaurant();

  // For admin - get restaurant from context
  const { selectedRestaurant, loading: adminLoading } = useRestaurant();

  // Determine which restaurant to use based on user role
  const isAdmin =
    user?.roles?.includes("admin") && !user?.roles?.includes("super_admin");
  const isKitchenStaff = user?.roles?.includes("kitchen");

  const restaurantId = isAdmin ? selectedRestaurant?.id : staffRestaurantId;
  const restaurantName = isAdmin
    ? selectedRestaurant?.name
    : staffRestaurantName;
  const restaurantLoading = isAdmin ? adminLoading : staffLoading;
  const restaurantError = isAdmin ? null : staffError;

  const [receivedOrders, setReceivedOrders] = useState<KitchenOrder[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<KitchenOrder[]>([]);
  const [readyOrders, setReadyOrders] = useState<KitchenOrder[]>([]);
  const [delayedOrders, setDelayedOrders] = useState<KitchenOrder[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [showDelayedAlert, setShowDelayedAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
  const [batchView, setBatchView] = useState(false);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const newOrderSoundRef = useState<HTMLAudioElement | null>(null)[0];

  useEffect(() => {
    // Don't load orders if restaurant not loaded yet
    if (!restaurantId || restaurantLoading) {
      return;
    }

    // Initialize audio context for sound
    try {
      const ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      setAudioContext(ctx);
    } catch (e) {
      console.warn("Web Audio API not supported");
    }

    loadOrders();
    loadDelayedOrders();

    // Auto-refresh every 5 seconds
    const refreshInterval = setInterval(() => {
      loadOrders();
      loadDelayedOrders();
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
      audioContext?.close();
    };
  }, [restaurantId, restaurantLoading]);

  // Detect new orders and play sound
  useEffect(() => {
    if (
      receivedOrders.length > previousOrderCount &&
      soundEnabled &&
      audioContext
    ) {
      playNewOrderSound();
    }
    setPreviousOrderCount(receivedOrders.length);
  }, [receivedOrders.length]);

  const loadOrders = async () => {
    if (!restaurantId) {
      console.warn("[KitchenDisplay] No restaurant ID available");
      return;
    }

    try {
      setLoading(true);
      const orders = await getKitchenOrders(restaurantId);

      // Sort orders by priority score (highest priority first)
      const sortedOrders = orders.sort((a, b) => {
        const scoreA = a.priority_score || 0;
        const scoreB = b.priority_score || 0;
        return scoreB - scoreA;
      });

      // Separate orders by status
      const received = sortedOrders.filter((o) => o.status === "accepted");
      const preparing = sortedOrders.filter((o) => o.status === "preparing");
      const ready = sortedOrders.filter((o) => o.status === "ready");

      setReceivedOrders(received);
      setPreparingOrders(preparing);
      setReadyOrders(ready);
    } catch (error) {
      console.error("Error loading kitchen orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDelayedOrders = async () => {
    if (!restaurantId) {
      console.warn(
        "[KitchenDisplay] No restaurant ID available for delayed orders",
      );
      return;
    }

    try {
      const delayed = await getDelayedOrders(restaurantId, 0); // Get all delayed orders
      setDelayedOrders(delayed);

      // Show alert if there are new delayed orders
      if (delayed.length > 0 && soundEnabled) {
        setShowDelayedAlert(true);
      }
    } catch (error) {
      console.error("Error loading delayed orders:", error);
    }
  };

  const handleStartPreparing = async (orderId: string) => {
    if (!restaurantId) return;

    try {
      await startPreparing(orderId, restaurantId);
      setShowDetailModal(false);
      setSelectedOrder(null);
      await loadOrders();
    } catch (error) {
      console.error("Error starting preparation:", error);
      alert("Failed to start preparing order. Please try again.");
    }
  };

  const handleMarkReady = async (orderId: string) => {
    if (!restaurantId) return;

    try {
      await markReady(orderId, restaurantId);
      setShowDetailModal(false);
      setSelectedOrder(null);
      await loadOrders();
    } catch (error) {
      console.error("Error marking order ready:", error);
      alert("Failed to mark order as ready. Please try again.");
    }
  };

  const handleBatchPrepare = async () => {
    if (!restaurantId) return;

    if (selectedOrderIds.size === 0) {
      alert("Please select at least one order to batch prepare");
      return;
    }

    try {
      const orderIdsArray = Array.from(selectedOrderIds);
      await batchStartPreparing(orderIdsArray, restaurantId);
      setSelectedOrderIds(new Set());
      await loadOrders();
      alert(`Successfully started preparing ${orderIdsArray.length} orders`);
    } catch (error) {
      console.error("Error batch preparing orders:", error);
      alert("Failed to batch prepare orders. Please try again.");
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrderIds);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrderIds(newSelection);
  };

  const handleViewDetails = (order: KitchenOrder) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const convertToOrderDetail = (order: KitchenOrder): OrderDetail => {
    const items = order.items.map((item) => {
      const unitPrice = Number((item as any).unit_price || 0);
      const modifiers =
        item.modifiers?.map((m) => ({
          id: m.name,
          name: m.name,
          price: Number((m as any).price || 0),
        })) || [];

      return {
        id: item.id,
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        notes: item.special_requests,
        modifiers,
      };
    });

    // Calculate total price from items
    const totalPrice = items.reduce((sum, item) => {
      const modifiersTotal =
        item.modifiers?.reduce((mSum, m) => mSum + m.price, 0) || 0;
      return sum + (item.unit_price + modifiersTotal) * item.quantity;
    }, 0);

    return {
      id: order.id,
      order_number: order.order_number,
      table_id: order.table_id,
      table_number: order.table.table_number,
      status: order.status,
      total_price: totalPrice,
      special_instructions: order.special_instructions,
      items,
      created_at: order.created_at,
      updated_at: order.created_at,
      accepted_at: order.accepted_at,
      preparing_started_at: order.preparing_started_at,
      ready_at: order.ready_at,
    };
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
      order.preparing_started_at || order.accepted_at || order.created_at,
    );
    const elapsed = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 1000 / 60,
    );
    return `${elapsed}:${String(
      Math.floor(((currentTime.getTime() - startTime.getTime()) / 1000) % 60),
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
    const isSelected = selectedOrderIds.has(order.id);
    const isDelayed = order.is_delayed || false;

    return (
      <div
        key={order.id}
        className={`order-card ${getUrgencyClass(order)} ${
          isSelected ? "selected" : ""
        } ${isDelayed ? "delayed-order" : ""}`}
        onClick={() => handleViewDetails(order)}
        style={{ cursor: "pointer" }}
      >
        {column === "received" && (
          <div
            className="order-select-checkbox"
            onClick={(e) => {
              e.stopPropagation();
              toggleOrderSelection(order.id);
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}

        <div className="order-card-header">
          <h3 className="order-number">{order.order_number}</h3>
          <div className="table-badge">{order.table.table_number}</div>
          {order.priority_score && order.priority_score > 30 && (
            <div className="priority-badge">🔴 HIGH PRIORITY</div>
          )}
          <button
            className="print-btn"
            onClick={(e) => {
              e.stopPropagation();
              printOrderTicket(order);
            }}
            title="Print order ticket"
          >
            🖨️
          </button>
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
              {order.delay_minutes && order.delay_minutes > 0 && (
                <span> (Delayed by {order.delay_minutes} min)</span>
              )}
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
          {order.items
            .filter((item) => item.status !== "REJECTED") // Hide rejected items from kitchen
            .map((item, idx) => (
              <div key={idx} className="order-item">
                <div className="item-quantity">{item.quantity}</div>
                <div className="item-details">
                  <div className="item-name">
                    {item.name}
                    {item.status && (
                      <span
                        className={`item-status-badge ${item.status.toLowerCase()}`}
                        style={{
                          display: "inline-block",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          marginLeft: "6px",
                          background:
                            item.status === "READY"
                              ? "#dcfce7"
                              : item.status === "COOKING"
                                ? "#fef3c7"
                                : "#e5e7eb",
                          color:
                            item.status === "READY"
                              ? "#16a34a"
                              : item.status === "COOKING"
                                ? "#d97706"
                                : "#6b7280",
                        }}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="item-modifiers">
                      + {item.modifiers.map((m) => m.name).join(", ")}
                    </div>
                  )}
                  {item.special_requests && (
                    <div className="item-notes">📝 {item.special_requests}</div>
                  )}
                  {(column === "preparing" || column === "received") && (
                    <div
                      className="item-status-buttons"
                      style={{
                        display: "flex",
                        gap: "4px",
                        marginTop: "4px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.status !== "COOKING" && (
                        <button
                          style={{
                            padding: "2px 6px",
                            fontSize: "0.65rem",
                            background: "#fef3c7",
                            color: "#d97706",
                            border: "1px solid #fde047",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await updateItemStatus(
                                order.id,
                                item.id,
                                "COOKING",
                              );
                              await loadOrders();
                            } catch (error) {
                              console.error(
                                "Error updating item status:",
                                error,
                              );
                            }
                          }}
                        >
                          🔥 Cooking
                        </button>
                      )}
                      {item.status !== "READY" && (
                        <button
                          style={{
                            padding: "2px 6px",
                            fontSize: "0.65rem",
                            background: "#dcfce7",
                            color: "#16a34a",
                            border: "1px solid #bbf7d0",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await updateItemStatus(
                                order.id,
                                item.id,
                                "READY",
                              );
                              await loadOrders();
                            } catch (error) {
                              console.error(
                                "Error updating item status:",
                                error,
                              );
                            }
                          }}
                        >
                          ✓ Ready
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {item.special_requests?.toLowerCase().includes("hot") && (
                  <span className="hot-indicator">🔥</span>
                )}
              </div>
            ))}
        </div>

        {column === "received" && (
          <button
            className="action-btn start-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleStartPreparing(order.id);
            }}
          >
            Start Preparing
          </button>
        )}

        {column === "preparing" && (
          <button
            className="action-btn ready-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkReady(order.id);
            }}
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
      (o) => o.urgency === "critical",
    ).length;

    return { pending, cooking, ready, overdue };
  };

  const playNewOrderSound = () => {
    if (!audioContext) return;

    try {
      // Create an alert beep sound using Web Audio API
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure the beep
      oscillator.frequency.value = 880; // A5 note
      oscillator.type = "sine";

      // Envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.01,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      // Play twice for double beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 880;
        osc2.type = "sine";
        gain2.gain.setValueAtTime(0, audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(
          0.3,
          audioContext.currentTime + 0.01,
        );
        gain2.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3,
        );
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.3);
      }, 150);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const printOrderTicket = (order: KitchenOrder) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print order tickets");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order ${order.order_number}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
          }
          body {
            font-family: 'Courier New', monospace;
            max-width: 300px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .order-number {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
          }
          .table-info {
            font-size: 18px;
            margin: 5px 0;
          }
          .timestamp {
            font-size: 12px;
            color: #666;
          }
          .items-section {
            margin: 20px 0;
          }
          .item {
            margin: 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .item-qty {
            min-width: 30px;
          }
          .item-name {
            flex: 1;
          }
          .modifiers {
            margin-left: 30px;
            font-size: 12px;
            color: #666;
          }
          .notes {
            margin-left: 30px;
            font-size: 12px;
            font-style: italic;
            color: #444;
            background: #fff3cd;
            padding: 5px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            border-top: 2px dashed #000;
            padding-top: 10px;
            margin-top: 20px;
            font-size: 12px;
          }
          .priority {
            background: #ff4444;
            color: white;
            padding: 5px 10px;
            display: inline-block;
            margin: 10px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="order-number">ORDER #${order.order_number}</div>
          <div class="table-info">🍽️ ${order.table.table_number}</div>
          <div class="timestamp">${new Date(
            order.created_at,
          ).toLocaleString()}</div>
          ${
            order.priority_score && order.priority_score > 30
              ? '<div class="priority">⚠️ HIGH PRIORITY</div>'
              : ""
          }
        </div>

        <div class="items-section">
          ${order.items
            .map(
              (item) => `
            <div class="item">
              <div class="item-header">
                <span class="item-qty">${item.quantity}x</span>
                <span class="item-name">${item.name}</span>
              </div>
              ${
                item.modifiers && item.modifiers.length > 0
                  ? `
                <div class="modifiers">
                  + ${item.modifiers.map((m) => m.name).join(", ")}
                </div>
              `
                  : ""
              }
              ${
                item.special_requests
                  ? `
                <div class="notes">
                  📝 ${item.special_requests}
                </div>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="footer">
          <div>Printed: ${new Date().toLocaleString()}</div>
          ${
            order.estimated_prep_time
              ? `<div>Est. Prep Time: ${order.estimated_prep_time} min</div>`
              : ""
          }
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 100);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Group orders by table for batch view
  const getGroupedOrders = () => {
    const groupByTable = (orders: KitchenOrder[]) => {
      const grouped = new Map<string, KitchenOrder[]>();
      orders.forEach((order) => {
        const tableKey = order.table.table_number;
        if (!grouped.has(tableKey)) {
          grouped.set(tableKey, []);
        }
        grouped.get(tableKey)!.push(order);
      });
      return Array.from(grouped.entries()).map(([tableName, orders]) => ({
        tableName,
        orders,
        totalItems: orders.reduce(
          (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
          0,
        ),
      }));
    };

    return {
      received: groupByTable(receivedOrders),
      preparing: groupByTable(preparingOrders),
      ready: groupByTable(readyOrders),
    };
  };

  const stats = getStats();

  // Check if device is mobile/small screen
  const [showLandscapeHint, setShowLandscapeHint] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isSmallScreen = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowLandscapeHint(isSmallScreen && isPortrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Show loading state while restaurant is being loaded
  if (restaurantLoading) {
    return (
      <div
        className="kitchen-display"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <h2>🔄 Loading...</h2>
          <p>Fetching your restaurant assignment</p>
        </div>
      </div>
    );
  }

  // Show error if no restaurant assigned
  if (restaurantError || !restaurantId) {
    return (
      <div
        className="kitchen-display"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center", color: "white", maxWidth: "500px" }}>
          <h2>⚠️ No Restaurant Assigned</h2>
          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            {restaurantError ||
              "You are not assigned to any restaurant. Please contact your administrator."}
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "30px",
              padding: "12px 24px",
              fontSize: "16px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-display">
      {/* Landscape orientation hint for small devices */}
      {showLandscapeHint && (
        <div className="landscape-hint">
          📱 Please rotate your device to landscape mode for best experience
        </div>
      )}

      <div className="kds-header">
        <div className="header-left">
          <div className="kds-title">
            <span className="title-icon">🍴</span>
            <h1>Kitchen Display{restaurantName && ` - ${restaurantName}`}</h1>
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
            <div
              className={`stat-item overdue ${
                stats.overdue > 0 ? "alert" : ""
              }`}
            >
              <div className="stat-number">{stats.overdue}</div>
              <div className="stat-label">OVERDUE</div>
            </div>
            {delayedOrders.length > 0 && (
              <div className="stat-item delayed alert">
                <div className="stat-number">{delayedOrders.length}</div>
                <div className="stat-label">🚨 DELAYED</div>
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          {selectedOrderIds.size > 0 && (
            <button className="batch-prepare-btn" onClick={handleBatchPrepare}>
              🔥 Batch Prepare ({selectedOrderIds.size})
            </button>
          )}
          <button
            className={`view-toggle-btn ${batchView ? "active" : ""}`}
            onClick={() => setBatchView(!batchView)}
            title="Toggle batch view (group by table)"
          >
            {batchView ? "📋 Table View" : "📑 List View"}
          </button>
          <div className="current-time">{formatTime(currentTime)}</div>
          <button
            className={`sound-toggle ${soundEnabled ? "active" : ""}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle sound alerts"
          >
            <span className="sound-icon">{soundEnabled ? "🔊" : "🔇"}</span>
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
        {!batchView ? (
          // List View - Individual Orders
          <>
            <div className="kds-column received-column">
              <div className="column-header received-header">
                <span className="column-icon">⚠</span>
                <h2>RECEIVED</h2>
                <span className="column-count">{receivedOrders.length}</span>
              </div>
              <div className="column-content">
                {receivedOrders.map((order) =>
                  renderOrderCard(order, "received"),
                )}
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
                  renderOrderCard(order, "preparing"),
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
          </>
        ) : (
          // Batch View - Grouped by Table
          <>
            {(["received", "preparing", "ready"] as const).map((status) => {
              const groupedData = getGroupedOrders();
              const groups =
                status === "received"
                  ? groupedData.received
                  : status === "preparing"
                    ? groupedData.preparing
                    : groupedData.ready;
              const columnName =
                status === "received"
                  ? "RECEIVED"
                  : status === "preparing"
                    ? "PREPARING"
                    : "READY";
              const columnIcon =
                status === "received"
                  ? "⚠"
                  : status === "preparing"
                    ? "🔥"
                    : "✓";
              const headerClass = `${status}-header`;
              const columnClass = `${status}-column`;

              return (
                <div key={status} className={`kds-column ${columnClass}`}>
                  <div className={`column-header ${headerClass}`}>
                    <span className="column-icon">{columnIcon}</span>
                    <h2>{columnName}</h2>
                    <span className="column-count">
                      {groups.reduce((sum, g) => sum + g.orders.length, 0)}
                    </span>
                  </div>
                  <div className="column-content">
                    {groups.map((group) => (
                      <div key={group.tableName} className="table-group">
                        <div className="table-group-header">
                          <span className="table-group-name">
                            🍽️ {group.tableName}
                          </span>
                          <span className="table-group-count">
                            {group.orders.length} order
                            {group.orders.length !== 1 ? "s" : ""} ·{" "}
                            {group.totalItems} items
                          </span>
                        </div>
                        <div className="table-group-orders">
                          {group.orders.map((order) =>
                            renderOrderCard(order, status),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={convertToOrderDetail(selectedOrder)}
          role="kitchen"
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
          onStartPreparing={async () => {
            await handleStartPreparing(selectedOrder.id);
          }}
          onMarkReady={async () => {
            await handleMarkReady(selectedOrder.id);
          }}
        />
      )}
    </div>
  );
}
