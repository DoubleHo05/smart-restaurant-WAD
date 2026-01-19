import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi, Order } from '../../api/ordersApi';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiShoppingBag,
  FiChevronRight,
  FiAlertCircle,
  FiPackage,
  FiLock,
  FiRefreshCw
} from 'react-icons/fi';
import './OrderHistory.css';

type FilterStatus = 'all' | 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'completed';

function OrderHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, selectedDate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug: Check token
      const token = localStorage.getItem('auth_token');
      console.log('🔐 [OrderHistory] Loading orders:', {
        hasUser: !!user,
        userId: user?.id,
        hasToken: !!token,
        tokenPreview: token?.substring(0, 20) + '...',
        date: selectedDate
      });

      // User requested ONLY completed orders, plus date filter if selected
      const response = await ordersApi.getMyOrders({
        status: 'completed',
        date: selectedDate || undefined
      });

      console.log('✅ [OrderHistory] Orders loaded:', response.data.length);
      setOrders(response.data);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      accepted: '#3b82f6',
      preparing: '#8b5cf6',
      ready: '#10b981',
      served: '#06b6d4',
      completed: '#22c55e',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      accepted: 'Accepted',
      preparing: 'Preparing',
      ready: 'Ready',
      served: 'Served',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return Math.round(amount).toLocaleString('vi-VN') + '₫';
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/customer/order-status/${orderId}`);
  };

  if (!user) {
    return (
      <div className="mobile-container">
        <div className="order-history-page">
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h3>Login Required</h3>
            <p>Please login to view your order history</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/customer/login', {
                state: { from: { pathname: '/customer/order-history' } }
              })}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Additional check: ensure token exists
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.warn('⚠️ [OrderHistory] User exists but no auth token found');
    return (
      <div className="mobile-container">
        <div className="order-history-page">
          <div className="empty-state">
            <div className="empty-icon">🔑</div>
            <h3>Authentication Required</h3>
            <p>Please login again to view your order history</p>
            <button
              className="btn-primary"
              onClick={() => {
                localStorage.removeItem('auth_user');
                navigate('/customer/login', {
                  state: { from: { pathname: '/customer/order-history' } }
                });
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="order-history-page">
        <div className="page-header">
          {/* Fixed duplicated header div */}
          <button className="btn-back" onClick={() => navigate('/customer/menu')}>
            <FiArrowLeft size={20} /> Back
          </button>
          <h1>Order History</h1>
          <div className="header-info">
            <span className="orders-count">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiShoppingBag size={14} /> {orders.length} orders
              </span>
            </span>
          </div>

          <div className="date-filter-section" style={{ marginTop: '16px' }}>
            <div className="date-input-wrapper" style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              borderRadius: '12px',
              padding: '8px 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <FiCalendar className="date-icon" style={{ color: '#6b7280', marginRight: '10px' }} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#2d3436',
                  width: '100%',
                  fontWeight: 500
                }}
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px',
                    marginLeft: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>×</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter tabs removed */}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon"><FiAlertCircle /></div>
            <p>{error}</p>
            <button className="btn-retry" onClick={loadOrders}>
              <FiRefreshCw style={{ marginRight: '8px' }} /> Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FiPackage /></div>
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/customer/menu')}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const itemsToShow = isExpanded ? order.order_items : order.order_items?.slice(0, 3);
              const remainingCount = (order.order_items?.length || 0) - 3;

              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-number">
                      Order #{order.order_number}
                    </div>
                    <div
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusLabel(order.status)}
                    </div>
                  </div>

                  <div className="order-info">
                    <div className="info-row">
                      <span className="info-label"><FiCalendar style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Date:</span>
                      <span className="info-value">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label"><FiMapPin style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Table:</span>
                      <span className="info-value">
                        {order.table?.table_number || 'N/A'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label"><FiShoppingBag style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Items:</span>
                      <span className="info-value">
                        {order.order_items?.length || 0} items
                      </span>
                    </div>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="order-items-preview">
                      {itemsToShow?.map((item, index) => (
                        <div key={index} className="item-preview">
                          <span className="item-quantity">{item.quantity}x</span>
                          <span className="item-name">
                            {item.menu_item?.name || 'Unknown Item'}
                          </span>
                        </div>
                      ))}
                      {!isExpanded && remainingCount > 0 && (
                        <div className="item-preview more" onClick={() => toggleDetails(order.id)}>
                          +{remainingCount} more items
                        </div>
                      )}
                    </div>
                  )}

                  <div className="order-footer">
                    <div className="order-total">
                      <span className="total-label">Total</span>
                      <span className="total-amount">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <button
                      className="btn-view-details"
                      onClick={() => toggleDetails(order.id)}
                    >
                      {isExpanded ? (
                        <>Collapse <FiChevronRight size={16} style={{ marginLeft: '4px', transform: 'rotate(270deg)' }} /></>
                      ) : (
                        <>Details <FiChevronRight size={16} style={{ marginLeft: '4px' }} /></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
