import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicMenu, getMenuCategories } from '../../api/publicApi';
import './CustomerMenu.css';

interface Category {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  itemCount: number;
}

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

export default function CustomerMenu() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [tableInfo, setTableInfo] = useState<any>(null);

  useEffect(() => {
    // Get table info from localStorage
    const storedTableInfo = localStorage.getItem('table_info');
    if (storedTableInfo) {
      setTableInfo(JSON.parse(storedTableInfo));
    }

    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const [categoriesData, menuData] = await Promise.all([
        getMenuCategories(),
        getPublicMenu(),
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
    setSearchTerm(term);
    try {
      const menuData = await getPublicMenu(selectedCategory, term);
      setMenuItems(menuData.items);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    try {
      const menuData = await getPublicMenu(categoryId, searchTerm);
      setMenuItems(menuData.items);
    } catch (error) {
      console.error('Filter failed:', error);
    }
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/customer/menu/item/${itemId}`);
  };

  if (loading) {
    return (
      <div className="customer-menu">
        <div className="menu-loading">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-menu">
      {/* Header */}
      <div className="menu-header">
        <span className="menu-icon">&#9776;</span>
        <span className="restaurant-name">Smart Restaurant</span>
        {tableInfo && (
          <span className="table-badge">Table {tableInfo.tableNumber}</span>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search menu items..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items List */}
      <div className="menu-content">
        {menuItems.length === 0 ? (
          <div className="empty-state">
            <p>No items found</p>
            {searchTerm && (
              <button 
                className="btn-clear-search"
                onClick={() => handleSearch('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="menu-items-list">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="menu-item-card"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="item-placeholder">🍽️</div>
                  )}
                </div>
                <div className="item-info">
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-rating">
                      ⭐⭐⭐⭐⭐ (0 reviews)
                    </div>
                    <span className={`item-status ${item.isAvailable ? 'available' : 'sold-out'}`}>
                      ● {item.isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                  <div className="item-bottom">
                    <span className="item-price">${Number(item.price).toFixed(2)}</span>
                    {item.isAvailable && (
                      <button 
                        className="add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item.id);
                        }}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Button (floating) */}
      <button className="cart-fab">
        🛒
        <span className="cart-count">0</span>
      </button>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>Menu</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🛒</span>
          <span className="nav-badge">0</span>
          <span>Cart</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📋</span>
          <span>Orders</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
}
