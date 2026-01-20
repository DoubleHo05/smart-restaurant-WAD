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

  // SVG Icons
  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  const ListIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );

  const BoxIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );

  const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );

  const PauseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  );

  return (
    <div className="app">
      {/* Refined Header - Restored Purple Gradient with Clean Contrast */}
      <header className="header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1.5rem',
        padding: '2.5rem 3rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Circles */}
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-40%', left: '-10%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'white',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            WebkitTextFillColor: 'white' // Force white text
          }}>Categories Management</h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>Organize and manage your menu categories efficiently</p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px', borderRadius: '14px', backdropFilter: 'blur(4px)' }}>
            <RestaurantSelector />
          </div>
          <button
            className="btn"
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedRestaurant}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.875rem 1.75rem',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#667eea',
              background: 'white',
              border: 'none',
              borderRadius: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <span style={{ fontSize: '1.2em' }}>+</span> ADD CATEGORY
          </button>
        </div>
      </header>

      {/* Redesigned Filter Bar - No Back Button, Clean Centered Look */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 0.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#334155', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '24px', background: '#667eea', borderRadius: '4px', display: 'inline-block' }}></span>
          All Categories
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'white',
          padding: '8px 16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid var(--border-light)'
        }}>
          <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
            <label style={{ margin: 0, fontWeight: '600', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: '#f1f5f9',
                fontWeight: '600',
                color: '#334155',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div style={{ height: '20px', width: '1px', background: '#e2e8f0' }}></div>
          <div style={{ color: '#64748b', fontWeight: '500', fontSize: '0.9rem' }}>
            <strong>{categories.length}</strong> items
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="tables-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {categories.map((category) => (
            <div key={category.id} className="table-card" style={{
              background: 'white',
              borderRadius: '20px', // More rounded
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Card Decoration Bar */}
              <div style={{
                height: '6px',
                background: category.status === 'active' ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(90deg, #cbd5e1 0%, #e2e8f0 100%)',
                width: '100%'
              }}></div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b'
                  }}>
                    {/* Generative Icon Placeholder - Could be smart based on name, for now using initial */}
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#475569' }}>{category.name.charAt(0)}</span>
                  </div>
                  <span className={`status-badge ${category.status}`} style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: category.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    color: category.status === 'active' ? '#059669' : '#64748b'
                  }}>
                    {category.status}
                  </span>
                </div>

                <h3 style={{
                  marginTop: 0,
                  marginBottom: '0.5rem',
                  fontSize: '1.25rem',
                  color: '#1e293b',
                  fontWeight: '800'
                }}>{category.name}</h3>

                {category.description ? (
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', flex: 1 }}>
                    {category.description}
                  </p>
                ) : (
                  <div style={{ flex: 1, minHeight: '1.5em' }}></div> // Spacer
                )}

                {/* Stats Row - Compact and Styled */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  marginTop: 'auto' // Push to bottom if flex
                }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Order</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontWeight: '700' }}>
                      <ListIcon /> #{category.display_order}
                    </div>
                  </div>
                  <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Items</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontWeight: '700' }}>
                      <BoxIcon /> {category.itemCount || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="table-actions" style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                gap: '0.75rem',
                background: 'white'
              }}>
                <button
                  className="btn btn-primary"
                  onClick={() => openEditModal(category)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '10px',
                    padding: '10px',
                    background: '#6366f1', // Indigo
                    border: 'none',
                    color: 'white',
                    fontWeight: '600',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <EditIcon /> Edit
                </button>

                <button
                  onClick={() => handleToggleStatus(category)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={category.status === "active" ? "Deactivate" : "Activate"}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  {category.status === "active" ? <PauseIcon /> : <PlayIcon />}
                </button>

                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1px solid #fee2e2',
                    background: '#fef2f2',
                    color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Delete Category"
                  onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                >
                  <TrashIcon />
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
