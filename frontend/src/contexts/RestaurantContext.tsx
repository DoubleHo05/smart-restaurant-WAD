import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { restaurantsApi } from "../api/restaurantsApi";
import { useAuth } from "./AuthContext";
import type { Restaurant } from "../types/restaurant.types";

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  loading: boolean;
  error: string | null;
  refreshRestaurants: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const loadRestaurants = useCallback(async () => {
    // Only load if user is authenticated
    const token = localStorage.getItem("auth_token");
    if (!token || !user) {
      console.log(
        "🔍 [RestaurantContext] No token or user found, clearing restaurants"
      );
      setRestaurants([]);
      setSelectedRestaurant(null);
      setLoading(false);
      return;
    }

    // DEBUG: Log user object to see if restaurants exists
    console.log("🔍 [RestaurantContext] DEBUG - Full user object:", JSON.stringify(user, null, 2));
    console.log("🔍 [RestaurantContext] DEBUG - user.restaurants:", user.restaurants);
    console.log("🔍 [RestaurantContext] DEBUG - Has restaurants?", user?.restaurants && user.restaurants.length > 0);

    // For waiter/kitchen staff - use restaurants from user object (from restaurant_staff table)
    if (user?.restaurants && user.restaurants.length > 0) {
      console.log("✅ [RestaurantContext] Using restaurants from user.restaurants:", user.restaurants);
      setRestaurants(user.restaurants as any);
      setLoading(false);
      
      // Auto-select first restaurant for staff
      if (!selectedRestaurant) {
        setSelectedRestaurant(user.restaurants[0] as any);
        console.log("✅ [RestaurantContext] Auto-selected restaurant for staff:", user.restaurants[0]);
      }
      return;
    }

    // Skip loading for customer/guest users (they don't need restaurant list)
    // We use the user object from context, which is more reliable than localStorage for current state.
    if (user?.roles?.includes('customer') || user?.roles?.includes('guest')) {
      console.log("🔍 [RestaurantContext] User is customer or guest, skipping restaurant load.");
      setRestaurants([]);
      setSelectedRestaurant(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 [RestaurantContext] Loading restaurants from API...", {
        userId: user?.id,
        roles: user?.roles,
      });

      const data = await restaurantsApi.getAll();
      console.log("✅ [RestaurantContext] Restaurants loaded:", data);

      setRestaurants(data);
      setError(null);

      // Auto-select restaurant for admin (not superadmin)
      const isAdmin =
        user?.roles?.includes("admin") && !user?.roles?.includes("super_admin");
      const isSuperAdmin = user?.roles?.includes("super_admin");

      console.log("🔍 [RestaurantContext] User roles:", {
        isAdmin,
        isSuperAdmin,
        restaurantCount: data.length,
        userRoles: user?.roles,
        userId: user?.id,
      });

      if (isAdmin && data.length > 0) {
        // Admin should only have one restaurant, auto-select it
        const restaurantToSelect = data[0];
        console.log(
          "🔍 [RestaurantContext] Auto-selecting restaurant for admin:",
          restaurantToSelect
        );
        setSelectedRestaurant(restaurantToSelect);
        localStorage.setItem("selectedRestaurantId", restaurantToSelect.id);
        console.log(
          "✅ [RestaurantContext] Restaurant auto-selected successfully"
        );
      } else if (isSuperAdmin) {
        // Superadmin: load from localStorage if exists
        const savedId = localStorage.getItem("selectedRestaurantId");
        const saved = data.find((r) => r.id === savedId);
        console.log(
          "🔍 [RestaurantContext] SuperAdmin - restoring from localStorage:",
          {
            savedId,
            found: !!saved,
          }
        );
        setSelectedRestaurant(saved || null);
      } else {
        console.log("⚠️ [RestaurantContext] No auto-select - user roles:", {
          roles: user?.roles,
          isAdmin,
          isSuperAdmin,
        });
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to load restaurants";
      console.error("❌ [RestaurantContext] Error loading restaurants:", {
        error: err,
        message: errorMsg,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(errorMsg);
      setRestaurants([]);
      setSelectedRestaurant(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("🔄 [RestaurantContext] Auth state changed:", {
      isAuthenticated,
      userId: user?.id,
      userRoles: user?.roles,
    });

    // Only load if we have user roles (needed for auto-select logic)
    if (isAuthenticated && user?.roles) {
      loadRestaurants();
    }

    // Listen for storage changes (when user logs in/out from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token") {
        console.log(
          "🔄 [RestaurantContext] Token changed via storage event:",
          e.newValue ? "Token added" : "Token removed"
        );
        loadRestaurants();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAuthenticated, user?.roles, loadRestaurants]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        selectedRestaurant,
        setSelectedRestaurant: (restaurant: Restaurant | null) => {
          setSelectedRestaurant(restaurant);
          if (restaurant) {
            localStorage.setItem("selectedRestaurantId", restaurant.id);
          } else {
            localStorage.removeItem("selectedRestaurantId");
          }
        },
        loading,
        error,
        refreshRestaurants: loadRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant(): RestaurantContextType {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within RestaurantProvider");
  }
  return context;
}
