import { useState, useEffect } from "react";
import { modifiersApi } from "../../api/modifiersApi";
import type {
  ModifierGroup,
  ModifierOption,
  CreateModifierGroupData,
  CreateModifierOptionData,
} from "../../types/modifiers.types";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../components/ConfirmDialog";
import { useRestaurant } from "../../contexts/RestaurantContext";
import RestaurantSelector from "../../components/RestaurantSelector";
import "../../App.css";

export default function ModifiersManagement() {
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [groups, setGroups] = useState<ModifierGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toast = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirm();

  // Modal states
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ModifierGroup | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<ModifierOption | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Form data
  const [groupFormData, setGroupFormData] = useState<CreateModifierGroupData>({
    restaurant_id: "",
    name: "",
    selection_type: "single",
    is_required: false,
    min_selections: 0,
    max_selections: 0,
    display_order: 0,
    status: "active",
    initialOptions: [],
  });

  const [optionFormData, setOptionFormData] =
    useState<CreateModifierOptionData>({
      name: "",
      price_adjustment: 0,
      status: "active",
    });

  // Load groups
  const loadGroups = async () => {
    if (!selectedRestaurant) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await modifiersApi.getAllGroups({
        restaurant_id: selectedRestaurant.id,
        includeOptions: true,
      });

      // Ensure options is always an array
      const groupsWithOptions = data.map((group) => ({
        ...group,
        options: group.options || [],
      }));
      setGroups(groupsWithOptions);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load modifiers");
      toast.error("Failed to load modifiers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [selectedRestaurant]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Group handlers
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      toast.error("Please select a restaurant first");
      return;
    }

    try {
      await modifiersApi.createGroup({
        ...groupFormData,
        restaurant_id: selectedRestaurant.id,
      });
      setShowGroupModal(false);
      resetGroupForm();
      toast.success("Group created successfully!");
      loadGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create group");
    }
  };

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      await modifiersApi.updateGroup(selectedGroup.id, groupFormData);
      setShowGroupModal(false);
      setSelectedGroup(null);
      resetGroupForm();
      toast.success("Group updated successfully!");
      loadGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update group");
    }
  };

  const openEditGroupModal = (group: ModifierGroup) => {
    setSelectedGroup(group);
    setGroupFormData({
      restaurant_id: group.restaurant_id,
      name: group.name,
      selection_type: group.selection_type,
      is_required: group.is_required,
      min_selections: group.min_selections,
      max_selections: group.max_selections,
      display_order: group.display_order,
      status: group.status,
      initialOptions: group.options || [],
    });
    setIsEditMode(true);
    setShowGroupModal(true);
  };

  const resetGroupForm = () => {
    setGroupFormData({
      restaurant_id: "",
      name: "",
      selection_type: "single",
      is_required: false,
      min_selections: 0,
      max_selections: 0,
      display_order: 0,
      status: "active",
      initialOptions: [],
    });
    setIsEditMode(false);
  };

  // Option handlers
  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      await modifiersApi.createOption(selectedGroup.id, optionFormData);
      setShowOptionModal(false);
      resetOptionForm();
      toast.success("Option added successfully!");
      loadGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add option");
    }
  };

  const handleUpdateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;

    try {
      await modifiersApi.updateOption(selectedOption.id, optionFormData);
      setShowOptionModal(false);
      setSelectedOption(null);
      resetOptionForm();
      toast.success("Option updated successfully!");
      loadGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update option");
    }
  };

  const handleDeleteOption = async (option: ModifierOption) => {
    const confirmed = await confirm(
      "Delete Option",
      `Are you sure you want to delete "${option.name}"?`
    );
    if (!confirmed) return;

    try {
      await modifiersApi.deleteOption(option.id);
      toast.success("Option deleted successfully!");
      loadGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete option");
    }
  };

  // Inline option handlers (for create/edit group modal)
  const addInlineOption = () => {
    const newOption: CreateModifierOptionData = {
      name: "",
      price_adjustment: 0,
      status: "active",
    };
    setGroupFormData((prev) => ({
      ...prev,
      initialOptions: [...(prev.initialOptions || []), newOption],
    }));
  };

  const removeInlineOption = (index: number) => {
    setGroupFormData((prev) => ({
      ...prev,
      initialOptions: (prev.initialOptions || []).filter((_, i) => i !== index),
    }));
  };

  const updateInlineOption = (index: number, field: string, value: any) => {
    setGroupFormData((prev) => ({
      ...prev,
      initialOptions: (prev.initialOptions || []).map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const openAddOptionModal = (group: ModifierGroup) => {
    setSelectedGroup(group);
    setSelectedOption(null);
    resetOptionForm();
    setShowOptionModal(true);
  };

  const openEditOptionModal = (
    group: ModifierGroup,
    option: ModifierOption
  ) => {
    setSelectedGroup(group);
    setSelectedOption(option);
    setOptionFormData({
      name: option.name,
      price_adjustment: option.price_adjustment,
      status: option.status,
    });
    setShowOptionModal(true);
  };

  const resetOptionForm = () => {
    setOptionFormData({
      name: "",
      price_adjustment: 0,
      status: "active",
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎛️ Modifiers Management</h1>
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
            onClick={() => {
              resetGroupForm();
              setShowGroupModal(true);
            }}
            disabled={!selectedRestaurant}
          >
            + Add Modifier Group
          </button>
        </div>
      </header>

      {/* Groups & Options */}
      {!selectedRestaurant ? (
        <div className="empty-state">
          <p>Please select a restaurant to manage modifiers.</p>
        </div>
      ) : loading ? (
        <div className="loading">Loading modifiers...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <p>No modifier groups found. Create your first group!</p>
        </div>
      ) : (
        <div style={{ padding: "20px" }}>
          {groups.map((group) => (
            <div
              key={group.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #334155",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#1e293b",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Group Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px 20px",
                  background: "#0f172a",
                  cursor: "pointer",
                  borderBottom: expandedGroups.has(group.id)
                    ? "1px solid #334155"
                    : "none",
                  transition: "all 0.2s ease",
                }}
                onClick={() => toggleGroup(group.id)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#1e293b";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#0f172a";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span style={{ fontSize: "18px", color: "#a5b4fc" }}>
                    {expandedGroups.has(group.id) ? "▼" : "▶"}
                  </span>
                  <strong style={{ color: "#e2e8f0", fontSize: "1.1rem" }}>
                    {group.name}
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginLeft: "10px",
                    }}
                  >
                    ({group.selection_type}
                    {group.is_required ? ", required" : ""}
                    {group.selection_type === "multiple"
                      ? `, ${group.min_selections}-${group.max_selections}`
                      : ""}
                    )
                  </span>
                  <span className={`status-badge ${group.status}`}>
                    {group.status}
                  </span>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => openEditGroupModal(group)}
                  >
                    ✏️ Edit Group
                  </button>
                </div>
              </div>

              {/* Options (Expandable) */}
              {expandedGroups.has(group.id) && (
                <div style={{ padding: "20px", background: "#1e293b" }}>
                  {group.options && group.options.length > 0 ? (
                    <div style={{ marginBottom: "15px" }}>
                      {group.options.map((option) => (
                        <div
                          key={option.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 15px",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            marginBottom: "10px",
                            background:
                              option.status === "inactive"
                                ? "#0f172a"
                                : "#0f172a",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = "#6366f1";
                            e.currentTarget.style.background = "#1e293b";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = "#334155";
                            e.currentTarget.style.background = "#0f172a";
                          }}
                        >
                          <div>
                            <strong style={{ color: "#e2e8f0" }}>
                              {option.name}
                            </strong>
                            <span
                              style={{
                                marginLeft: "10px",
                                color: "#94a3b8",
                                fontWeight: "500",
                              }}
                            >
                              ({Number(option.price_adjustment) >= 0 ? "+" : ""}
                              {Number(
                                option.price_adjustment
                              ).toLocaleString()}{" "}
                              VND)
                            </span>
                            {option.status === "inactive" && (
                              <span
                                style={{
                                  marginLeft: "10px",
                                  color: "#64748b",
                                  fontSize: "12px",
                                  fontStyle: "italic",
                                }}
                              >
                                (Inactive)
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => openEditOptionModal(group, option)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteOption(option)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        color: "#64748b",
                        marginBottom: "15px",
                        fontStyle: "italic",
                      }}
                    >
                      No options yet
                    </p>
                  )}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openAddOptionModal(group)}
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Group Modal */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditMode ? "Edit" : "Create"} Modifier Group</h2>
            <form onSubmit={isEditMode ? handleUpdateGroup : handleCreateGroup}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={groupFormData.name}
                  onChange={(e) =>
                    setGroupFormData({ ...groupFormData, name: e.target.value })
                  }
                  placeholder="e.g., Size, Toppings"
                />
              </div>
              <div className="form-group">
                <label>Selection Type *</label>
                <select
                  value={groupFormData.selection_type}
                  onChange={(e) =>
                    setGroupFormData({
                      ...groupFormData,
                      selection_type: e.target.value as "single" | "multiple",
                    })
                  }
                >
                  <option value="single">Single (Radio)</option>
                  <option value="multiple">Multiple (Checkbox)</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={groupFormData.is_required}
                    onChange={(e) =>
                      setGroupFormData({
                        ...groupFormData,
                        is_required: e.target.checked,
                      })
                    }
                  />{" "}
                  Required
                </label>
              </div>
              {groupFormData.selection_type === "multiple" && (
                <>
                  <div className="form-group">
                    <label>Min Selections</label>
                    <input
                      type="number"
                      min="0"
                      value={groupFormData.min_selections}
                      onChange={(e) =>
                        setGroupFormData({
                          ...groupFormData,
                          min_selections: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Selections</label>
                    <input
                      type="number"
                      min="0"
                      value={groupFormData.max_selections}
                      onChange={(e) =>
                        setGroupFormData({
                          ...groupFormData,
                          max_selections: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={groupFormData.display_order}
                  onChange={(e) =>
                    setGroupFormData({
                      ...groupFormData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Inline Options */}
              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "20px",
                  borderTop: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#e2e8f0",
                    }}
                  >
                    Options{" "}
                    {groupFormData.initialOptions &&
                      groupFormData.initialOptions.length > 0 &&
                      `(${groupFormData.initialOptions.length})`}
                  </label>
                </div>

                {groupFormData.initialOptions &&
                groupFormData.initialOptions.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    {groupFormData.initialOptions.map((option, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "15px",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          background: "#1e293b",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "#6366f1";
                          e.currentTarget.style.boxShadow =
                            "0 4px 8px rgba(99,102,241,0.2)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = "#334155";
                          e.currentTarget.style.boxShadow =
                            "0 2px 4px rgba(0,0,0,0.2)";
                        }}
                      >
                        {/* Option Header with number */}
                        <div
                          style={{
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              background: "#6366f1",
                              color: "white",
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {index + 1}
                          </span>
                          <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                            {option.name || "(empty)"}
                          </span>
                        </div>

                        {/* Input Grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr auto",
                            gap: "12px",
                            alignItems: "flex-end",
                          }}
                        >
                          {/* Name Input */}
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "12px",
                                color: "#94a3b8",
                                marginBottom: "6px",
                                fontWeight: "500",
                              }}
                            >
                              Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Small, Medium, Large"
                              value={option.name}
                              onChange={(e) =>
                                updateInlineOption(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: "6px",
                                border: "1px solid #334155",
                                background: "#0f172a",
                                color: "#e2e8f0",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                transition: "all 0.2s ease",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#6366f1";
                                e.currentTarget.style.boxShadow =
                                  "0 0 0 2px rgba(99,102,241,0.1)";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#334155";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            />
                          </div>

                          {/* Price Input */}
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "12px",
                                color: "#94a3b8",
                                marginBottom: "6px",
                                fontWeight: "500",
                              }}
                            >
                              Price
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={option.price_adjustment}
                              onChange={(e) =>
                                updateInlineOption(
                                  index,
                                  "price_adjustment",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              step="1000"
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: "6px",
                                border: "1px solid #334155",
                                background: "#0f172a",
                                color: "#e2e8f0",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                transition: "all 0.2s ease",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#6366f1";
                                e.currentTarget.style.boxShadow =
                                  "0 0 0 2px rgba(99,102,241,0.1)";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#334155";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            />
                          </div>

                          {/* Status Select */}
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "12px",
                                color: "#94a3b8",
                                marginBottom: "6px",
                                fontWeight: "500",
                              }}
                            >
                              Status
                            </label>
                            <select
                              value={option.status || "active"}
                              onChange={(e) =>
                                updateInlineOption(
                                  index,
                                  "status",
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: "6px",
                                border: "1px solid #334155",
                                background: "#0f172a",
                                color: "#e2e8f0",
                                fontSize: "14px",
                                cursor: "pointer",
                                boxSizing: "border-box",
                                transition: "all 0.2s ease",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#6366f1";
                                e.currentTarget.style.boxShadow =
                                  "0 0 0 2px rgba(99,102,241,0.1)";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#334155";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeInlineOption(index)}
                            style={{
                              padding: "10px 14px",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                            }}
                            title="Delete option"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Price display */}
                        {option.price_adjustment !== 0 && (
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "12px",
                              color: "#94a3b8",
                            }}
                          >
                            Price adjustment:{" "}
                            <span
                              style={{
                                color:
                                  option.price_adjustment > 0
                                    ? "#10b981"
                                    : "#ef4444",
                                fontWeight: "bold",
                              }}
                            >
                              {option.price_adjustment > 0 ? "+" : ""}
                              {Number(
                                option.price_adjustment
                              ).toLocaleString()}{" "}
                              VND
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      background: "#0f172a",
                      borderRadius: "8px",
                      border: "1px dashed #334155",
                      marginBottom: "15px",
                    }}
                  >
                    <p
                      style={{ color: "#64748b", fontSize: "14px", margin: 0 }}
                    >
                      No options yet. Click the button below to add your first
                      option.
                    </p>
                  </div>
                )}

                {/* Add Option Button - Full Width at Bottom */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addInlineOption}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  + Add Option
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGroupModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? "Update" : "Create"} Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Option Modal */}
      {showOptionModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowOptionModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              {selectedOption ? "Edit" : "Add"} Option
              {selectedGroup && ` to "${selectedGroup.name}"`}
            </h2>
            <form
              onSubmit={
                selectedOption ? handleUpdateOption : handleCreateOption
              }
            >
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={optionFormData.name}
                  onChange={(e) =>
                    setOptionFormData({
                      ...optionFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Small, Large"
                />
              </div>
              <div className="form-group">
                <label>Price Adjustment ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={optionFormData.price_adjustment}
                  onChange={(e) =>
                    setOptionFormData({
                      ...optionFormData,
                      price_adjustment: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={optionFormData.status}
                  onChange={(e) =>
                    setOptionFormData({
                      ...optionFormData,
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
                  onClick={() => setShowOptionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedOption ? "Update" : "Add"} Option
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
