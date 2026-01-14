import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPublicRestaurants } from '../../api/publicApi';
import type { Restaurant } from '../../types/restaurant.types';
import './RestaurantList.css';

const RestaurantList: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants based on search query
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.address?.toLowerCase().includes(query)
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getPublicRestaurants();
      // Only show active restaurants to customers
      const activeRestaurants = data.filter((r: Restaurant) => r.status === 'active');
      setRestaurants(activeRestaurants);
      setFilteredRestaurants(activeRestaurants);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load restaurants');
      console.error('Error loading restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    // Navigate to menu with restaurant ID and name
    navigate(`/customer/menu?restaurant=${restaurant.id}`, {
      state: { restaurantName: restaurant.name }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  const isRegisteredUser = () => {
    // Check if user is registered (has auth_token)
    return !!localStorage.getItem('auth_token');
  };

  const getRestaurantEmoji = () => {
    // Random emoji for now since we don't have cuisine_type
    const emojis = ['🍽️', '🍝', '🍱', '�', '🥢', '�', '🥐', '🍛', '🍜', '�'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="restaurant-list-header">
        <div className="header-content">
          <div className="header-left">
            <div className="user-avatar">
              {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="greeting">Hello,</div>
              <div className="user-name">{user?.full_name || user?.email || 'Guest'}</div>
            </div>
          </div>

          {/* User Menu */}
          <div className="user-menu" ref={menuRef}>
            <button
              className="menu-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              title="Menu"
            >
              <span>☰</span>
            </button>

            {menuOpen && (
              <div className="menu-dropdown">
                {isRegisteredUser() ? (
                  <>
                    <button
                      className="menu-item"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/customer/dashboard-profile');
                      }}
                    >
                      <span className="menu-icon">👤</span>
                      Profile
                    </button>
                    <button
                      className="menu-item"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/customer/order-history');
                      }}
                    >
                      <span className="menu-icon">📦</span>
                      Order History
                    </button>
                    <div className="menu-divider"></div>
                    <button
                      className="menu-item menu-item-danger"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <span className="menu-icon">🚪</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="menu-item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/customer/login');
                    }}
                  >
                    <span className="menu-icon">�</span>
                    Login / Register
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="page-title-section">
        <h1 className="page-title">Choose a Restaurant</h1>
        <p className="page-subtitle">Browse menus and order ahead</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="restaurant-list-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading restaurants...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button className="retry-btn" onClick={loadRestaurants}>
              Try Again
            </button>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>
              {searchQuery
                ? 'No restaurants found matching your search'
                : 'No restaurants available at the moment'}
            </p>
          </div>
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="restaurant-card"
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className="restaurant-card-header">
                  <div className="restaurant-emoji">
                    {getRestaurantEmoji()}
                  </div>
                  <div className="restaurant-status">
                    <span className="status-dot"></span>
                    <span className="status-text">Open</span>
                  </div>
                </div>
                <div className="restaurant-card-body">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  {restaurant.address && (
                    <div className="restaurant-location">
                      <span className="location-icon">📍</span>
                      <span>{restaurant.address}</span>
                    </div>
                  )}
                  {restaurant.phone && (
                    <div className="restaurant-phone">
                      <span className="phone-icon">📞</span>
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                </div>
                <div className="restaurant-card-footer">
                  <button className="view-menu-btn">
                    View Menu
                    <span className="arrow-icon">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
