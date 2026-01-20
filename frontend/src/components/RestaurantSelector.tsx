import { useRestaurant } from "../contexts/RestaurantContext";
import { useAuth } from "../contexts/AuthContext";
import type { Restaurant } from "../types/restaurant.types";

// Building/Restaurant Icon Component
const RestaurantIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

interface RestaurantSelectorProps {
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant?: (restaurant: Restaurant | null) => void;
}

export default function RestaurantSelector({
  selectedRestaurant: propSelectedRestaurant,
  onSelectRestaurant: propOnSelectRestaurant,
}: RestaurantSelectorProps = {}) {
  const {
    restaurants,
    loading,
    selectedRestaurant: contextSelectedRestaurant,
    setSelectedRestaurant,
  } = useRestaurant();
  const { user } = useAuth();

  // Use props if provided (for backward compatibility), otherwise use context
  const selectedRestaurant =
    propSelectedRestaurant !== undefined
      ? propSelectedRestaurant
      : contextSelectedRestaurant;
  const handleSelect = propOnSelectRestaurant || setSelectedRestaurant;

  // Check if user is admin (not superadmin)
  const isAdmin =
    user?.roles?.includes("admin") && !user?.roles?.includes("super_admin");
  const isSuperAdmin = user?.roles?.includes("super_admin");

  console.log("🔍 [RestaurantSelector] State:", {
    loading,
    restaurantCount: restaurants.length,
    selectedRestaurant: selectedRestaurant?.name,
    isAdmin,
    isSuperAdmin,
    userRoles: user?.roles,
  });

  if (loading) {
    return (
      <div
        style={{
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "600",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.15)",
          color: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        Loading restaurants...
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div
        style={{
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "600",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "16px",
          background: "rgba(239, 68, 68, 0.15)",
          color: "white",
          backdropFilter: "blur(10px)",
        }}
      >
        No restaurants found
      </div>
    );
  }

  // Admin: Show restaurant name as read-only
  if (isAdmin) {
    return (
      <div style={{ marginBottom: "0" }}>
        <div
          style={{
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "600",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.25)",
            color: "white",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            whiteSpace: "nowrap",
          }}
        >
          <RestaurantIcon />
          <span>{selectedRestaurant?.name || "Loading..."}</span>
        </div>
      </div>
    );
  }

  // Superadmin: Show dropdown to select restaurant
  return (
    <div style={{ marginBottom: "0", position: "relative" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            zIndex: 1,
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RestaurantIcon />
        </div>
        <select
          value={selectedRestaurant?.id || ""}
          onChange={(e) => {
            const restaurant = restaurants.find((r) => r.id === e.target.value);
            handleSelect(restaurant || null);
          }}
          style={{
            minWidth: "200px",
            padding: "12px 20px 12px 45px",
            fontSize: "14px",
            fontWeight: "600",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.25)",
            color: "white",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundImage:
              "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "20px",
            paddingRight: "40px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
        >
          <option value="" style={{ background: "#1e293b", color: "white" }}>
            -- Select Restaurant --
          </option>
          {restaurants.map((restaurant) => (
            <option
              key={restaurant.id}
              value={restaurant.id}
              style={{ background: "#1e293b", color: "white" }}
            >
              {restaurant.name}
              {restaurant._count &&
                ` (${restaurant._count.tables} tables, ${restaurant._count.menu_categories} categories)`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
