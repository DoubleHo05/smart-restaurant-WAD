import { useState, useEffect } from "react";
import { restaurantsApi } from "../../../api/restaurantsApi";
import { usersApi } from "../../../api/usersApi";
import type {
  Restaurant,
  CreateRestaurantData,
  UpdateRestaurantData,
} from "../../../types/restaurant.types";
import type { User } from "../../../types/user.types";
import { useToast } from "../../../contexts/ToastContext";
import { useConfirm } from "../../../components/ConfirmDialog";
import { useRestaurant } from "../../../contexts/RestaurantContext";

export default function RestaurantsTab() {
  const { restaurants, loading, error, refreshRestaurants } = useRestaurant();
  const toast = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirm();

  // Users list (for owner selection)
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // Form data
  const [formData, setFormData] = useState<CreateRestaurantData>({
    name: "",
    address: "",
    phone: "",
    owner_id: "",
  });

  const [updateFormData, setUpdateFormData] = useState<UpdateRestaurantData>({
    name: "",
    address: "",
    phone: "",
    status: "active",
  });

  // Fetch users on mount (exclude super_admin)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const allUsers = await usersApi.getAll();
        // Filter: only admin users (exclude super_admin)
        const adminUsers = allUsers.filter(
          (user) => user.roles.includes("admin") && !user.roles.includes("super_admin")
        );
        setUsers(adminUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to load users list");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [toast]);

  // Filter restaurants
  const filteredRestaurants = statusFilter
    ? restaurants.filter((r) => r.status === statusFilter)
    : restaurants;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.owner_id) {
      toast.error("Please select an owner");
      return;
    }

    try {
      await restaurantsApi.create(formData);
      setShowCreateModal(false);
      setFormData({
        name: "",
        address: "",
        phone: "",
        owner_id: "",
      });
      toast.success("Restaurant created successfully!");
      refreshRestaurants();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create restaurant");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;

    try {
      await restaurantsApi.update(selectedRestaurant.id, updateFormData);
      setShowEditModal(false);
      setSelectedRestaurant(null);
      setUpdateFormData({
        name: "",
        address: "",
        phone: "",
        status: "active",
      });
      toast.success("Restaurant updated successfully!");
      refreshRestaurants();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update restaurant");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm(
      "Delete Restaurant",
      `Are you sure you want to delete restaurant "${name}"? This will also delete all associated data.`
    );
    if (!confirmed) return;

    try {
      await restaurantsApi.delete(id);
      toast.success("Restaurant deleted successfully!");
      refreshRestaurants();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete restaurant");
    }
  };

  const openEditModal = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setUpdateFormData({
      name: restaurant.name,
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      status: restaurant.status,
    });
    setShowEditModal(true);
  };

  return (
    <>
      {/* Filters & Actions */}
      <div className="filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Add Restaurant
          </button>
        </div>
      </div>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="loading">Loading restaurants...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="tables-grid">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="table-card">
              <div className="table-header">
                <h3>{restaurant.name}</h3>
                <span className={`status-badge ${restaurant.status}`}>
                  {restaurant.status}
                </span>
              </div>
              <div className="table-body">
                {restaurant.address && (
                  <p>
                    <strong>📍 Address:</strong> {restaurant.address}
                  </p>
                )}
                {restaurant.phone && (
                  <p>
                    <strong>📞 Phone:</strong> {restaurant.phone}
                  </p>
                )}
                {restaurant.owner && (
                  <p>
                    <strong>👤 Owner:</strong> {restaurant.owner.email}
                    {restaurant.owner.full_name &&
                      ` (${restaurant.owner.full_name})`}
                  </p>
                )}
                {restaurant._count && (
                  <p>
                    <strong>📊 Stats:</strong> {restaurant._count.tables}{" "}
                    tables, {restaurant._count.menu_categories} categories
                  </p>
                )}
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Created:{" "}
                  {new Date(restaurant.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="table-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => openEditModal(restaurant)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(restaurant.id, restaurant.name)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRestaurants.length === 0 && !loading && !error && (
        <div className="empty-state">
          <p>No restaurants found. Create your first restaurant!</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Restaurant</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Owner (Admin) *</label>
                <select
                  required
                  value={formData.owner_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_id: e.target.value })
                  }
                  disabled={loadingUsers}
                >
                  <option value="">-- Select Owner --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                      {user.full_name && ` (${user.full_name})`}
                      {" - "}
                      {user.roles.join(", ")}
                    </option>
                  ))}
                </select>
                {loadingUsers && (
                  <small style={{ color: "#94a3b8" }}>Loading users...</small>
                )}
              </div>
              <div className="form-group">
                <label>Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Smart Restaurant - Downtown"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="123 Main Street, District 1, Ho Chi Minh City"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0283 123 4567"
                />
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
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRestaurant && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Restaurant</h2>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  value={updateFormData.name}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={updateFormData.address}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={updateFormData.phone}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={updateFormData.status}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      status: e.target.value,
                    })
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
                  Update Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialogComponent />
    </>
  );
}
