import { useAuth } from "@clerk/clerk-expo";
import type { Claxon, ClaxonTemplate, User, Vehicle } from "../db/schema";

// Use backend API or fallback to local Expo API routes  
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "/api";

// Extended types for API responses with relations
export type ClaxonWithRelations = Claxon & {
  sender?: Partial<User>;
  recipient?: Partial<User>;
  vehicle?: Vehicle;
  template?: ClaxonTemplate;
};

export type VehicleWithUser = Vehicle & {
  user: Partial<User>;
};

// API client class
class ApiClient {
  private getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { getToken } = useAuth();
    const token = await getToken();

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // User endpoints
  users = {
    current: (): Promise<User> => this.request("/users/current"),

    create: (data: Omit<User, "id" | "clerkId" | "createdAt" | "updatedAt">): Promise<User> =>
      this.request("/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (
      data: Partial<
        Pick<
          User,
          "dob" | "gender" | "language" | "avatarUrl" | "privacySettings" | "isPhonePublic" | "notificationPreferences"
        >
      >,
    ): Promise<User> =>
      this.request("/users", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (): Promise<void> => this.request("/users", { method: "DELETE" }),

    getByClerkId: (clerkId: string): Promise<User> => this.request(`/users/by-clerk-id/${clerkId}`),
  };

  // Vehicle endpoints
  vehicles = {
    list: (): Promise<Vehicle[]> => this.request("/vehicles"),

    get: (id: string): Promise<Vehicle> => this.request(`/vehicles/${id}`),

    create: (data: Omit<Vehicle, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Vehicle> =>
      this.request("/vehicles", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Omit<Vehicle, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Vehicle> =>
      this.request(`/vehicles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> => this.request(`/vehicles/${id}`, { method: "DELETE" }),

    search: (plateNumber: string): Promise<VehicleWithUser> => this.request(`/vehicles/search/${plateNumber}`),
  };

  // Claxon template endpoints
  claxonTemplates = {
    list: (params?: { category?: string; language?: string }): Promise<ClaxonTemplate[]> => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append("category", params.category);
      if (params?.language) searchParams.append("language", params.language);

      return this.request(`/claxon-templates?${searchParams.toString()}`);
    },

    get: (id: string, language?: string): Promise<ClaxonTemplate> => {
      const searchParams = language ? `?language=${language}` : "";
      return this.request(`/claxon-templates/${id}${searchParams}`);
    },

    getByCategory: (category: string, language?: string): Promise<ClaxonTemplate[]> => {
      const searchParams = language ? `?language=${language}` : "";
      return this.request(`/claxon-templates/category/${category}${searchParams}`);
    },
  };

  // Claxon endpoints
  claxons = {
    inbox: (params?: { read?: boolean; limit?: number; offset?: number }): Promise<ClaxonWithRelations[]> => {
      const searchParams = new URLSearchParams();
      if (params?.read !== undefined) searchParams.append("read", params.read.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.offset) searchParams.append("offset", params.offset.toString());

      return this.request(`/claxons/inbox?${searchParams.toString()}`);
    },

    sent: (params?: { limit?: number; offset?: number }): Promise<ClaxonWithRelations[]> => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.offset) searchParams.append("offset", params.offset.toString());

      return this.request(`/claxons/sent?${searchParams.toString()}`);
    },

    get: (id: string): Promise<ClaxonWithRelations> => this.request(`/claxons/${id}`),

    send: (
      data: Omit<Claxon, "id" | "senderId" | "read" | "readAt" | "createdAt" | "updatedAt">,
    ): Promise<ClaxonWithRelations> =>
      this.request("/claxons", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    markAsRead: (id: string): Promise<ClaxonWithRelations> =>
      this.request(`/claxons/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
      }),

    unreadCount: (): Promise<{ count: number }> => this.request("/claxons/inbox/unread-count"),
  };
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Hook for using the API client with proper auth context
export const useApiClient = () => {
  const auth = useAuth();

  if (!auth.isSignedIn) {
    throw new Error("User must be signed in to use API client");
  }

  return apiClient;
};
