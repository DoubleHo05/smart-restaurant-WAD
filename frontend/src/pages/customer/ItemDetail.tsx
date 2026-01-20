import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import publicApi from '../../api/publicApi';
import cartApi from '../../api/cartApi';
import Toast, { ToastType } from '../../components/Toast';
import { useCart } from '../../contexts/CartContext';
import RelatedItems from '../../components/RelatedItems';
import { ReviewsList } from '../../components/ReviewsList';
import { ReviewModal } from '../../components/ReviewModal';
import ImageGallery from '../../components/ImageGallery';
import './ItemDetail.css';

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

function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Map<string, Set<string>>>(new Map());
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
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

  const handleModifierToggle = (group: ModifierGroup, option: ModifierOption) => {
    const newSelections = new Map(selectedModifiers);
    const groupSelections = newSelections.get(group.id) || new Set<string>();

    if (group.maxSelection === 1) {
      // Radio button behavior
      groupSelections.clear();
      groupSelections.add(option.id);
    } else {
      // Checkbox behavior
      if (groupSelections.has(option.id)) {
        groupSelections.delete(option.id);
      } else {
        if (groupSelections.size < group.maxSelection) {
          groupSelections.add(option.id);
        } else {
          setToast({
            message: `You can only select up to ${group.maxSelection} options`,
            type: 'warning'
          });
          return;
        }
      }
    }

    newSelections.set(group.id, groupSelections);
    setSelectedModifiers(newSelections);
  };

  const calculateTotal = () => {
    if (!item) return 0;

    let total = parseFloat(item.price);

    // Add modifier prices
    selectedModifiers.forEach((optionIds, groupId) => {
      const group = item.modifierGroups.find(mg => mg.id === groupId);
      if (group) {
        optionIds.forEach(optionId => {
          const option = group.options.find(o => o.id === optionId);
          if (option) {
            total += parseFloat(option.priceAdjustment);
          }
        });
      }
    });

    return total * quantity;
  };

  const validateModifiers = () => {
    if (!item) return { valid: false, message: '' };

    for (const group of item.modifierGroups) {
      const selections = selectedModifiers.get(group.id) || new Set();

      if (group.isRequired && selections.size < group.minSelection) {
        return {
          valid: false,
          message: `Please select at least ${group.minSelection} option(s) for ${group.name}`,
        };
      }

      if (selections.size > group.maxSelection) {
        return {
          valid: false,
          message: `You can only select up to ${group.maxSelection} option(s) for ${group.name}`,
        };
      }
    }

    return { valid: true, message: '' };
  };

  const handleAddToCart = async () => {
    const validation = validateModifiers();
    if (!validation.valid) {
      setToast({ message: validation.message, type: 'warning' });
      return;
    }

    try {
      const modifiers: Array<{ modifier_option_id: string }> = [];
      selectedModifiers.forEach((optionIds) => {
        optionIds.forEach((optionId) => {
          modifiers.push({ modifier_option_id: optionId });
        });
      });

      const payload = {
        menu_item_id: id!,
        quantity: Number(quantity), // Ensure it's a number
        modifiers,
        special_requests: specialRequests || undefined,
      };

      console.log('Add to cart payload:', payload);

      await cartApi.addToCart(payload);

      // Fetch updated cart count
      const updatedCart = await cartApi.getCart();
      updateCartCount(updatedCart.item_count || 0);

      setToast({ message: '✓ Item added to cart!', type: 'success' });

      // Reset form after successful add
      setQuantity(1);
      setSelectedModifiers(new Map());
      setSpecialRequests('');

    } catch (err: any) {
      console.error('Add to cart error:', err);
      console.error('Error response:', err.response?.data);
      setToast({
        message: err.response?.data?.message || err.message || 'Failed to add item to cart',
        type: 'error'
      });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!item) return <div className="error">Item not found</div>;

  return (
    <div className="mobile-container">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="header">
        <button onClick={() => navigate(-1)} className="header-back">
          ←
        </button>
        <span className="header-title">Item Details</span>
        <span className="header-table">
          {(() => {
            const tableInfo = localStorage.getItem('table_info');
            if (tableInfo) {
              const { tableNumber } = JSON.parse(tableInfo);
              return `Table ${tableNumber}`;
            }
            return 'Table';
          })()}
        </span>
      </div>

      {/* Hero Image / Gallery */}
      <div className="item-hero">
        <ImageGallery
          photos={item.photos || []}
          altText={item.name}
        />
      </div>

      {/* Item Content */}
      <div className="item-content" style={{ paddingBottom: '120px' }}>
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

        {/* Meta Info - Preparation Time & Availability */}
        <div className="item-meta">
          {item.preparationTime && (
            <span className="meta-item">
              <span className="meta-icon">⏱️</span>
              {item.preparationTime} - minutes
            </span>
          )}
          <span className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
            {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
          </span>
        </div>

        {item.description && (
          <p className="item-description">{item.description}</p>
        )}

        {/* Modifiers */}
        {item.modifierGroups.map((group) => {
          return (
            <div key={group.id} className="modifier-section">
              <div className="modifier-title">
                {group.name}
                {group.isRequired && <span className="required-badge">Required</span>}
              </div>

              {group.options.map((option) => {
                const isSelected = selectedModifiers.get(group.id)?.has(option.id) || false;
                return (
                  <div key={option.id} className="modifier-option">
                    <label className="modifier-label">
                      <input
                        type={group.maxSelection === 1 ? 'radio' : 'checkbox'}
                        name={`group-${group.id}`}
                        checked={isSelected}
                        onChange={() => handleModifierToggle(group, option)}
                      />
                      {option.name}
                    </label>
                    <span className="modifier-price">
                      {parseFloat(option.priceAdjustment) >= 0 ? '+' : ''}
                      {Math.round(Math.abs(parseFloat(option.priceAdjustment))).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Special Instructions */}
        <div className="modifier-section">
          <div className="modifier-title">Special Instructions</div>
          <textarea
            className="special-instructions"
            placeholder="Any special requests? (e.g., no onions, extra spicy...)"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>
      </div>


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
            setToast({ message: 'Review submitted successfully!', type: 'success' });
          }}
        />
      )}

      {/* Related Items */}
      {id && <RelatedItems itemId={id} context="order" />}

      {/* Add to Cart Bar */}
      <div className="add-to-cart-bar">
        <div className="quantity-control">
          <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            -
          </button>
          <span className="qty-value">{quantity}</span>
          <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
            +
          </button>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart - {Math.round(calculateTotal()).toLocaleString('vi-VN')}₫
        </button>
      </div>
    </div>
  );
}

export default ItemDetail;
