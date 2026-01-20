import { useState, useEffect } from "react";
import { menuItemsApi } from "../../api/menuItemsApi";
import type {
  MenuItem,
  CreateMenuItemData,
  UpdateMenuItemData,
} from "../../types/menuItems.types";
import axiosInstance from "../../api/axiosConfig";
import ImageUpload from "../../components/ImageUpload";
import RestaurantSelector from "../../components/RestaurantSelector";
import { useRestaurant } from "../../contexts/RestaurantContext";
import "../../App.css";
import "./MenuItemsManagement.css";

// SVG Icon Components
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

interface Category {
  id: string;
  name: string;
  status: string;
}

interface ModifierGroup {
  id: string;
  name: string;
  status: string;
}

export default function MenuItemsManagement() {
  const { selectedRestaurant } = useRestaurant();

  // Data states
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [chefRecommendedFilter, setChefRecommendedFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Form data
  const [formData, setFormData] = useState<CreateMenuItemData>({
    category_id: "",
    name: "",
    description: "",
    price: 0,
    prep_time_minutes: 0,
    status: "available",
    is_chef_recommended: false,
    modifier_group_ids: [],
  });

  // Load menu items
  const loadMenuItems = async () => {
    if (!selectedRestaurant) {
      setItems([]);
      setTotalPages(1);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await menuItemsApi.getAll({
        restaurant_id: selectedRestaurant.id,
        search: debouncedSearch?.trim() || undefined,
        category_id: categoryFilter || undefined,
        status: statusFilter || undefined,
        is_chef_recommended: chefRecommendedFilter || undefined,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });

      setItems(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load menu items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    if (!selectedRestaurant) {
      setCategories([]);
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/api/admin/menu/categories?status=active&restaurant_id=${selectedRestaurant.id}`
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // Load modifier groups
  const loadModifierGroups = async () => {
    if (!selectedRestaurant) {
      setModifierGroups([]);
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/api/admin/menu/modifier-groups?status=active&restaurant_id=${selectedRestaurant.id}`
      );
      setModifierGroups(response.data);
    } catch (err) {
      console.error("Failed to load modifier groups", err);
    }
  };

  // Initial load
  useEffect(() => {
    loadCategories();
    loadModifierGroups();
  }, [selectedRestaurant]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reload items when filters change
  useEffect(() => {
    loadMenuItems();
  }, [
    selectedRestaurant,
    debouncedSearch,
    categoryFilter,
    statusFilter,
    chefRecommendedFilter,
    sortBy,
    currentPage,
  ]);

  // Handle create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      alert("Please select a restaurant first");
      return;
    }

    // Validation
    if (!formData.category_id) {
      alert("Please select a category");
      return;
    }
    if (formData.name.length < 2 || formData.name.length > 80) {
      alert("Name must be between 2 and 80 characters");
      return;
    }
    if (formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    try {
      // Don't send restaurant_id - backend gets it from category
      const { ...createData } = formData;
      await menuItemsApi.create(createData);
      setShowCreateModal(false);
      resetForm();
      loadMenuItems();
      alert("Menu item created successfully!");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to create menu item. Please check your input."
      );
      console.error(err);
    }
  };

  // Handle edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const updateData: UpdateMenuItemData = {
      category_id: formData.category_id || undefined,
      name: formData.name || undefined,
      description: formData.description || undefined,
      price: formData.price || undefined,
      prep_time_minutes: formData.prep_time_minutes || undefined,
      status: formData.status || undefined,
      is_chef_recommended: formData.is_chef_recommended,
      modifier_group_ids: formData.modifier_group_ids,
    };

    try {
      await menuItemsApi.update(selectedItem.id, updateData);
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      loadMenuItems();
      alert("Menu item updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update menu item");
      console.error(err);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await menuItemsApi.delete(id);
      loadMenuItems();
      alert("Menu item deleted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete menu item");
      console.error(err);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await menuItemsApi.updateStatus(id, newStatus);
      loadMenuItems();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = async (item: MenuItem) => {
    // Fetch full item details with photos
    try {
      const detailedItem = await menuItemsApi.getOne(item.id);
      
      // Filter out modifier groups that no longer exist (may have been deleted)
      const validModifierGroupIds = detailedItem.modifierGroups
        ?.map((g) => g.id)
        .filter((id) => modifierGroups.some((mg) => mg.id === id)) || [];
      
      setSelectedItem(detailedItem);
      setFormData({
        category_id: detailedItem.category.id,
        name: detailedItem.name,
        description: detailedItem.description || "",
        price: detailedItem.price,
        prep_time_minutes: detailedItem.prepTimeMinutes,
        status: detailedItem.status.toLowerCase(), // Normalize to lowercase for validation
        is_chef_recommended: detailedItem.isChefRecommended,
        modifier_group_ids: validModifierGroupIds,
      });
      setShowEditModal(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to load item details");
      console.error(err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category_id: "",
      name: "",
      description: "",
      price: 0,
      prep_time_minutes: 0,
      status: "available",
      is_chef_recommended: false,
      modifier_group_ids: [],
    });
  };

  // Toggle modifier group selection
  const toggleModifierGroup = (groupId: string) => {
    const currentIds = formData.modifier_group_ids || [];
    if (currentIds.includes(groupId)) {
      setFormData({
        ...formData,
        modifier_group_ids: currentIds.filter((id) => id !== groupId),
      });
    } else {
      setFormData({
        ...formData,
        modifier_group_ids: [...currentIds, groupId],
      });
    }
  };

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="menu-items-container">
      <div className="menu-items-header">
        <div className="header-title-section">
          <h1>
            <MenuIcon /> Menu Items
          </h1>
          <p>Manage your restaurant menu items ({totalItems} items)</p>
        </div>
        <div className="header-actions">
          <RestaurantSelector />
          <button
            className="btn-add-new"
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedRestaurant}
          >
            <PlusIcon /> Add New Item
          </button>
        </div>
      </div>

      {!selectedRestaurant ? (
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
            <path d="M7 2v20"/>
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
          </svg>
          <h3>Please select a restaurant</h3>
          <p>Select a restaurant to manage menu items</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="filters-container">
            {/* Search Bar */}
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or description... (Vietnamese supported)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
            </div>

            {/* Filter Controls */}
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">
                  <TagIcon /> Category
                </label>
                <select
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <ListIcon /> Status
                </label>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <StarIcon /> Recommendation
                </label>
                <select
                  className="filter-select"
                  value={chefRecommendedFilter}
                  onChange={(e) => {
                    setChefRecommendedFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Items</option>
                  <option value="true">Chef Recommended</option>
                  <option value="false">Regular Items</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <ListIcon /> Sort By
                </label>
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="created_at_desc">Newest First</option>
                  <option value="created_at_asc">Oldest First</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="results-bar">
            <span>
              Showing <strong>{items.length}</strong> of{" "}
              <strong>{totalItems}</strong> items
            </span>
            {searchQuery && (
              <span style={{ color: "var(--primary-500)" }}>
                Search results for "{searchQuery}"
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                color: "#fee2e2",
                padding: "15px 20px",
                background: "#7f1d1d",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #dc2626",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                background: "#1e293b",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                border: "1px solid #334155",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>⏳</div>
              <p style={{ color: "#a855f7", fontWeight: "500" }}>
                Loading menu items...
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && items.length > 0 && (
            <div className="table-container">
              <table className="menu-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Prep Time</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Chef</th>
                    <th style={{ textAlign: "center" }}>Mods</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.primaryPhoto ? (
                          <img
                            src={item.primaryPhoto}
                            alt={item.name}
                            className="item-photo"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/60?text=No+Image";
                            }}
                          />
                        ) : (
                          <img
                            src="https://via.placeholder.com/60?text=No+Image"
                            alt="No image"
                            className="item-photo"
                          />
                        )}
                      </td>
                      <td>
                        <div className="item-name-cell">
                          <div className="item-name">{item.name}</div>
                          {item.description && (
                            <div className="item-description">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">
                          {item.category.name}
                        </span>
                      </td>
                      <td className="price-cell">{formatPrice(item.price)}</td>
                      <td>
                        <div className="prep-time-cell">
                          <ClockIcon /> {item.prepTimeMinutes} min
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            item.status === "available"
                              ? "available"
                              : "unavailable"
                          }`}
                        >
                          {item.status === "available" ? (
                            <CheckIcon />
                          ) : (
                            <XIcon />
                          )}
                          {item.status === "available"
                            ? "Available"
                            : item.status === "unavailable"
                            ? "Unavailable"
                            : "Sold Out"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div
                          className={`chef-icon ${item.isChefRecommended ? "active" : ""}`}
                          title={item.isChefRecommended ? "Chef Recommended" : "Regular Item"}
                        >
                          <StarIcon filled={item.isChefRecommended} />
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "var(--bg-secondary)",
                            padding: "6px 10px",
                            borderRadius: "var(--radius-lg)",
                            fontWeight: "600",
                            fontSize: "var(--text-sm)",
                          }}
                        >
                          {item.modifierGroupsCount || 0}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => openEditModal(item)}
                            className="btn-icon btn-edit"
                            title="Edit"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="btn-icon btn-delete"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No results */}
          {!loading && items.length === 0 && (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
              </svg>
              <h3>No menu items found</h3>
              <p>
                {searchQuery || categoryFilter || statusFilter
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first menu item!"}
              </p>
              {!searchQuery && !categoryFilter && !statusFilter && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-add-new"
                  style={{ marginTop: "var(--space-4)" }}
                >
                  <PlusIcon /> Create First Item
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}

          {/* Create Modal */}
          {showCreateModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowCreateModal(false)}
            >
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Create New Menu Item</h2>
                <form onSubmit={handleCreate}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder="e.g., Grilled Salmon"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      maxLength={500}
                      placeholder="Optional description"
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    <div className="form-group">
                      <label>Price (VND) *</label>
                      <input
                        type="number"
                        value={formData.price || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price:
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value),
                          })
                        }
                        required
                        min={1}
                        step={1}
                        placeholder="50000"
                      />
                    </div>

                    <div className="form-group">
                      <label>Prep Time (minutes)</label>
                      <input
                        type="number"
                        value={formData.prep_time_minutes || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prep_time_minutes:
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value),
                          })
                        }
                        min={0}
                        max={240}
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      required
                    >
                      <option value="available">✅ Available</option>
                      <option value="unavailable">⏸️ Unavailable</option>
                      <option value="sold_out">🔴 Sold Out</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.is_chef_recommended}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_chef_recommended: e.target.checked,
                          })
                        }
                        style={{ width: "auto", margin: 0 }}
                      />
                      <span>Chef Recommended</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Modifier Groups</label>
                    <div
                      style={{
                        maxHeight: "150px",
                        overflowY: "auto",
                        border: "1px solid var(--border)",
                        padding: "10px",
                        borderRadius: "8px",
                        background: "var(--bg-main)",
                      }}
                    >
                      {modifierGroups.length === 0 && (
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.9em",
                            margin: 0,
                          }}
                        >
                          No modifier groups available
                        </p>
                      )}
                      {modifierGroups.map((group) => (
                        <label
                          key={group.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "5px 0",
                            cursor: "pointer",
                            color: "var(--text-primary)",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.modifier_group_ids?.includes(
                              group.id
                            )}
                            onChange={() => toggleModifierGroup(group.id)}
                            style={{ width: "auto", margin: 0 }}
                          />
                          <span>{group.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Info about photos */}
                  <div
                    style={{
                      padding: "12px 15px",
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
                      <span>
                        Photos can be added after creating the item by clicking
                        the Edit button.
                      </span>
                    </p>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Create Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedItem && (
            <div
              className="modal-overlay"
              onClick={() => setShowEditModal(false)}
            >
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Menu Item</h2>
                <form onSubmit={handleEdit}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder="e.g., Grilled Salmon"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      maxLength={500}
                      placeholder="Optional description"
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    <div className="form-group">
                      <label>Price (VND) *</label>
                      <input
                        type="number"
                        value={formData.price || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price:
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value),
                          })
                        }
                        required
                        min={1}
                        step={1}
                        placeholder="50000"
                      />
                    </div>

                    <div className="form-group">
                      <label>Prep Time (minutes)</label>
                      <input
                        type="number"
                        value={formData.prep_time_minutes || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prep_time_minutes:
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value),
                          })
                        }
                        min={0}
                        max={240}
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      required
                    >
                      <option value="available">✅ Available</option>
                      <option value="unavailable">⏸️ Unavailable</option>
                      <option value="sold_out">🔴 Sold Out</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.is_chef_recommended}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_chef_recommended: e.target.checked,
                          })
                        }
                        style={{ width: "auto", margin: 0 }}
                      />
                      <span>Chef Recommended</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Modifier Groups</label>
                    <div
                      style={{
                        maxHeight: "150px",
                        overflowY: "auto",
                        border: "1px solid var(--border)",
                        padding: "10px",
                        borderRadius: "8px",
                        background: "var(--bg-main)",
                      }}
                    >
                      {modifierGroups.map((group) => (
                        <label
                          key={group.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "5px 0",
                            cursor: "pointer",
                            color: "var(--text-primary)",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.modifier_group_ids?.includes(
                              group.id
                            )}
                            onChange={() => toggleModifierGroup(group.id)}
                            style={{ width: "auto", margin: 0 }}
                          />
                          <span>{group.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload Component - Only in Edit Mode */}
                  <ImageUpload
                    itemId={selectedItem.id}
                    photos={selectedItem.photos || []}
                    onPhotosChange={async () => {
                      // Reload the specific item details to get updated photos
                      try {
                        const updatedItem = await menuItemsApi.getOne(
                          selectedItem.id
                        );
                        setSelectedItem(updatedItem);
                      } catch (err) {
                        console.error("Failed to reload item photos:", err);
                      }
                    }}
                  />

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
