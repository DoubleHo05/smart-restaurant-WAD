import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WaiterOrders.css";
import {
  getPendingOrders,
  getRestaurantOrders,
  acceptOrder,
  rejectOrder,
  WaiterOrder,
} from "../../api/waiterApi";

type TabType = "pending" | "accepted" | "ready";

export default function WaiterOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [pendingOrders, setPendingOrders] = useState<WaiterOrder[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<WaiterOrder[]>([]);
  const [readyOrders, setReadyOrders] = useState<WaiterOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WaiterOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // TODO: Replace with actual restaurant ID from auth context
  const restaurantId = "temp-restaurant-id";

  useEffect(() => {
    loadOrders();
    // TODO: Setup Socket.IO for real-time updates
    // const socket = io(API_URL);
    // socket.on('new_order', () => loadOrders());
    // return () => socket.disconnect();
  }, [activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const pending = await getPendingOrders({ restaurant_id: restaurantId });
      setPendingOrders(pending);

      const accepted = await getRestaurantOrders(
        restaurantId,
        "accepted,preparing"
      );
      setAcceptedOrders(accepted);

      const ready = await getRestaurantOrders(restaurantId, "ready");
      setReadyOrders(ready);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (order: WaiterOrder) => {
    try {
      await acceptOrder(order.id, { restaurant_id: restaurantId });
      await loadOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order. Please try again.");
    }
  };

  const handleRejectClick = (order: WaiterOrder) => {
    setSelectedOrder(order);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      await rejectOrder(selectedOrder.id, {
        restaurant_id: restaurantId,
        rejection_reason: rejectionReason,
      });
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedOrder(null);
      await loadOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert("Failed to reject order. Please try again.");
    }
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

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const renderOrderCard = (order: WaiterOrder) => {
    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const timeAgo = getTimeAgo(order.created_at);

    return (
      <div key={order.id} className="order-card">
        <div className="order-header">
          <div className="order-table-badge">
            {order.table_number || `Table ${order.table_id.slice(-2)}`}
          </div>
          <div className="order-meta">
            <h3 className="order-number">{order.order_number}</h3>
            <div className="order-info">
              <span className="order-status-badge pending">Pending</span>
              <span className="order-time">{timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="order-items-summary">
          <span className="items-count">{totalItems} items</span>
        </div>

        <div className="order-items-list">
          {order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <div className="item-details">
                <span className="item-quantity">{item.quantity}x</span>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <span className="item-modifiers">
                      {item.modifiers.map((m) => m.name).join(", ")}
                    </span>
                  )}
                  {item.notes && (
                    <span className="item-notes">Note: {item.notes}</span>
                  )}
                </div>
              </div>
              <span className="item-price">
                {formatPrice(item.unit_price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {activeTab === "pending" && (
          <div className="order-actions">
            <button
              className="btn-reject"
              onClick={() => handleRejectClick(order)}
            >
              Reject
            </button>
            <button
              className="btn-accept"
              onClick={() => handleAcceptOrder(order)}
            >
              Accept & Send to Kitchen
            </button>
          </div>
        )}
      </div>
    );
  };

  const getCurrentOrders = (): WaiterOrder[] => {
    switch (activeTab) {
      case "pending":
        return pendingOrders;
      case "accepted":
        return acceptedOrders;
      case "ready":
        return readyOrders;
      default:
        return [];
    }
  };

  return (
    <div className="waiter-orders-page">
      <div className="page-title">
        <h1>Order Management</h1>
        <p className="page-subtitle">Review and manage incoming orders</p>
      </div>

      <div className="tabs-container">
        <button
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
          {pendingOrders.length > 0 && (
            <span className="tab-badge">{pendingOrders.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === "accepted" ? "active" : ""}`}
          onClick={() => setActiveTab("accepted")}
        >
          Accepted
        </button>
        <button
          className={`tab ${activeTab === "ready" ? "active" : ""}`}
          onClick={() => setActiveTab("ready")}
        >
          Ready to Serve
        </button>
      </div>

      <div className="orders-container">
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : getCurrentOrders().length === 0 ? (
          <div className="empty-state">
            <p>No orders in this section</p>
          </div>
        ) : (
          getCurrentOrders().map(renderOrderCard)
        )}
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRejectModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Order</h2>
            <p>
              Please provide a reason for rejecting order{" "}
              <strong>{selectedOrder?.order_number}</strong>
            </p>
            <textarea
              className="rejection-textarea"
              placeholder="e.g., Out of stock, Kitchen closed, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-reject"
                onClick={handleRejectConfirm}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
