import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5757";

// Types
export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "vegetarian" | "non-vegetarian";
  isVeg: boolean;
  toppings: string[];
  spiceLevel: "mild" | "medium" | "hot";
}

export interface PizzaFilters {
  category?: "vegetarian" | "non-vegetarian";
  isVeg?: boolean;
  spiceLevel?: "mild" | "medium" | "hot";
  maxPrice?: number;
  search?: string;
}

export interface PizzasResponse {
  count: number;
  pizzas: Pizza[];
  filters: {
    availableCategories: string[];
    availableSpiceLevels: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export interface OrderItem {
  pizzaId: number;
  quantity: number;
  price: number;
  pizza?: Pizza;
}

export interface Order {
  id: number;
  userId: number;
  pizzaItems: OrderItem[];
  status: "pending" | "preparing" | "in-delivery" | "delivered" | "cancelled";
  createdAt: string;
  totalAmount: number;
  deliveryAddress: string;
  phone: string;
  paymentMethod: "card" | "cash";
  updatedAt?: string;
}

export interface CreateOrderPayload {
  userId: number;
  pizzaItems: Array<{
    pizzaId: number;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending";
  deliveryAddress: string;
  phone: string;
  paymentMethod: "card" | "cash";
}

export interface OrdersResponse {
  message: string;
  count: number;
  orders: Order[];
}

// API instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log the full URL being requested
  console.log("Making request to:", config.baseURL + config.url);
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post("/api/auth/login", { email, password }).then((res) => res.data),
  register: (email: string, password: string): Promise<AuthResponse> =>
    api.post("/api/auth/register", { email, password }).then((res) => res.data),
};

// Pizza API calls
export const pizzaAPI = {
  getAll: (filters?: PizzaFilters): Promise<PizzasResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get("/api/pizzas", { params }).then((res) => res.data);
  },
  create: (pizza: Omit<Pizza, "id">): Promise<Pizza> =>
    api.post("/api/pizzas", pizza).then((res) => res.data),
  update: (id: number, pizza: Partial<Pizza>): Promise<Pizza> =>
    api.put(`/api/pizzas/${id}`, pizza).then((res) => res.data),
  delete: (id: number): Promise<void> =>
    api.delete(`/api/pizzas/${id}`).then((res) => res.data),
};

// Order API calls
export const orderAPI = {
  create: (order: CreateOrderPayload): Promise<Order> =>
    api.post("/api/orders", order).then((res) => res.data),
  getUserOrders: (userId: number): Promise<OrdersResponse> =>
    api.get(`/api/orders/${userId}`).then((res) => res.data),
  getAllOrders: (): Promise<OrdersResponse> =>
    api.get("/api/orders").then((res) => res.data),
  updateStatus: (id: number, status: Order["status"]): Promise<Order> =>
    api.patch(`/api/orders/${id}`, { status }).then((res) => res.data),
};
