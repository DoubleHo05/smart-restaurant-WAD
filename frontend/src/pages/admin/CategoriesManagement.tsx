import { useState, useEffect } from "react";
import { categoriesApi } from "../../api/categoriesApi";
import type {
  Category,
  CreateCategoryData,
} from "../../types/categories.types";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../components/ConfirmDialog";
import { useRestaurant } from "../../contexts/RestaurantContext";
import RestaurantSelector from "../../components/RestaurantSelector";
import "../../App.css";

export default function CategoriesManagement() {
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirm();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Form data
  const [formData, setFormData] = useState<CreateCategoryData>({
    restaurant_id: "",
    name: "",
    description: "",
    display_order: 0,
    status: "active",
  });

  // Load categories
  const loadCategories = async () => {
    if (!selectedRestaurant) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(
        "🔍 Loading categories for restaurant:",
        selectedRestaurant.id
      );
      const data = await categoriesApi.getAll({
        restaurant_id: selectedRestaurant.id,
        status: statusFilter || undefined,
        sortBy: "display_order",
      });

      console.log("✅ Categories loaded:", data);
      setCategories(data);
      setError(null);
    } catch (err: any) {
      console.error("❌ Error loading categories:", err);
      setError(err.response?.data?.message || "Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [statusFilter, selectedRestaurant]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      toast.error("Please select a restaurant first");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const payload = {
        ...formData,
        restaurant_id: selectedRestaurant.id,
      };

      console.log("📤 Creating category with payload:", payload);

      await categoriesApi.create(payload);
      setShowCreateModal(false);
      setFormData({
        restaurant_id: "",
        name: "",
        description: "",
        display_order: 0,
        status: "active",
      });
      toast.success("Category created successfully!");
      loadCategories();
    } catch (err: any) {
      console.error("❌ Error creating category:", err);
      toast.error(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      await categoriesApi.update(selectedCategory.id, formData);
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({
        restaurant_id: "",
        name: "",
        description: "",
        display_order: 0,
        status: "active",
      });
      toast.success("Category updated successfully!");
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === "active" ? "inactive" : "active";
    try {
      await categoriesApi.updateStatus(category.id, newStatus);
      toast.success(
        `Category ${newStatus === "active" ? "activated" : "deactivated"}`
      );
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm(
      "Delete Category",
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmed) return;

    try {
      await categoriesApi.delete(id);
      toast.success("Category deleted successfully!");
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      restaurant_id: selectedRestaurant?.id || "",
      name: category.name,
      description: category.description || "",
      display_order: category.display_order,
      status: category.status,
    });
    setShowEditModal(true);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📁 Categories Management</h1>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <RestaurantSelector />
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = "/")}
          >
            ← Back to Tables
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedRestaurant}
          >
            + Add Category
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={{ marginLeft: "auto", color: "#666" }}>
          Total: {categories.length} categories
        </div>
      </div>

      {/* Categories Table */}
      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="tables-grid">
          {categories.map((category) => (
            <div key={category.id} className="table-card">
              <div className="table-header">
                <h3>{category.name}</h3>
                <span className={`status-badge ${category.status}`}>
                  {category.status}
                </span>
              </div>
              <div className="table-body">
                {category.description && (
                  <p>
                    <strong>Description:</strong> {category.description}
                  </p>
                )}
                <p>
                  <strong>Display Order:</strong> {category.display_order}
                </p>
                {category.itemCount !== undefined && (
                  <p>
                    <strong>Items:</strong> {category.itemCount}
                  </p>
                )}
              </div>
              <div className="table-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => openEditModal(category)}
                >
                  ✏️ Edit
                </button>
                <button
                  className={`btn btn-sm ${
                    category.status === "active" ? "btn-warning" : "btn-success"
                  }`}
                  onClick={() => handleToggleStatus(category)}
                >
                  {category.status === "active"
                    ? "⏸️ Deactivate"
                    : "▶️ Activate"}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(category.id, category.name)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {categories.length === 0 && !loading && !error && (
        <div className="empty-state">
          <p>No categories found. Create your first category!</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Category</h2>
            {selectedRestaurant && (
              <div
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  borderLeft: "4px solid #2196F3",
                }}
              >
                <strong>Restaurant:</strong> {selectedRestaurant.name}
              </div>
            )}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Appetizers"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Category</h2>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialogComponent />
    </div>
  );
}
