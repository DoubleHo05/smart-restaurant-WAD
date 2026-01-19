import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ordersApi from "../../api/ordersApi";
import billRequestsApi from "../../api/billRequestsApi";
import paymentsApi, { PaymentMethod } from "../../api/paymentsApi";
import "./Payment.css";

const TIP_PERCENTAGES = [10, 15, 20];

function Payment() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState(0);
  const [customerNote, setCustomerNote] = useState("");

  const [tableInfo, setTableInfo] = useState<any>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);

  useEffect(() => {
    loadTableAndOrders();
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentsApi.getPaymentMethods();
      setPaymentMethods(methods);
      // Set default payment method to first available (usually CASH or VNPAY)
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].code.toUpperCase());
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
      // Fallback to hardcoded methods
      setPaymentMethods([
        { id: '1', code: 'CASH', name: 'Cash', display_order: 1 },
        { id: '2', code: 'VNPAY', name: 'VNPay', display_order: 2 },
      ]);
      setSelectedPaymentMethod('CASH');
    }
  };

  const loadTableAndOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Get table info
      const storedTableInfo = localStorage.getItem("table_info");
      const storedRestaurantInfo = localStorage.getItem("restaurant_info");

      if (!storedTableInfo || !storedRestaurantInfo) {
        setError("Table information not found. Please scan QR code again.");
        setLoading(false);
        return;
      }

      const table = JSON.parse(storedTableInfo);
      const restaurant = JSON.parse(storedRestaurantInfo);

      setTableInfo(table);
      setRestaurantInfo(restaurant);

      // Get all unpaid orders for this table
      const response = await ordersApi.getByTable(table.id);
      const allOrders = (response as any).data || response;
      
      // Filter out completed orders (already paid)
      const ordersData = allOrders.filter((order: any) => order.status !== 'completed');

      setOrders(ordersData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error loading orders:", err);
      setError(err.response?.data?.message || "Failed to load orders");
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  };

  const calculateTips = () => {
    if (tipPercentage === 0) return customTip;
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * (tipPercentage / 100));
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTips();
  };

  const handleRequestBill = async () => {
    if (!tableInfo) {
      setError("Table information not found");
      return;
    }

    if (orders.length === 0) {
      setError("No orders to pay for");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const requestData = {
        table_id: tableInfo.id,
        payment_method_code: selectedPaymentMethod,
        tips_amount: calculateTips(),
        customer_note: customerNote || undefined,
      };

      console.log("📤 Sending bill request:", requestData);

      const billRequest = await billRequestsApi.create(requestData);

      console.log("✅ Bill request created:", billRequest);

      // Navigate to payment status page
      navigate(`/customer/payment-status/${billRequest.id}`);
    } catch (err: any) {
      console.error("Error creating bill request:", err);
      setError(err.response?.data?.message || 'Failed to create bill request');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your bill...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="payment-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={loadTableAndOrders}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tips = calculateTips();
  const total = calculateTotal();

  return (
    <div className="payment-container">
      {/* Header */}
      <div className="payment-header">
        <button className="payment-back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="payment-header-content">
          <h1 className="payment-header-title">Your Bill</h1>
          <p className="payment-header-subtitle">
            {restaurantInfo?.name} • Table {tableInfo?.tableNumber}
          </p>
        </div>
      </div>

      <div className="payment-content">
        {/* Bill Header */}
        <div className="bill-header">
          <div className="bill-header-icon">🍽️</div>
          <h2 className="bill-header-title">{restaurantInfo?.name}</h2>
          <p className="bill-header-meta">
            Table {tableInfo?.tableNumber} • {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Orders */}
        {orders.map((order, index) => (
          <div key={order.id} className="bill-section">
            <div className="bill-section-title">
              Order #{index + 1} - {order.order_number}
            </div>
            {order.order_items
              ?.filter((item: any) => item.status !== "REJECTED") // Hide rejected items from bill
              .map((item: any) => (
                <div key={item.id} className="bill-item">
                  <div className="bill-item-details">
                    <span className="bill-item-qty">{item.quantity}x</span>
                    <div>
                      <div className="bill-item-name">
                        {item.menu_item?.name}
                      </div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="bill-item-mods">
                          +{" "}
                          {item.modifiers
                            .map((m: any) => m.modifier_option?.name)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="bill-item-price">
                    {Math.round(item.subtotal).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
          </div>
        ))}

        {/* Totals */}
        <div className="bill-totals">
          <div className="bill-total-row">
            <span>Subtotal</span>
            <span>{Math.round(subtotal).toLocaleString("vi-VN")}₫</span>
          </div>
          {tips > 0 && (
            <div className="bill-total-row">
              <span>
                Tips ({tipPercentage > 0 ? `${tipPercentage}%` : "Custom"})
              </span>
              <span>{Math.round(tips).toLocaleString("vi-VN")}₫</span>
            </div>
          )}
          <div className="bill-total-row grand-total">
            <span>Total</span>
            <span>{Math.round(total).toLocaleString("vi-VN")}₫</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h3 className="payment-method-title">Payment Method</h3>
          {paymentMethods.map((method) => (
            <div
              key={method.code}
              className={`payment-option ${selectedPaymentMethod === method.code.toUpperCase() ? "selected" : ""}`}
              onClick={() => setSelectedPaymentMethod(method.code.toUpperCase())}
            >
              <input
                type="radio"
                name="payment"
                checked={selectedPaymentMethod === method.code.toUpperCase()}
                onChange={() => setSelectedPaymentMethod(method.code.toUpperCase())}
              />
              <div className="payment-option-label">
                <span className="payment-logo">
                  {method.logo_url ? (
                    <img src={method.logo_url} alt={method.name} style={{ width: '24px', height: '24px' }} />
                  ) : (
                    method.code === 'VNPAY' ? '🏦' : '💵'
                  )}
                </span>
                {method.name}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="tips-section">
          <h3 className="tips-title">Add a Tip (Optional)</h3>
          <div className="tips-buttons">
            {TIP_PERCENTAGES.map((percentage) => (
              <button
                key={percentage}
                className={`tip-btn ${tipPercentage === percentage ? "selected" : ""}`}
                onClick={() => {
                  setTipPercentage(percentage);
                  setCustomTip(0);
                }}
              >
                {percentage}%
              </button>
            ))}
            <button
              className={`tip-btn ${tipPercentage === 0 ? "selected" : ""}`}
              onClick={() => setTipPercentage(0)}
            >
              Custom
            </button>
          </div>
          <div className="tip-amount">
            Tip amount:{" "}
            <strong>{Math.round(tips).toLocaleString("vi-VN")}₫</strong>
          </div>
        </div>

        {/* Customer Note */}
        <div className="note-section">
          <h3 className="note-title">Note (Optional)</h3>
          <textarea
            className="note-input"
            placeholder="Any special requests or notes..."
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
          />
        </div>

        {error && (
          <div className="error-state">
            <p className="error-message">{error}</p>
          </div>
        )}
      </div>

      {/* Request Bill Button */}
      <div className="request-bill-bar">
        <button
          className="request-bill-btn"
          onClick={handleRequestBill}
          disabled={submitting || orders.length === 0}
        >
          {submitting
            ? "Requesting..."
            : `Request Bill • ${Math.round(total).toLocaleString("vi-VN")}₫`}
        </button>
      </div>
    </div>
  );
}

export default Payment;
