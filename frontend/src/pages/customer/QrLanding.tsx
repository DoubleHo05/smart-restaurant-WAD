import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyQrToken } from '../../api/publicApi';
import './QrLanding.css';

interface TableInfo {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string | null;
  status: string;
}

interface QrResponse {
  success: boolean;
  table: TableInfo;
  message: string;
}

export default function QrLanding() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid QR code - no token provided');
        setLoading(false);
        return;
      }

      try {
        const response: QrResponse = await verifyQrToken(token);
        
        if (response.success && response.table) {
          setTableInfo(response.table);
          // Store table info and token for later use
          localStorage.setItem('table_token', token);
          localStorage.setItem('table_info', JSON.stringify(response.table));
        } else {
          setError('Invalid QR code');
        }
      } catch (err: any) {
        console.error('QR verification error:', err);
        if (err.response?.status === 401) {
          setError('This QR code has expired. Please ask staff for a new one.');
        } else if (err.response?.status === 404) {
          setError('Table not found. Please contact staff.');
        } else {
          setError('Failed to verify QR code. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleViewMenu = () => {
    navigate('/customer/menu');
  };

  if (loading) {
    return (
      <div className="qr-landing">
        <div className="qr-loading">
          <div className="spinner"></div>
          <p>Verifying QR code...</p>
        </div>
      </div>
    );
  }

  if (error || !tableInfo) {
    return (
      <div className="qr-landing">
        <div className="qr-error">
          <div className="error-icon">⚠️</div>
          <h2>QR Code Error</h2>
          <p>{error || 'Something went wrong'}</p>
          <button 
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-landing">
      <div className="qr-success">
        <div className="success-icon">✓</div>
        <h1>Welcome!</h1>
        <div className="table-info-card">
          <div className="table-number">
            <span className="label">Table</span>
            <span className="value">{tableInfo.tableNumber}</span>
          </div>
          {tableInfo.location && (
            <div className="table-location">
              <span className="icon">📍</span>
              <span>{tableInfo.location}</span>
            </div>
          )}
          <div className="table-capacity">
            <span className="icon">👥</span>
            <span>Capacity: {tableInfo.capacity} guests</span>
          </div>
        </div>
        
        <button 
          className="btn-view-menu"
          onClick={handleViewMenu}
        >
          View Menu
        </button>

        <p className="qr-footer-text">
          Scan the QR code on your table to order
        </p>
      </div>
    </div>
  );
}
