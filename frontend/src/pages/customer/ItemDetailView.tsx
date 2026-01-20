import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import publicApi from '../../api/publicApi';
import RelatedItems from '../../components/RelatedItems';
import { ReviewsList } from '../../components/ReviewsList';
import { ReviewModal } from '../../components/ReviewModal';
import './ItemDetailView.css';

interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: string;
}

interface ModifierGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  isRequired: boolean;
  options: ModifierOption[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  photos: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
  modifierGroups: ModifierGroup[];
  isAvailable: boolean;
  preparationTime?: number;
  category?: {
    id: string;
    name: string;
  };
}

function ItemDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsKey, setReviewsKey] = useState(0);

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching item details for ID:', id);
      const data = await publicApi.getMenuItem(id!);
      console.log('Item details received:', data);
      setItem(data);
    } catch (err: any) {
      console.error('Error fetching item details:', err);
      setError(err.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!item) return <div className="error">Item not found</div>;

  const primaryPhoto = item.photos?.find(p => p.isPrimary) || item.photos?.[0];

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="header">
        <button onClick={() => navigate(-1)} className="header-back">
          ←
        </button>
        <span className="header-title">Item Details</span>
        <span className="header-spacer"></span>
      </div>

      {/* Hero Image */}
      <div className="item-hero">
        {primaryPhoto ? (
          <img
            src={primaryPhoto.url}
            alt={item.name}
          />
        ) : (
          <div className="hero-placeholder">
            <div className="hero-emoji">🍽️</div>
          </div>
        )}
      </div>

      {/* Item Content */}
      <div className="item-content">
        <div className="item-header">
          <div>
            <div className="item-title">{item.name}</div>
            {item.category && (
              <div className="item-category">
                <span className="category-badge">{item.category.name}</span>
              </div>
            )}
          </div>
          <div className="item-price">{Math.round(parseFloat(item.price)).toLocaleString('vi-VN')}₫</div>
        </div>

        {/* Meta Info */}
        {item.preparationTime && (
          <div className="item-meta">
            <span className="meta-item">
              <span className="meta-icon">⏱️</span>
              {item.preparationTime} - minutes
            </span>
            <span className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
              {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
            </span>
          </div>
        )}

        {item.description && (
          <div className="item-description-section">
            <h3>Description</h3>
            <p className="item-description">{item.description}</p>
          </div>
        )}

        {/* Modifier Groups (View Only) */}
        {item.modifierGroups && item.modifierGroups.length > 0 && (
          <div className="customization-section">
            <h3>Customization Options</h3>
            <p className="section-note">Available when ordering</p>

            {item.modifierGroups.map((group) => (
              <div key={group.id} className="modifier-group-view">
                <div className="group-header">
                  <span className="group-name">
                    {group.name}
                    {group.isRequired && <span className="required-badge">Required</span>}
                  </span>
                  <span className="group-info">
                    {group.minSelection === group.maxSelection
                      ? `Choose ${group.minSelection}`
                      : `Choose ${group.minSelection}-${group.maxSelection}`}
                  </span>
                </div>

                <div className="options-list">
                  {group.options.map((option) => (
                    <div key={option.id} className="option-item">
                      <span className="option-name">{option.name}</span>
                      <span className="option-price">
                        {parseFloat(option.priceAdjustment) !== 0 && (
                          <>
                            {parseFloat(option.priceAdjustment) > 0 ? '+' : ''}
                            {Math.round(Math.abs(parseFloat(option.priceAdjustment))).toLocaleString('vi-VN')}₫
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Reviews Section */}
        {id && (
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '0 20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>Customer Reviews</h3>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                style={{
                  padding: '8px 16px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✍️ Write Review
              </button>
            </div>
            <ReviewsList key={reviewsKey} menuItemId={id} />
          </div>
        )}

        {/* Review Modal */}
        {item && (
          <ReviewModal
            menuItemId={id!}
            menuItemName={item.name}
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            onSuccess={() => {
              setReviewsKey(prev => prev + 1);
            }}
          />
        )}

        {/* Related Items */}
        {id && <RelatedItems itemId={id} context="view" />}

        {/* Call to Action */}
        <div className="cta-section">
          <div className="info-box">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <strong>Want to order?</strong>
              <p>Scan the QR code on your table to place an order and customize your items.</p>
            </div>
          </div>
          <button className="back-to-menu-btn" onClick={() => navigate(-1)}>
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailView;
