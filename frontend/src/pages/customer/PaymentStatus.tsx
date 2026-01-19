import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import billRequestsApi from "../../api/billRequestsApi";
import paymentsApi from "../../api/paymentsApi";
import "./PaymentStatus.css";

type BillStatus = "pending" | "accepted" | "completed" | "rejected";

function PaymentStatus() {
  const navigate = useNavigate();
  const { billRequestId } = useParams();
  const [searchParams] = useSearchParams();
  const { socket } = useSocket();

  const [status, setStatus] = useState<BillStatus>("pending");
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Check if this is a VNPay return
  useEffect(() => {
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');
    const vnpTxnRef = searchParams.get('vnp_TxnRef');
    
    if (vnpResponseCode && vnpTxnRef) {
      console.log('🔔 VNPay return detected, verifying payment...');
      verifyVNPayPayment();
    }
  }, [searchParams]);

  const verifyVNPayPayment = async () => {
    try {
      setLoading(true);
      
      // Convert URLSearchParams to object
      const queryParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      console.log('📤 Verifying VNPay payment with params:', queryParams);
      const result = await paymentsApi.verifyVNPayReturn(queryParams);
      
      console.log('📥 VNPay verification result:', result);

      if (result.success) {
        setStatus('completed');
        setPaymentVerified(true);
        // Optionally reload bill request to get updated status
        if (billRequestId && billRequestId !== 'demo') {
          await loadBillRequest();
        }
      } else {
        setStatus('rejected');
        console.error('❌ VNPay payment failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error verifying VNPay payment:', error);
      setStatus('rejected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (billRequestId && billRequestId !== "demo" && !searchParams.has('vnp_ResponseCode')) {
      loadBillRequest();
    }
  }, [billRequestId]);

  useEffect(() => {
    if (!socket) {
      console.warn("⚠️ Socket not connected - customer may be anonymous");
      return;
    }

    // Listen for payment ready event (VNPay)
    socket.on("payment_ready", (data: any) => {
      console.log("Payment ready event received:", data);

      // Filter by bill_request_id to ensure this is for current customer
      if (data.bill_request_id === billRequestId) {
        console.log("✅ Payment ready for this bill request");
        setPaymentUrl(data.payment_url);
        setStatus("accepted");

        // Redirect to payment URL
        if (data.payment_url) {
          window.location.href = data.payment_url;
        }
      }
    });

    // Listen for bill accepted event (CASH)
    socket.on("bill_accepted", (data: any) => {
      console.log("Bill accepted event received:", data);

      if (data.bill_request_id === billRequestId) {
        console.log("✅ Bill accepted for CASH payment");
        setStatus("accepted");
      }
    });

    // Listen for payment completed event
    socket.on("payment_completed", (data: any) => {
      console.log("Payment completed event received:", data);

      if (data.bill_request_id === billRequestId) {
        console.log("✅ Payment completed for this bill request");
        setStatus("completed");
      }
    });

    // Listen for bill request rejected
    socket.on("bill_request_rejected", (data: any) => {
      console.log("Bill request rejected:", data);
      if (data.bill_request_id === billRequestId) {
        setStatus("rejected");
      }
    });

    return () => {
      socket.off("payment_ready");
      socket.off("bill_accepted");
      socket.off("payment_completed");
      socket.off("bill_request_rejected");
    };
  }, [socket, billRequestId]);

  const loadBillRequest = async () => {
    if (!billRequestId) return;

    try {
      setLoading(true);
      const response = await billRequestsApi.get(billRequestId);
      console.log('📥 Bill request loaded:', response);
      setBill(response);
      setStatus(response.status as BillStatus);
    } catch (error) {
      console.error("Error loading bill request:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform bill data to handle both singular and plural field names from backend
  const displayBill = bill ? {
    restaurant: bill.restaurants || bill.restaurant || { name: "N/A" },
    table: bill.tables || bill.table || { table_number: "N/A" },
    payment_method_code: bill.payment_method_code,
    subtotal: bill.subtotal,
    tips_amount: bill.tips_amount,
    total_amount: bill.total_amount,
  } : {
    restaurant: { name: "Restaurant" },
    table: { table_number: "T--" },
    payment_method_code: "vnpay",
    subtotal: 0,
    tips_amount: 0,
    total_amount: 0,
  };

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: "⏳",
          title: "Waiting for Waiter",
          message:
            "Your bill request has been sent. A waiter will accept it shortly.",
          badge: "Pending",
          badgeClass: "pending",
          showPaymentLink: false,
        };
      case "accepted":
        return {
          icon: "✅",
          title: "Bill Accepted",
          message: paymentUrl
            ? "Payment window opened. Please complete your payment."
            : "Your waiter has accepted your bill request.",
          badge: "Accepted",
          badgeClass: "accepted",
          showPaymentLink: !!paymentUrl,
        };
      case "completed":
        return {
          icon: "🎉",
          title: "Payment Successful!",
          message:
            "Thank you for dining with us. We hope to see you again soon!",
          badge: "Completed",
          badgeClass: "completed",
          showPaymentLink: false,
        };
      case "rejected":
        return {
          icon: "❌",
          title: "Bill Request Rejected",
          message:
            "Your bill request was rejected. Please try again or contact staff.",
          badge: "Rejected",
          badgeClass: "rejected",
          showPaymentLink: false,
        };
      default:
        return {
          icon: "⏳",
          title: "Processing",
          message: "Please wait...",
          badge: "Processing",
          badgeClass: "pending",
          showPaymentLink: false,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleBackToMenu = () => {
    navigate("/customer/order");
  };

  const handleViewOrders = () => {
    navigate("/customer/order-status");
  };

  const handleOpenPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="payment-status-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-status-container">
      {/* Header */}
      <div className="payment-status-header">
        <button
          className="payment-status-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h1 className="payment-status-title">Payment Status</h1>
      </div>

      <div className="payment-status-content">
        {/* Status Card */}
        <div className="status-card">
          <div className={`status-icon ${statusConfig.badgeClass}`}>
            {statusConfig.icon}
          </div>
          <h2 className="status-title">{statusConfig.title}</h2>
          <p className="status-message">{statusConfig.message}</p>
          <span className={`status-badge ${statusConfig.badgeClass}`}>
            {statusConfig.badge}
            {status === "pending" && (
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            )}
          </span>

          {/* Payment Link Button */}
          {statusConfig.showPaymentLink && paymentUrl && (
            <button className="open-payment-btn" onClick={handleOpenPayment}>
              Open Payment Page
            </button>
          )}
        </div>

        {/* Bill Details */}
        <div className="bill-details-card">
          <h3 className="bill-details-title">Bill Details</h3>
          <div className="bill-detail-row">
            <span className="bill-detail-label">Restaurant</span>
            <span className="bill-detail-value">
              {displayBill.restaurant?.name || "N/A"}
            </span>
          </div>
          <div className="bill-detail-row">
            <span className="bill-detail-label">Table</span>
            <span className="bill-detail-value">
              {displayBill.table?.table_number || "N/A"}
            </span>
          </div>
          <div className="bill-detail-row">
            <span className="bill-detail-label">Subtotal</span>
            <span className="bill-detail-value">
              {Math.round(displayBill.subtotal || 0).toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="bill-detail-row">
            <span className="bill-detail-label">Tips</span>
            <span className="bill-detail-value">
              {Math.round(displayBill.tips_amount || 0).toLocaleString("vi-VN")}
              ₫
            </span>
          </div>
          <div className="bill-detail-row total">
            <span className="bill-detail-label">Total</span>
            <span className="bill-detail-value">
              {Math.round(displayBill.total_amount || 0).toLocaleString(
                "vi-VN",
              )}
              ₫
            </span>
          </div>
        </div>

        {/* QR Code Section (only show when accepted) */}
        {status === "accepted" && bill?.payment_method_code === "CASH" && (
          <div className="qr-section">
            <h3 className="qr-title">Cash Payment</h3>
            <div className="qr-code-placeholder">�</div>
            <p className="qr-instruction">
              Please prepare cash payment. Waiter will confirm receipt shortly.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {status === "completed" ? (
            <>
              <button
                className="action-btn secondary"
                onClick={handleViewOrders}
              >
                View Orders
              </button>
              <button className="action-btn primary" onClick={handleBackToMenu}>
                Back to Menu
              </button>
            </>
          ) : status === "rejected" ? (
            <button
              className="action-btn primary"
              onClick={() => navigate("/customer/payment")}
            >
              Try Again
            </button>
          ) : (
            <button
              className="action-btn secondary"
              onClick={() => navigate(-1)}
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentStatus;
