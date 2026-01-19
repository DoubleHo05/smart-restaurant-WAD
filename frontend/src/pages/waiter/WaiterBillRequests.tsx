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
  const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending");
  const [billRequests, setBillRequests] = useState<BillRequest[]>([]);
  const [acceptedBills, setAcceptedBills] = useState<BillRequest[]>([]);
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
      const data = Array.isArray(response) ? response : (response as any)?.data || [];

      console.log("📋 [WaiterBillRequests] Loaded bills:", data);

      // Filter pending and accepted requests
      const pending = data.filter((br: BillRequest) => br.status === "pending");
      const accepted = data.filter((br: BillRequest) => br.status === "accepted");

      console.log("📋 [WaiterBillRequests] Pending:", pending.length, "Accepted:", accepted.length);
      if (accepted.length > 0) {
        console.log("📋 [WaiterBillRequests] Accepted bills:", accepted.map(b => ({
          id: b.id,
          payment_method_code: b.payment_method_code,
          status: b.status
        })));
      }

      setBillRequests(pending);
      setAcceptedBills(accepted);
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

  const handleCompleteCashPayment = async (billRequestId: string) => {
    const confirmed = window.confirm(
      "Confirm cash payment received? This will mark the bill as paid and complete all orders."
    );
    if (!confirmed) return;

    try {
      setProcessing(billRequestId);
      setError("");

      // Get the bill request to find total_amount
      const billRequest = acceptedBills.find(br => br.id === billRequestId);
      if (!billRequest) {
        throw new Error("Bill request not found");
      }

      // Call the complete cash payment endpoint
      await billRequestsApi.completeCashPayment(
        billRequestId,
        billRequest.total_amount
      );
      
      alert("Payment completed successfully!");

      // Reload list
      await loadBillRequests();
    } catch (err: any) {
      console.error("Error completing cash payment:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Failed to complete payment";
      setError(errorMsg);
      alert(`Failed to complete payment: ${errorMsg}`);
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
        <div className="header-badges">
          {billRequests.length > 0 && (
            <div className="bill-count-badge pending">{billRequests.length} pending</div>
          )}
          {acceptedBills.length > 0 && (
            <div className="bill-count-badge accepted">{acceptedBills.length} accepted</div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({billRequests.length})
        </button>
        <button
          className={`tab-button ${activeTab === "accepted" ? "active" : ""}`}
          onClick={() => setActiveTab("accepted")}
        >
          Accepted ({acceptedBills.length})
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === "pending" && (
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
      )}

      {/* Accepted Tab */}
      {activeTab === "accepted" && (
        <div className="bill-requests-container">
          {loading && acceptedBills.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading accepted bills...</p>
            </div>
          ) : acceptedBills.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No Accepted Bills</h3>
              <p>Accepted bills waiting for payment completion will appear here</p>
            </div>
          ) : (
            <div className="bill-requests-grid">
              {acceptedBills.map((billRequest) => {
                console.log("💳 [WaiterBillRequests] Rendering accepted bill:", {
                  id: billRequest.id,
                  payment_method_code: billRequest.payment_method_code,
                  is_cash: billRequest.payment_method_code?.toLowerCase() === "cash",
                });
                return (
                <div key={billRequest.id} className="bill-request-card accepted-card">
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
                    <span className="status-badge accepted">✅ Accepted</span>
                  </div>

                  {/* Only show Complete button for CASH payments */}
                  {billRequest.payment_method_code?.toLowerCase() === "cash" && (
                    <div className="bill-actions">
                      <button
                        className="btn-complete-payment"
                        onClick={() => handleCompleteCashPayment(billRequest.id)}
                        disabled={processing === billRequest.id}
                      >
                        {processing === billRequest.id
                          ? "Processing..."
                          : "💵 Complete Cash Payment"}
                      </button>
                    </div>
                  )}

                  {/* For VNPay, show waiting message */}
                  {billRequest.payment_method_code?.toLowerCase() === "vnpay" && (
                    <div className="bill-info">
                      <p className="info-text">
                        ⏳ Waiting for customer to complete VNPay payment...
                      </p>
                    </div>
                  )}

                  {/* Debug: show payment method code */}
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                    Payment method: {billRequest.payment_method_code}
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
