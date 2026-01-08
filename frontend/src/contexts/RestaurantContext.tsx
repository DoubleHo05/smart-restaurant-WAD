import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { restaurantsApi } from "../api/restaurantsApi";
import type { Restaurant } from "../types/restaurant.types";

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
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

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantsApi.getAll();
      setRestaurants(data);

      // Auto-select first restaurant if none selected
      if (!selectedRestaurant && data.length > 0) {
        const savedId = localStorage.getItem("selectedRestaurantId");
        const restaurant = data.find((r) => r.id === savedId) || data[0];
        setSelectedRestaurant(restaurant);
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
    loadRestaurants();
  }, []);

  // Save selected restaurant to localStorage
  useEffect(() => {
    if (selectedRestaurant) {
      localStorage.setItem("selectedRestaurantId", selectedRestaurant.id);
    }
  }, [selectedRestaurant]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        selectedRestaurant,
        loading,
        error,
        setSelectedRestaurant,
        refreshRestaurants: loadRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within RestaurantProvider");
  }
  return context;
}
