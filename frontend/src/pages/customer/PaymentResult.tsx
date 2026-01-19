import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./PaymentStatus.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface PaymentResultData {
  success: boolean;
  RspCode?: string;
  Message?: string;
  payment_id?: string;
  amount?: number;
  response_code?: string;
  transaction_no?: string;
  error?: string;
}

function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PaymentResultData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Get all VNPay query params
      const queryString = searchParams.toString();

      if (!queryString) {
        setError("No payment information found");
        setLoading(false);
        return;
      }

      console.log("🔍 Verifying payment with params:", queryString);

      // Call backend to verify and process the payment
      const response = await axios.get(
        `${API_URL}/payments/vnpay/return?${queryString}`,
      );

      console.log("✅ Payment verification result:", response.data);
      setResult(response.data);
    } catch (err: any) {
      console.error("❌ Payment verification error:", err);
      setError(err.response?.data?.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMenu = () => {
    navigate("/customer/order");
  };

  const handleViewOrders = () => {
    navigate("/customer/order-status");
  };

  if (loading) {
    return (
      <div className="payment-status-container">
        <div className="payment-status-content">
          <div className="status-card">
            <div className="status-icon pending">⏳</div>
            <h2 className="status-title">Verifying Payment...</h2>
            <p className="status-message">
              Please wait while we verify your payment with VNPay.
            </p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-status-container">
        <div className="payment-status-content">
          <div className="status-card">
            <div className="status-icon rejected">❌</div>
            <h2 className="status-title">Verification Failed</h2>
            <p className="status-message">{error}</p>
            <span className="status-badge rejected">Error</span>
          </div>

          <div className="action-buttons">
            <button className="action-btn secondary" onClick={handleBackToMenu}>
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = result?.success && result?.response_code === "00";

  return (
    <div className="payment-status-container">
      <div className="payment-status-header">
        <h1 className="payment-status-title">Payment Result</h1>
      </div>

      <div className="payment-status-content">
        <div className="status-card">
          <div
            className={`status-icon ${isSuccess ? "completed" : "rejected"}`}
          >
            {isSuccess ? "🎉" : "❌"}
          </div>
          <h2 className="status-title">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h2>
          <p className="status-message">
            {isSuccess
              ? "Thank you! Your payment has been processed successfully. Your orders are now being prepared."
              : `Payment was not successful. ${result?.Message || "Please try again."}`}
          </p>
          <span
            className={`status-badge ${isSuccess ? "completed" : "rejected"}`}
          >
            {isSuccess ? "Completed" : "Failed"}
          </span>
        </div>

        {/* Payment Details */}
        {result && (
          <div className="bill-details-card">
            <h3 className="bill-details-title">Payment Details</h3>
            <div className="bill-detail-row">
              <span className="bill-detail-label">Payment ID</span>
              <span className="bill-detail-value">
                {result.payment_id?.substring(0, 8) || "N/A"}...
              </span>
            </div>
            {result.amount && (
              <div className="bill-detail-row total">
                <span className="bill-detail-label">Amount</span>
                <span className="bill-detail-value">
                  {Math.round(result.amount).toLocaleString("vi-VN")}₫
                </span>
              </div>
            )}
            {result.transaction_no && (
              <div className="bill-detail-row">
                <span className="bill-detail-label">Transaction No</span>
                <span className="bill-detail-value">
                  {result.transaction_no}
                </span>
              </div>
            )}
            <div className="bill-detail-row">
              <span className="bill-detail-label">Status Code</span>
              <span className="bill-detail-value">
                {result.response_code || result.RspCode || "N/A"}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn secondary" onClick={handleViewOrders}>
            View Orders
          </button>
          <button className="action-btn primary" onClick={handleBackToMenu}>
            Back to Menu
          </button>
        </div>

        {/* Success message for completed payment */}
        {isSuccess && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#d4edda",
              borderRadius: "10px",
              textAlign: "center",
              color: "#155724",
            }}
          >
            <p style={{ margin: 0 }}>
              ✅ Your orders have been marked as completed. Thank you for dining
              with us!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;
