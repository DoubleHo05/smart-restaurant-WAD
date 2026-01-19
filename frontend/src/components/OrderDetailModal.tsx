import { useState } from "react";
import "./OrderDetailModal.css";

export interface OrderDetailItem {
  id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  status?: "QUEUED" | "COOKING" | "READY" | "REJECTED";
  rejection_reason?: string;
  modifiers?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  table_id: string;
  table_number?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  status: string;
  total_price: number;
  special_instructions?: string;
  items: OrderDetailItem[];
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  preparing_started_at?: string;
  ready_at?: string;
  served_at?: string;
  completed_at?: string;
  rejection_reason?: string;
}

export type UserRole = "waiter" | "kitchen" | "admin";

export interface OrderDetailModalProps {
  order: OrderDetail;
  role: UserRole;
  onClose: () => void;
  onAccept?: () => Promise<void>;
  onReject?: (reason: string) => Promise<void>;
  onStartPreparing?: () => Promise<void>;
  onMarkReady?: () => Promise<void>;
  onServe?: () => Promise<void>;
}

export default function OrderDetailModal({
  order,
  role,
  onClose,
  onAccept,
  onReject,
  onStartPreparing,
  onMarkReady,
  onServe,
}: OrderDetailModalProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
      onClose();
    } catch (error) {
      console.error("Action failed:", error);
      alert("Action failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    if (onReject) {
      await handleAction(() => onReject(rejectionReason));
    }
  };

  const getStatusTimeline = () => {
    const timeline: Array<{
      label: string;
      time: string | null;
      active: boolean;
    }> = [
      { label: "Created", time: order.created_at, active: true },
      {
        label: "Accepted",
        time: order.accepted_at || null,
        active: !!order.accepted_at,
      },
      {
        label: "Preparing",
        time: order.preparing_started_at || null,
        active: !!order.preparing_started_at,
      },
      {
        label: "Ready",
        time: order.ready_at || null,
        active: !!order.ready_at,
      },
      {
        label: "Served",
        time: order.served_at || null,
        active: !!order.served_at,
      },
      {
        label: "Completed",
        time: order.completed_at || null,
        active: !!order.completed_at,
      },
    ];
    return timeline;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateItemTotal = (item: OrderDetailItem) => {
    const modifiersTotal =
      item.modifiers?.reduce((sum, mod) => sum + Number(mod.price || 0), 0) ||
      0;
    return (Number(item.unit_price || 0) + modifiersTotal) * item.quantity;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#f59e0b",
      accepted: "#3b82f6",
      preparing: "#8b5cf6",
      ready: "#22c55e",
      served: "#06b6d4",
      completed: "#10b981",
      rejected: "#ef4444",
      cancelled: "#6b7280",
    };
    return colors[status.toLowerCase()] || "#6b7280";
  };

  return (
    <>
      <div className="order-modal-overlay" onClick={onClose}>
        <div
          className="order-detail-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="modal-title-section">
              <h2 className="modal-title">Order Details</h2>
              <span className="order-number">#{order.order_number}</span>
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="modal-content">
            {/* Order Info Section */}
            <div className="info-section">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Table</span>
                  <span className="info-value">Table {order.table_number}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span
                    className="status-badge"
                    style={{
                      background: getStatusColor(order.status),
                      color: "white",
                    }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
                {order.customer_name && (
                  <div className="info-item">
                    <span className="info-label">Customer</span>
                    <span className="info-value">{order.customer_name}</span>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{order.customer_phone}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Order Time</span>
                  <span className="info-value">
                    {formatTime(order.created_at)} -{" "}
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="timeline-section">
              <h3 className="section-title">Order Timeline</h3>
              <div className="timeline">
                {getStatusTimeline().map((step, index) => (
                  <div
                    key={index}
                    className={`timeline-item ${
                      step.active ? "active" : "inactive"
                    }`}
                  >
                    <div className="timeline-marker">
                      {step.active ? "✓" : "○"}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-label">{step.label}</div>
                      {step.time && (
                        <div className="timeline-time">
                          {formatTime(step.time)}
                        </div>
                      )}
                    </div>
                    {index < getStatusTimeline().length - 1 && (
                      <div
                        className={`timeline-line ${
                          step.active ? "active" : ""
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Items Section */}
            <div className="items-section">
              <h3 className="section-title">Order Items</h3>
              <div className="items-list">
                {order.items
                  .filter((item) => {
                    // Hide rejected items for waiter and kitchen, but show for customer
                    if (role === "waiter" || role === "kitchen") {
                      return item.status !== "REJECTED";
                    }
                    return true; // Show all items for other roles (customer, admin)
                  })
                  .map((item) => (
                    <div key={item.id} className="order-item-card">
                      <div className="item-header">
                        <div className="item-name-section">
                          <span className="item-quantity">
                            {item.quantity}x
                          </span>
                          <span className="item-name">{item.name}</span>
                        </div>
                        <span className="item-total">
                          {calculateItemTotal(item).toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="item-modifiers">
                          <span className="modifiers-label">Modifiers:</span>
                          <ul className="modifiers-list">
                            {item.modifiers.map((modifier) => (
                              <li key={modifier.id} className="modifier-item">
                                {modifier.name}
                                {modifier.price > 0 && (
                                  <span className="modifier-price">
                                    +{modifier.price.toLocaleString("vi-VN")}đ
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.notes && (
                        <div className="item-notes">
                          <span className="notes-icon">📝</span>
                          <span className="notes-text">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Special Instructions */}
            {order.special_instructions && (
              <div className="special-instructions">
                <h3 className="section-title">Special Instructions</h3>
                <p className="instructions-text">
                  {order.special_instructions}
                </p>
              </div>
            )}

            {/* Total Section */}
            <div className="total-section">
              <div className="total-row">
                <span className="total-label">Total Amount</span>
                <span className="total-amount">
                  {order.total_price.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            {role === "waiter" && order.status === "pending" && (
              <>
                <button
                  className="action-btn reject-btn"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isLoading}
                >
                  Reject Order
                </button>
                <button
                  className="action-btn accept-btn"
                  onClick={() => onAccept && handleAction(onAccept)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Accept Order"}
                </button>
              </>
            )}

            {role === "waiter" && order.status === "ready" && onServe && (
              <button
                className="action-btn serve-btn"
                onClick={() => handleAction(onServe)}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Mark as Served"}
              </button>
            )}

            {role === "kitchen" &&
              order.status === "accepted" &&
              onStartPreparing && (
                <button
                  className="action-btn start-btn"
                  onClick={() => handleAction(onStartPreparing)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Start Preparing"}
                </button>
              )}

            {role === "kitchen" &&
              order.status === "preparing" &&
              onMarkReady && (
                <button
                  className="action-btn ready-btn"
                  onClick={() => handleAction(onMarkReady)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Mark as Ready"}
                </button>
              )}

            {role === "admin" && (
              <button className="action-btn close-btn" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="order-modal-overlay"
          onClick={() => setShowRejectModal(false)}
        >
          <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="reject-title">Reject Order</h3>
            <p className="reject-description">
              Please provide a reason for rejecting this order:
            </p>
            <textarea
              className="reject-textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Item out of stock, Kitchen closed, etc."
              rows={4}
            />
            <div className="reject-actions">
              <button
                className="reject-cancel-btn"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
              >
                Cancel
              </button>
              <button
                className="reject-confirm-btn"
                onClick={handleReject}
                disabled={isLoading || !rejectionReason.trim()}
              >
                {isLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
