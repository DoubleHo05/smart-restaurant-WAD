import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicMenu, getMenuCategories } from '../../api/publicApi';
import { fuzzySearchMenuItems } from '../../utils/fuzzySearch';
import { useUrlSync, useUrlParams } from '../../hooks/useUrlSync';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useDebounce } from '../../hooks/useDebounce';
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
  isChefRecommended?: boolean;
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
  const [loading, setLoading] = useState(false); // Changed to false like CustomerMenu
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]); // Store all items for fuzzy search
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [sortBy, setSortBy] = useState<string>(''); // '', 'popularity', 'chef'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get initial params from URL
  const urlParams = useUrlParams();

  // Sync state with URL
  useUrlSync({
    searchTerm,
    selectedCategory,
    sortBy,
    page: page > 1 ? page : undefined,
  });

  // Infinite scroll logic
  const handleLoadMore = useCallback(async () => {
    if (!restaurantInfo?.id || searchTerm.trim() || page >= totalPages) return;

    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const menuData = await getPublicMenu(
        selectedCategory,
        undefined,
        restaurantInfo.id,
        sortBy,
        nextPage,
        20
      );

      const newItems = menuData?.items || [];
      // Filter out duplicates before appending
      setAllMenuItems(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const uniqueNewItems = newItems.filter((item: MenuItem) => !existingIds.has(item.id));
        return [...prev, ...uniqueNewItems];
      });
    } catch (error) {
      console.error('Failed to load more items:', error);
    }
  }, [restaurantInfo?.id, searchTerm, page, totalPages, selectedCategory, sortBy]);

  const { isLoadingMore, hasMore, setHasMore } = useInfiniteScroll(handleLoadMore, {
    threshold: 500,
    enabled: !searchTerm.trim() && page < totalPages,
  });

  // Update hasMore when pagination changes
  useEffect(() => {
    setHasMore(page < totalPages && !searchTerm.trim());
  }, [page, totalPages, searchTerm, setHasMore]);

  // Initialize state from URL params on mount
  useEffect(() => {
    if (urlParams.searchTerm) setSearchTerm(urlParams.searchTerm);
    if (urlParams.selectedCategory) setSelectedCategory(urlParams.selectedCategory);
    if (urlParams.sortBy) setSortBy(urlParams.sortBy);
    if (urlParams.page) setPage(Number(urlParams.page));
  }, []); // Only run once on mount

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
      loadMenu(restaurantData.id, 1, false);
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

  const loadMenu = useCallback(async (restaurantId: string, pageNum: number = 1, append: boolean = false, categoryFilter?: string) => {
    try {
      setLoading(true); // Always set loading when loading menu

      // Use passed categoryFilter if provided, otherwise use selectedCategory from state
      const categoryToUse = categoryFilter !== undefined ? categoryFilter : selectedCategory;

      // If user is searching, load ALL items to ensure search works correctly
      // Otherwise, use pagination (20 items per page)
      const limit = searchTerm.trim() ? 1000 : 20;

      const [categoriesData, menuData] = await Promise.all([
        pageNum === 1 ? getMenuCategories(restaurantId) : Promise.resolve(categories),
        getPublicMenu(categoryToUse || undefined, undefined, restaurantId, sortBy, pageNum, limit),
      ]);

      if (pageNum === 1) {
        setCategories(categoriesData);
      }

      const items = menuData?.items || [];

      if (append) {
        setAllMenuItems(prev => [...prev, ...items]);
      } else {
        setAllMenuItems(items);
        setPage(1);
      }

      setTotalPages(menuData?.pagination?.totalPages || 1);
      console.log('Menu items loaded:', items);
      console.log('Chef recommended items:', items.filter((item: any) => item.isChefRecommended));
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  }, [categories, selectedCategory, sortBy, searchTerm]);

  // Fuzzy search and filter logic
  const filteredItems = useMemo(() => {
    let items = allMenuItems;

    // Note: Category filtering is done server-side, no need to filter here

    // Apply fuzzy search
    if (searchTerm.trim()) {
      items = fuzzySearchMenuItems(items, searchTerm);
    }

    // Apply sorting
    if (sortBy === 'popularity') {
      // Sort by popularity (you can add a popularity field later)
      items = [...items]; // Keep order for now
    } else if (sortBy === 'chef') {
      items = [...items].sort((a, b) => {
        if (a.isChefRecommended && !b.isChefRecommended) return -1;
        if (!a.isChefRecommended && b.isChefRecommended) return 1;
        return 0;
      });
    }

    return items;
  }, [allMenuItems, selectedCategory, searchTerm, sortBy]);

  // Update displayed items when filters change
  useEffect(() => {
    setMenuItems(filteredItems);
  }, [filteredItems]);

  // Effect to handle debounced search
  useEffect(() => {
    const performSearch = async () => {
      if (!restaurantInfo?.id) return;

      // If searching, load ALL items for fuzzy search to work properly
      if (debouncedSearchTerm.trim()) {
        setLoading(true);
        try {
          const menuData = await getPublicMenu(
            undefined,
            undefined,
            restaurantInfo.id,
            sortBy,
            1,
            1000  // Load all items (adjust if you have more than 1000)
          );
          setAllMenuItems(menuData?.items || []);
          setTotalPages(menuData?.pagination?.totalPages || 1);
        } catch (error) {
          console.error('Failed to load menu:', error);
        } finally {
          setLoading(false);
        }
      }
      // Note: When search is cleared, items remain as-is.
      // User can select a category to reload with proper filter.
    };

    performSearch();
  }, [debouncedSearchTerm, restaurantInfo?.id, sortBy]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);  // Update immediately for UI
    setPage(1);
    // API call will be triggered by useEffect after debounce delay
  };

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
    // Reload menu with new category filter - pass categoryId directly to avoid stale closure
    if (restaurantInfo?.id) {
      await loadMenu(restaurantInfo.id, 1, false, categoryId);
    }
  };

  const handleSortChange = async (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
    // Reload with new sort
    if (restaurantInfo?.id) {
      await loadMenu(restaurantInfo.id, 1, false);
    }
  };

  const _addToCart = (item: MenuItem) => {
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

          {/* Sort Dropdown */}
          <div className="sort-section">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Default</option>
              <option value="popularity">Most Popular</option>
              <option value="chef">Chef's Recommendations</option>
            </select>
          </div>

          {/* Menu Items Grid */}
          <div className="menu-items-grid">
            {loading && menuItems.length === 0 ? (
              <div className="menu-loading">
                <div className="spinner"></div>
                <p>Loading menu...</p>
              </div>
            ) : menuItems.length === 0 ? (
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
                  <div className="item-image-wrapper">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="item-image" />
                    ) : (
                      <div className="item-image" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        background: '#f5f5f5'
                      }}>
                        🍽️
                      </div>
                    )}
                    {/* Show badge for chef recommended items */}
                    {item.isChefRecommended && (
                      <div className="chef-recommend-badge">
                        <span className="chef-icon">👨‍🍳</span>
                        <span className="chef-text">Chef's Pick</span>
                      </div>
                    )}
                  </div>
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
                      <span className={`item-status ${item.isAvailable ? 'available' : 'unavailable'}`}>
                        {item.isAvailable ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator for infinite scroll */}
            {isLoadingMore && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px 20px',
                color: '#7f8c8d'
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: '10px' }}>Loading more items...</p>
              </div>
            )}

            {/* End of results message */}
            {!hasMore && menuItems.length > 0 && !searchTerm.trim() && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px 20px',
                color: '#95a5a6',
                fontSize: '14px'
              }}>
                ✓ You've reached the end
              </div>
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
