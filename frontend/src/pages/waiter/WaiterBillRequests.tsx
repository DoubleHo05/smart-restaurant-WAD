import { useState, useEffect } from "react";
import "./WaiterBillRequests.css";
import billRequestsApi from "../../api/billRequestsApi";
import { useRestaurant } from "../../contexts/RestaurantContext";

interface BillRequest {
  id: string;
  table_id: string;
  status: string;
  subtotal: number;
  tips_amount: number;
  total_amount: number;
  payment_method_code: string;
  customer_note?: string;
  created_at: string;
  tables: {
    id: string;
    table_number: string;
  };
  order_ids: string[];
}

export default function WaiterBillRequests() {
  const { restaurants } = useRestaurant();
  const [billRequests, setBillRequests] = useState<BillRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const restaurantId = restaurants.length > 0 ? restaurants[0].id : null;

  useEffect(() => {
    if (restaurantId) {
      loadBillRequests();
      // Refresh every 10 seconds
      const interval = setInterval(loadBillRequests, 10000);
      return () => clearInterval(interval);
    }
  }, [restaurantId]);

  const loadBillRequests = async () => {
    if (!restaurantId) return;

    try {
      setLoading(true);
      setError("");

      const response = await billRequestsApi.getByRestaurant(restaurantId);
      const data = response?.data || response;

      // Filter only pending requests
      const pending = Array.isArray(data)
        ? data.filter((br: BillRequest) => br.status === "pending")
        : [];

      setBillRequests(pending);
    } catch (err: any) {
      console.error("Error loading bill requests:", err);
      setError(err.response?.data?.message || "Failed to load bill requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (billRequestId: string) => {
    if (!restaurantId) return;

    try {
      setProcessing(billRequestId);
      setError("");

      const result = await billRequestsApi.accept(billRequestId);
      console.log("Bill request accepted:", result);

      // If VNPay, show payment URL
      if (result.payment_url) {
        const openUrl = window.confirm(
          `Payment URL generated!\n\nClick OK to open VNPay payment page in new tab, or Cancel to copy URL.`,
        );

        if (openUrl) {
          window.open(result.payment_url, "_blank");
        } else {
          navigator.clipboard.writeText(result.payment_url);
          alert("Payment URL copied to clipboard!");
        }
      } else {
        alert("Bill request accepted! Order will be marked as completed.");
      }

      // Reload list
      await loadBillRequests();
    } catch (err: any) {
      console.error("Error accepting bill request:", err);
      setError(err.response?.data?.message || "Failed to accept bill request");
      alert("Failed to accept bill request. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (billRequestId: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      setProcessing(billRequestId);
      setError("");

      await billRequestsApi.reject(billRequestId, reason);
      alert("Bill request rejected.");

      // Reload list
      await loadBillRequests();
    } catch (err: any) {
      console.error("Error rejecting bill request:", err);
      setError(err.response?.data?.message || "Failed to reject bill request");
      alert("Failed to reject bill request. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return Math.round(amount).toLocaleString("vi-VN") + "₫";
  };

  const getPaymentMethodName = (code: string) => {
    const methods: Record<string, string> = {
      vnpay: "VNPay",
      cash: "Pay at Counter",
      zalopay: "ZaloPay",
      momo: "MoMo",
      stripe: "Credit/Debit Card",
    };
    return methods[code] || code;
  };

  const getPaymentMethodIcon = (code: string) => {
    const icons: Record<string, string> = {
      vnpay: "V",
      cash: "💵",
      zalopay: "Z",
      momo: "M",
      stripe: "💳",
    };
    return icons[code] || "💰";
  };

  if (!restaurantId) {
    return (
      <div className="waiter-bill-requests-page">
        <div className="error-state">
          <h3>No Restaurant Assigned</h3>
          <p>You need to be assigned to a restaurant to view bill requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="waiter-bill-requests-page">
      <div className="page-header">
        <h1>💳 Bill Requests</h1>
        <p className="page-subtitle">Review and process payment requests</p>
        {billRequests.length > 0 && (
          <div className="bill-count-badge">{billRequests.length} pending</div>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className="bill-requests-container">
        {loading && billRequests.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading bill requests...</p>
          </div>
        ) : billRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No Pending Bill Requests</h3>
            <p>New payment requests will appear here</p>
          </div>
        ) : (
          <div className="bill-requests-grid">
            {billRequests.map((billRequest) => (
              <div key={billRequest.id} className="bill-request-card">
                <div className="bill-request-header">
                  <div className="table-info">
                    <div className="table-number">
                      Table {billRequest.tables?.table_number || "N/A"}
                    </div>
                    <div className="bill-time">
                      {new Date(billRequest.created_at).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                  </div>
                  <div
                    className={`payment-method-badge ${billRequest.payment_method_code}`}
                  >
                    <span className="payment-icon">
                      {getPaymentMethodIcon(billRequest.payment_method_code)}
                    </span>
                    <span className="payment-name">
                      {getPaymentMethodName(billRequest.payment_method_code)}
                    </span>
                  </div>
                </div>

                <div className="bill-amounts">
                  <div className="amount-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(billRequest.subtotal)}</span>
                  </div>
                  {billRequest.tips_amount > 0 && (
                    <div className="amount-row tips">
                      <span>Tips:</span>
                      <span>+{formatCurrency(billRequest.tips_amount)}</span>
                    </div>
                  )}
                  <div className="amount-row total">
                    <span>Total:</span>
                    <span className="total-amount">
                      {formatCurrency(billRequest.total_amount)}
                    </span>
                  </div>
                </div>

                {billRequest.customer_note && (
                  <div className="customer-note">
                    <div className="note-label">📝 Customer Note:</div>
                    <div className="note-text">{billRequest.customer_note}</div>
                  </div>
                )}

                <div className="bill-meta">
                  <span className="orders-count">
                    {billRequest.order_ids.length} order(s)
                  </span>
                </div>

                <div className="bill-actions">
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(billRequest.id)}
                    disabled={processing === billRequest.id}
                  >
                    Reject
                  </button>
                  <button
                    className="btn-accept"
                    onClick={() => handleAccept(billRequest.id)}
                    disabled={processing === billRequest.id}
                  >
                    {processing === billRequest.id
                      ? "Processing..."
                      : "Accept & Process"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
