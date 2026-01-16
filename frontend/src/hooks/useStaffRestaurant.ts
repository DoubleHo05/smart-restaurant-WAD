import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { restaurantStaffApi } from "../api/restaurantStaffApi";

/**
 * Hook to get restaurant_id for staff members (kitchen/waiter)
 * Returns the restaurant where the current user works
 */
export function useStaffRestaurant() {
  const { user } = useAuth();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaffRestaurant = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Only for kitchen and waiter roles
      const isStaff =
        user.roles?.includes("kitchen") || user.roles?.includes("waiter");
      if (!isStaff) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(
          "🔍 [useStaffRestaurant] Loading restaurant for user:",
          user.id
        );

        const staffRecord = await restaurantStaffApi.getMyRestaurant();
        console.log("✅ [useStaffRestaurant] Staff record:", staffRecord);

        if (staffRecord) {
          setRestaurantId(staffRecord.restaurant_id);
          setRestaurantName(staffRecord.restaurant?.name || null);
          console.log("✅ [useStaffRestaurant] Restaurant found:", {
            id: staffRecord.restaurant_id,
            name: staffRecord.restaurant?.name,
          });
        } else {
          console.warn(
            "⚠️ [useStaffRestaurant] No restaurant assignment found for staff"
          );
          setError("No restaurant assigned. Please contact your admin.");
        }
      } catch (err: any) {
        console.error("❌ [useStaffRestaurant] Error loading restaurant:", err);
        setError(
          err.response?.data?.message || "Failed to load restaurant assignment"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStaffRestaurant();
  }, [user?.id]);

  return { restaurantId, restaurantName, loading, error };
}
