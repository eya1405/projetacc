// API configuration
export const API_URL = "https://your-api-gateway-url.com/api"

// API endpoints
export const ENDPOINTS = {
  // Auth Service
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/me",
  },
  // Product Catalog Service
  PRODUCTS: {
    ALL: "/products",
    CATEGORIES: "/products/categories",
    BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
    DETAIL: (productId: string) => `/products/${productId}`,
    SEARCH: "/products/search",
  },
  // Order Service
  ORDERS: {
    CREATE: "/orders",
    USER_ORDERS: "/orders/user",
    DETAIL: (orderId: string) => `/orders/${orderId}`,
  },
}

// Helper function to get auth header
export const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

// Import AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage"
