import { useState, useEffect } from "react";
import { menuItemsApi } from "../api/menuItemsApi";
import type {
  MenuItem,
  CreateMenuItemData,
  UpdateMenuItemData,
} from "../api/menuItemsApi";
import axios from "axios";
import ImageUpload from "../components/ImageUpload";
import "../App.css";

// Import category and modifier APIs
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
  const RESTAURANT_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

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
    restaurant_id: RESTAURANT_ID,
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
    try {
      setLoading(true);
      const response = await menuItemsApi.getAll(RESTAURANT_ID, {
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
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/menu/categories?status=active`
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // Load modifier groups
  const loadModifierGroups = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/menu/modifier-groups?status=active`
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
  }, []);

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
      await menuItemsApi.create(formData);
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
      setSelectedItem(detailedItem);
      setFormData({
        restaurant_id: RESTAURANT_ID,
        category_id: detailedItem.category.id,
        name: detailedItem.name,
        description: detailedItem.description || "",
        price: detailedItem.price,
        prep_time_minutes: detailedItem.prepTimeMinutes,
        status: detailedItem.status,
        is_chef_recommended: detailedItem.isChefRecommended,
        modifier_group_ids: detailedItem.modifierGroups?.map((g) => g.id) || [],
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
      restaurant_id: RESTAURANT_ID,
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
    <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <div className="header" style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "30px",
        padding: "20px",
        background: "#1e293b",
        borderRadius: "12px",
        borderBottom: "2px solid #6366f1",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: "2em", 
            fontWeight: "700",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🍽️ Menu Items
          </h1>
          <p style={{ margin: "5px 0 0 0", color: "#cbd5e1" }}>Manage your restaurant menu items ({totalItems} items)</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "#6366f1",
            color: "white",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(99, 102, 241, 0.4)",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#4f46e5";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(99, 102, 241, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#6366f1";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(99, 102, 241, 0.4)";
          }}
        >
          ➕ Add New Item
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        background: "#1e293b",
        borderRadius: "12px",
        padding: "25px",
        marginBottom: "25px",
        border: "1px solid #334155",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
      }}>
        {/* Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "20px",
              color: searchQuery !== debouncedSearch ? "#fbbf24" : "#6366f1"
            }}>
              {searchQuery !== debouncedSearch ? "⏳" : "🔍"}
            </span>
            <input
              type="text"
              placeholder="Search by name or description... (Vietnamese supported)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              style={{ 
                width: "100%",
                padding: "15px 15px 15px 50px",
                fontSize: "16px",
                border: `1px solid ${searchQuery !== debouncedSearch ? "#fbbf24" : "#334155"}`,
                borderRadius: "8px",
                outline: "none",
                transition: "all 0.3s ease",
                background: "#0f172a",
                color: "#f1f5f9"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#334155";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#cbd5e1", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              📂 Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #334155",
                borderRadius: "8px",
                outline: "none",
                cursor: "pointer",
                background: "#0f172a",
                color: "#f1f5f9",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#334155";
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

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#cbd5e1", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              📊 Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #334155",
                borderRadius: "8px",
                outline: "none",
                cursor: "pointer",
                background: "#0f172a",
                color: "#f1f5f9",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#334155";
              }}
            >
              <option value="">All Status</option>
              <option value="available">✅ Available</option>
              <option value="unavailable">⏸️ Unavailable</option>
              <option value="sold_out">🔴 Sold Out</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#cbd5e1", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              ⭐ Recommendation
            </label>
            <select
              value={chefRecommendedFilter}
              onChange={(e) => {
                setChefRecommendedFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #334155",
                borderRadius: "8px",
                outline: "none",
                cursor: "pointer",
                background: "#0f172a",
                color: "#f1f5f9",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#334155";
              }}
            >
              <option value="">All Items</option>
              <option value="true">⭐ Chef Recommended</option>
              <option value="false">Regular Items</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#cbd5e1", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🔄 Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #334155",
                borderRadius: "8px",
                outline: "none",
                cursor: "pointer",
                background: "#0f172a",
                color: "#f1f5f9",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#334155";
              }}
            >
              <option value="created_at_desc">📅 Newest First</option>
              <option value="created_at_asc">📅 Oldest First</option>
              <option value="name_asc">🔤 Name (A-Z)</option>
              <option value="name_desc">🔤 Name (Z-A)</option>
              <option value="price_asc">💰 Price (Low to High)</option>
              <option value="price_desc">💰 Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        padding: "15px 20px",
        background: "#1e293b",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#cbd5e1",
        border: "1px solid #334155"
      }}>
        <span>📊 Showing <strong style={{ color: "#6366f1" }}>{items.length}</strong> of <strong style={{ color: "#6366f1" }}>{totalItems}</strong> items</span>
        {searchQuery && (
          <span style={{ color: "#a855f7" }}>
            🔍 Search results for "{searchQuery}"
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ 
          color: "#fee2e2", 
          padding: "15px 20px", 
          background: "#7f1d1d", 
          borderRadius: "8px", 
          marginBottom: "20px",
          border: "1px solid #dc2626",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          background: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          border: "1px solid #334155"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>⏳</div>
          <p style={{ color: "#a855f7", fontWeight: "500" }}>Loading menu items...</p>
        </div>
      )}

      {/* Table */}
      {!loading && items.length > 0 && (
        <div style={{
          background: "#1e293b",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          border: "1px solid #334155"
        }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            fontSize: "14px"
          }}>
            <thead>
              <tr style={{ 
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                color: "white"
              }}>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Photo</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Name</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Category</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Price</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Prep Time</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "center", fontWeight: "600" }}>Chef</th>
                <th style={{ padding: "16px", textAlign: "center", fontWeight: "600" }}>Mods</th>
                <th style={{ padding: "16px", textAlign: "center", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} style={{
                  borderBottom: "1px solid #334155",
                  background: index % 2 === 0 ? "#1e293b" : "#0f172a",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1e40af30";
                  e.currentTarget.style.transform = "scale(1.005)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? "#1e293b" : "#0f172a";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                >
                  <td style={{ padding: "16px" }}>
                    {item.primaryPhoto ? (
                      <img
                        src={item.primaryPhoto}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/60?text=No+Image";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "28px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                      >
                        🍽️
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontWeight: "600", color: "#f1f5f9", marginBottom: "4px" }}>
                      {item.name}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#94a3b8",
                          lineHeight: "1.4"
                        }}
                      >
                        {item.description.substring(0, 60)}
                        {item.description.length > 60 ? "..." : ""}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      background: "#312e81",
                      color: "#a5b4fc",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "500"
                    }}>
                      {item.category.name}
                    </span>
                  </td>
                  <td style={{ padding: "16px", fontWeight: "700", color: "#10b981", fontSize: "15px" }}>
                    {formatPrice(item.price)}
                  </td>
                  <td style={{ padding: "16px", color: "#94a3b8" }}>
                    ⏱️ {item.prepTimeMinutes} min
                  </td>
                  <td style={{ padding: "16px" }}>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusUpdate(item.id, e.target.value)
                      }
                      style={{
                        border: "none",
                        borderRadius: "20px",
                        padding: "6px 12px",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        background: item.status === "available" ? "#064e3b" : item.status === "sold_out" ? "#7f1d1d" : "#78350f",
                        color: item.status === "available" ? "#6ee7b7" : item.status === "sold_out" ? "#fca5a5" : "#fcd34d"
                      }}
                    >
                      <option value="available">✅ Available</option>
                      <option value="unavailable">⏸️ Unavailable</option>
                      <option value="sold_out">🔴 Sold Out</option>
                    </select>
                  </td>
                  <td style={{ padding: "16px", textAlign: "center", fontSize: "20px" }}>
                    {item.isChefRecommended ? "⭐" : "-"}
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <span style={{
                      background: "#334155",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      fontSize: "13px"
                    }}>
                      {item.modifierGroupsCount || 0}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit"
                        style={{
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "16px",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#2563eb";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(59, 130, 246, 0.4)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#3b82f6";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.3)";
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        title="Delete"
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "16px",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#dc2626";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(239, 68, 68, 0.4)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#ef4444";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(239, 68, 68, 0.3)";
                        }}
                      >
                        🗑️
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
        <div style={{ 
          textAlign: "center", 
          padding: "60px 40px", 
          background: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          border: "1px solid #334155"
        }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🍽️</div>
          <h3 style={{ color: "#cbd5e1", marginBottom: "10px", fontSize: "20px" }}>
            No menu items found
          </h3>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            {searchQuery || categoryFilter || statusFilter 
              ? "Try adjusting your filters or search terms"
              : "Get started by creating your first menu item!"}
          </p>
          {!searchQuery && !categoryFilter && !statusFilter && (
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{
                background: "#6366f1",
                color: "white",
                padding: "12px 30px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(99, 102, 241, 0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(99, 102, 241, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(99, 102, 241, 0.4)";
              }}
            >
              ➕ Create First Item
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          marginTop: "30px", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          gap: "10px",
          padding: "20px",
          background: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          border: "1px solid #334155"
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "10px 20px",
              border: "1px solid #334155",
              borderRadius: "8px",
              background: currentPage === 1 ? "#0f172a" : "#1e293b",
              color: currentPage === 1 ? "#475569" : "#a5b4fc",
              fontWeight: "600",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = "#334155";
                e.currentTarget.style.borderColor = "#6366f1";
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.borderColor = "#334155";
              }
            }}
          >
            ← Previous
          </button>
          <span style={{ 
            padding: "10px 20px",
            fontWeight: "600",
            color: "#cbd5e1",
            background: "#0f172a",
            borderRadius: "8px",
            minWidth: "140px",
            textAlign: "center",
            border: "1px solid #334155"
          }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "10px 20px",
              border: "1px solid #334155",
              borderRadius: "8px",
              background: currentPage === totalPages ? "#0f172a" : "#1e293b",
              color: currentPage === totalPages ? "#475569" : "#a5b4fc",
              fontWeight: "600",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = "#334155";
                e.currentTarget.style.borderColor = "#6366f1";
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.borderColor = "#334155";
              }
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
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
                    setFormData({ ...formData, category_id: e.target.value })
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
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Optional description"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div className="form-group">
                  <label>Price (VND) *</label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value === "" ? 0 : parseFloat(e.target.value),
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
                        prep_time_minutes: e.target.value === "" ? 0 : parseInt(e.target.value),
                      })
                    }
                    min={0}
                    max={240}
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
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
                <div style={{ 
                  maxHeight: "150px", 
                  overflowY: "auto", 
                  border: "1px solid var(--border)", 
                  padding: "10px", 
                  borderRadius: "8px",
                  background: "var(--bg-main)"
                }}>
                  {modifierGroups.length === 0 && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9em", margin: 0 }}>
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
                        color: "var(--text-primary)"
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
              <div style={{ 
                padding: "12px 15px", 
                background: "rgba(99, 102, 241, 0.1)", 
                border: "1px solid rgba(99, 102, 241, 0.3)", 
                borderRadius: "8px",
                marginBottom: "1rem"
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: "0.9rem", 
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
                  <span>Photos can be added after creating the item by clicking the Edit button.</span>
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
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
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
                    setFormData({ ...formData, category_id: e.target.value })
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
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Optional description"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div className="form-group">
                  <label>Price (VND) *</label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value === "" ? 0 : parseFloat(e.target.value),
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
                        prep_time_minutes: e.target.value === "" ? 0 : parseInt(e.target.value),
                      })
                    }
                    min={0}
                    max={240}
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
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
                <div style={{ 
                  maxHeight: "150px", 
                  overflowY: "auto", 
                  border: "1px solid var(--border)", 
                  padding: "10px", 
                  borderRadius: "8px",
                  background: "var(--bg-main)"
                }}>
                  {modifierGroups.map((group) => (
                    <label
                      key={group.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "5px 0",
                        cursor: "pointer",
                        color: "var(--text-primary)"
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
                    const updatedItem = await menuItemsApi.getOne(selectedItem.id);
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
    </div>
  );
}
