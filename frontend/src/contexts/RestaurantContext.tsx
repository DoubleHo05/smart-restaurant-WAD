import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const loadRestaurants = async () => {
    // Only load if user is authenticated
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setRestaurants([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await restaurantsApi.getAll();
      setRestaurants(data);
      
      // Auto-select first restaurant if none selected
      if (data.length > 0 && !selectedRestaurant) {
        setSelectedRestaurant(data[0]);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load restaurants");
      console.error("Error loading restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 [RestaurantContext] Auth state changed:", {
      isAuthenticated,
      userId: user?.id,
    });
    loadRestaurants();

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
  }, [isAuthenticated, user?.id]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
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
