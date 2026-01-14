import api from './axiosConfig';

export interface CartItemModifier {
  modifier_option_id: string;
}

export interface AddToCartDto {
  menu_item_id: string;
  quantity: number;
  special_requests?: string;
  modifiers?: CartItemModifier[];
}

export interface UpdateCartItemDto {
  quantity?: number;
  special_requests?: string;
  modifiers?: CartItemModifier[];
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  description?: string;
  price: string | number;
  quantity: number;
  special_requests?: string;
  modifiers: Array<{
    id: string;
    modifier_option_id: string;
    name: string;
    price_adjustment: string | number;
  }>;
  item_total: number;
}

export interface Cart {
  cart_id: string;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  tax: number;
  total: number;
}

const SESSION_ID_KEY = 'cart_session_id';
const SESSION_EXPIRY_HOURS = 3; // Session expires after 3 hours

// Generate or retrieve session ID for guest users
// Session ID is scoped per restaurant + table to prevent cross-restaurant cart pollution
export const getSessionId = (): string => {
  // Get current table and restaurant info
  const tableInfo = localStorage.getItem('table_info');
  const restaurantInfo = localStorage.getItem('restaurant_info');

  if (!tableInfo || !restaurantInfo) {
    // Fallback for users who haven't scanned QR yet
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }

  try {
    const table = JSON.parse(tableInfo);
    const restaurant = JSON.parse(restaurantInfo);

    // Create session key unique to this restaurant + table combination
    const sessionKey = `cart_session_${restaurant.id}_${table.id}`;
    const sessionData = localStorage.getItem(sessionKey);

    console.log('🔍 Session Debug:', {
      restaurantId: restaurant.id,
      tableId: table.id,
      sessionKey,
      hasExistingSession: !!sessionData
    });

    if (sessionData) {
      try {
        const { sessionId, expiresAt } = JSON.parse(sessionData);

        // Check if session is still valid
        if (Date.now() < expiresAt) {
          console.log('✅ Reusing existing session:', sessionId);
          return sessionId;
        }

        // Session expired - remove it
        console.log('⏰ Session expired, creating new one');
        localStorage.removeItem(sessionKey);
      } catch (e) {
        // Invalid format - remove and create new
        console.log('⚠️ Invalid session format, creating new one');
        localStorage.removeItem(sessionKey);
      }
    }

    // Create new session for this restaurant + table
    // Format: restaurantId-tableId-timestamp-random
    const newSessionId = `${restaurant.id}-${table.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const expiresAt = Date.now() + (SESSION_EXPIRY_HOURS * 60 * 60 * 1000); // 3 hours

    console.log('🆕 Created new session:', newSessionId);

    localStorage.setItem(sessionKey, JSON.stringify({
      sessionId: newSessionId,
      expiresAt
    }));

    return newSessionId;
  } catch (error) {
    // Fallback if parsing fails
    console.error('Error parsing table/restaurant info:', error);
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }
};

export const cartApi = {
  // Add item to cart
  addToCart: async (data: AddToCartDto): Promise<CartItem> => {
    const sessionId = getSessionId();
    const response = await api.post('/api/cart/items', data, {
      headers: {
        'x-session-id': sessionId,
      },
    });
    return response.data;
  },

  // Get cart
  getCart: async (): Promise<Cart> => {
    const sessionId = getSessionId();
    const response = await api.get('/api/cart', {
      headers: {
        'x-session-id': sessionId,
      },
    });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (
    cartItemId: string,
    data: UpdateCartItemDto
  ): Promise<CartItem> => {
    const sessionId = getSessionId();
    const response = await api.patch(`/api/cart/items/${cartItemId}`, data, {
      headers: {
        'x-session-id': sessionId,
      },
    });
    return response.data;
  },

  // Remove cart item
  removeCartItem: async (cartItemId: string): Promise<void> => {
    const sessionId = getSessionId();
    await api.delete(`/api/cart/items/${cartItemId}`, {
      headers: {
        'x-session-id': sessionId,
      },
    });
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    const sessionId = getSessionId();
    await api.delete('/api/cart', {
      headers: {
        'x-session-id': sessionId,
      },
    });
  },
};

export default cartApi;
