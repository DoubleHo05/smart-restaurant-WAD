import { useRestaurant } from "../contexts/RestaurantContext";
import type { Restaurant } from "../types/restaurant.types";

interface RestaurantSelectorProps {
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant?: (restaurant: Restaurant | null) => void;
}

export default function RestaurantSelector({
  selectedRestaurant: propSelectedRestaurant,
  onSelectRestaurant: propOnSelectRestaurant,
}: RestaurantSelectorProps = {}) {
  const { restaurants, loading, selectedRestaurant: contextSelectedRestaurant, setSelectedRestaurant } = useRestaurant();

  // Use props if provided (for backward compatibility), otherwise use context
  const selectedRestaurant = propSelectedRestaurant !== undefined ? propSelectedRestaurant : contextSelectedRestaurant;
  const handleSelect = propOnSelectRestaurant || setSelectedRestaurant;

  if (loading) {
    return (
      <div style={{ padding: "10px", color: "#94a3b8" }}>
        Loading restaurants...
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div style={{ padding: "10px", color: "#ef4444" }}>
        No restaurants found. Please create one first.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#cbd5e1",
          fontSize: "14px",
        }}
      >
        🏪 Select Restaurant
      </label>
      <select
        value={selectedRestaurant?.id || ""}
        onChange={(e) => {
          const restaurant = restaurants.find((r) => r.id === e.target.value);
          handleSelect(restaurant || null);
        }}
        style={{
          width: "100%",
          padding: "12px 15px",
          fontSize: "14px",
          border: "1px solid #334155",
          borderRadius: "8px",
          background: "#0f172a",
          color: "#f1f5f9",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <option value="">-- Select Restaurant --</option>
        {restaurants.map((restaurant) => (
          <option key={restaurant.id} value={restaurant.id}>
            {restaurant.name}
            {restaurant._count &&
              ` (${restaurant._count.tables} tables, ${restaurant._count.menu_categories} categories)`}
          </option>
        ))}
      </select>
    </div>
  );
}
