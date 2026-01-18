import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getPublicMenu, getMenuCategories } from '../../api/publicApi';
import { fuzzySearchMenuItems } from '../../utils/fuzzySearch';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useUrlSync, useUrlParams } from '../../hooks/useUrlSync';
import { useDebounce } from '../../hooks/useDebounce';
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
  isChefRecommended?: boolean;
}

export default function CustomerMenu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const restaurantId = searchParams.get('restaurant');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]); // Store all loaded items
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurantName, setRestaurantName] = useState<string>('Restaurant Menu');
  const [sortBy, setSortBy] = useState<string>(''); // '', 'popularity', 'chef'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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

  // Helper function to load menu
  const loadMenu = useCallback(async (pageNum: number = 1, append: boolean = false, categoryFilter?: string) => {
    if (!restaurantId) return;

    try {
      setLoading(true);

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
        setCategories(categoriesData || []);
      }

      const items = menuData?.items || [];

      if (append) {
        setAllMenuItems(prev => [...prev, ...items]);
      } else {
        setAllMenuItems(items);
        setPage(1);
      }

      setTotalPages(menuData?.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, sortBy, categories, selectedCategory, searchTerm]);

  // Load more items for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (!restaurantId || searchTerm.trim() || page >= totalPages) return;

    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const menuData = await getPublicMenu(
        selectedCategory,
        undefined,
        restaurantId,
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
  }, [restaurantId, searchTerm, page, totalPages, selectedCategory, sortBy]);

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
    if (location.state && (location.state as any).restaurantName) {
      setRestaurantName((location.state as any).restaurantName);
    }

    if (!restaurantId) {
      navigate('/customer/restaurants');
      return;
    }

    // Load initial menu
    loadMenu(1, false);
  }, [restaurantId, navigate, location.state]);

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
      if (!restaurantId) return;

      // If searching, load ALL items for fuzzy search to work properly
      if (debouncedSearchTerm.trim()) {
        setLoading(true);
        try {
          const menuData = await getPublicMenu(
            undefined,
            undefined,
            restaurantId,
            sortBy,
            1,
            1000  // Load all items (adjust if you have more than 1000)
          );
          setAllMenuItems(menuData?.items || []);
          setTotalPages(menuData?.pagination?.totalPages || 1);
        } catch (error) {
          console.error('Failed to load all items for search:', error);
        } finally {
          setLoading(false);
        }
      }
      // Note: When search is cleared, items remain as-is.
      // User can select a category to reload with proper filter.
    };

    performSearch();
  }, [debouncedSearchTerm, restaurantId, sortBy]);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
    // Reload menu with new category filter - pass categoryId directly to avoid stale closure
    if (restaurantId) {
      await loadMenu(1, false, categoryId);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);  // Update immediately for UI
    setPage(1);
    // API call will be triggered by useEffect after debounce delay
  };

  const handleSortChange = async (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
    // Reload with new sort
    if (restaurantId) {
      await loadMenu(1, false);
    }
  };

  return (
    <div className="customer-menu">
      {/* Header */}
      <div className="menu-header">
        <div className="header-left">
          <button
            className="header-back"
            onClick={() => navigate('/customer/restaurants')}
          >
            ←
          </button>
        </div>
        <div className="header-center">
          <span className="restaurant-name-header">{restaurantName}</span>
        </div>
        <div className="header-right"></div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
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
      )}

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
        {menuItems.length === 0 ? (
          <div className="no-items">
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍽️</div>
            <p>No menu items available</p>
          </div>
        ) : (
          menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-item-card"
              onClick={() => navigate(`/customer/menu/item/${item.id}`)}
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
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price))}
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
              width: '30px',
              height: '30px',
              border: '3px solid #ecf0f1',
              borderTopColor: '#e74c3c',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            <p style={{ margin: 0, fontSize: '14px' }}>Loading more items...</p>
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
    </div>
  );
}
