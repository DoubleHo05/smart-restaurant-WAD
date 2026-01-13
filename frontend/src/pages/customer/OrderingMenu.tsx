import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicMenu, getMenuCategories } from '../../api/publicApi';
import './OrderingMenu.css';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface TableInfo {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string | null;
}

interface RestaurantInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function OrderingMenu() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [menuLoaded, setMenuLoaded] = useState(false);

  useEffect(() => {
    // Get table and restaurant info from localStorage
    const storedTableInfo = localStorage.getItem('table_info');
    const storedRestaurantInfo = localStorage.getItem('restaurant_info');
    
    if (!storedTableInfo || !storedRestaurantInfo) {
      // Redirect back to QR landing if no info found
      navigate('/');
      return;
    }

    const tableData = JSON.parse(storedTableInfo);
    const restaurantData = JSON.parse(storedRestaurantInfo);
    
    setTableInfo(tableData);
    setRestaurantInfo(restaurantData);

    // Only load menu if not already loaded
    if (!menuLoaded) {
      loadMenu(restaurantData.id);
      setMenuLoaded(true);
    }

    // Check for re-order items
    const reorderItems = localStorage.getItem('reorder_items');
    const reorderRestaurantId = localStorage.getItem('reorder_restaurant_id');
    
    if (reorderItems && reorderRestaurantId === restaurantData.id) {
      try {
        const items = JSON.parse(reorderItems);
        const cartItems: CartItem[] = items.map((item: any, index: number) => ({
          id: `${item.id}-${Date.now()}-${index}`,
          menu_item_id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          modifiers: item.modifiers || [],
          subtotal: parseFloat(item.price) * item.quantity,
        }));
        
        setCart(cartItems);
        setShowCart(true); // Auto-open cart to show re-ordered items
        
        // Clear re-order data after loading
        localStorage.removeItem('reorder_items');
        localStorage.removeItem('reorder_restaurant_id');
      } catch (error) {
        console.error('Failed to load re-order items:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - navigate is stable from react-router

  const loadMenu = async (restaurantId: string) => {
    try {
      // Don't show loading spinner if we already have menu data
      if (menuItems.length === 0) {
        setLoading(true);
      }
      
      const [categoriesData, menuData] = await Promise.all([
        getMenuCategories(restaurantId),
        getPublicMenu(selectedCategory, searchTerm, restaurantId),
      ]);

      setCategories(categoriesData);
      setMenuItems(menuData.items);
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (!restaurantInfo) return;
    setSearchTerm(term);
    try {
      const menuData = await getPublicMenu(selectedCategory, term, restaurantInfo.id);
      setMenuItems(menuData.items);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    if (!restaurantInfo) return;
    setSelectedCategory(categoryId);
    try {
      const menuData = await getPublicMenu(categoryId, searchTerm, restaurantInfo.id);
      setMenuItems(menuData.items);
    } catch (error) {
      console.error('Filter failed:', error);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  if (loading) {
    return (
      <div className="ordering-menu">
        <div className="menu-loading">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ordering-menu">
      {!showCart ? (
        <>
          {/* Header */}
          <div className="ordering-header">
            <div className="header-left"></div>
            <div className="header-center">
              <span className="restaurant-name-header">{restaurantInfo?.name}</span>
            </div>
            <div className="header-right">
              <span className="table-badge">Table {tableInfo?.tableNumber}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="categories-filter">
            <button
              className={`category-chip ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="menu-items-grid">
            {menuItems.length === 0 ? (
              <div className="no-items">
                <p>No items found</p>
              </div>
            ) : (
              menuItems.map((item) => (
                <div 
                  key={item.id} 
                  className="menu-item-card"
                  onClick={() => navigate(`/customer/order/item/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.image && (
                    <div className="item-image-wrapper">
                      <img src={item.image} alt={item.name} className="item-image" />
                    </div>
                  )}
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}
                    <div className="item-footer">
                      <span className="item-price">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.price)}
                      </span>
                      <button 
                        className="btn-add-to-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customer/order/item/${item.id}`);
                        }}
                        disabled={!item.isAvailable}
                      >
                        {item.isAvailable ? '+ Add' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Cart Page */}
          <div className="ordering-header">
            <button 
              className="header-back"
              onClick={() => setShowCart(false)}
            >
              ←
            </button>
            <div className="header-center">
              <span className="restaurant-name-header">Your Cart</span>
            </div>
            <div className="header-right">
              <span className="table-badge">Table {tableInfo?.tableNumber}</span>
            </div>
          </div>

          <div className="cart-content">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items to get started!</p>
                <button 
                  className="btn-continue-browsing"
                  onClick={() => setShowCart(false)}
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>🍽️</span>
                        )}
                      </div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        {item.description && (
                          <div className="cart-item-modifiers">{item.description}</div>
                        )}
                        <div className="cart-item-price">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.price)}
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-control small">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Instructions */}
                <div className="special-instructions-section">
                  <div className="section-title">Special Instructions for Kitchen</div>
                  <textarea
                    className="special-instructions-input"
                    placeholder="Any special requests for the entire order?"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="summary-title">Order Summary</div>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(getCartTotal())}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (10%)</span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(getCartTotal() * 0.1)}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(getCartTotal() * 1.1)}
                    </span>
                  </div>
                </div>

                {/* Info Note */}
                <div className="info-note">
                  <span className="info-icon">ℹ️</span>
                  <div className="info-text">
                    <strong>Pay After Your Meal</strong>
                    <br />
                    You can place multiple orders during your visit. Payment will be processed when you request the bill.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="cart-actions">
                  <button className="btn-place-order">
                    Place Order - {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(getCartTotal() * 1.1)}
                  </button>
                  <button 
                    className="btn-continue-browsing"
                    onClick={() => setShowCart(false)}
                  >
                    Continue Browsing
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bottom-nav">
            <button 
              className="nav-item"
              onClick={() => setShowCart(false)}
            >
              <span className="nav-icon">🍽️</span>
              <span className="nav-label">Menu</span>
            </button>
            <button className="nav-item active">
              <span className="nav-icon">🛒</span>
              {cart.length > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
              <span className="nav-label">Cart</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">📋</span>
              <span className="nav-label">Orders</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
