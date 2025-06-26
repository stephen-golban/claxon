/** biome-ignore-all lint/suspicious/noExplicitAny: we need to use any to match the backend types */

import { useAuth } from "@clerk/clerk-expo";
import type {
	Claxon,
	ClaxonTemplate,
	NewClaxon,
	NewClaxonTemplate,
	NewUser,
	NewVehicle,
	QueryClaxon,
	QueryClaxonTemplate,
	QueryUser,
	QueryVehicle,
	UpdateClaxon,
	UpdateClaxonTemplate,
	UpdateUser,
	UpdateVehicle,
	User,
	Vehicle,
} from "@/typings/api";

// ============================================================================
// TYPES
// ============================================================================

// API Response Types (matching backend/src/utils/responses.ts)
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
	pagination?: {
		total: number;
		limit: number;
		offset: number;
	};
}

// Additional API-specific types
export interface ClaxonPaginationParams {
	limit?: number;
	offset?: number;
	read?: string;
	type?: string;
	senderLanguage?: string;
}

export interface ClaxonTemplateParams {
	category?: string;
	language?: string;
}

// Re-export types from api.d.ts for convenience
export type {
	User,
	NewUser,
	UpdateUser,
	QueryUser,
	Vehicle,
	NewVehicle,
	UpdateVehicle,
	QueryVehicle,
	Claxon,
	NewClaxon,
	UpdateClaxon,
	QueryClaxon,
	ClaxonTemplate,
	NewClaxonTemplate,
	UpdateClaxonTemplate,
	QueryClaxonTemplate,
};

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

// ============================================================================
// HTTP CLIENT
// ============================================================================

class ApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public response?: ApiResponse,
	) {
		super(message);
		this.name = "ApiError";
	}
}

class HttpClient {
	private baseURL: string;
	private getAuthToken: () => Promise<string | null>;

	constructor(baseURL: string, getAuthToken: () => Promise<string | null>) {
		this.baseURL = baseURL;
		this.getAuthToken = getAuthToken;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<ApiResponse<T>> {
		const url = `${this.baseURL}${endpoint}`;

		// Get auth token
		const token = await this.getAuthToken();

		// Prepare headers
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(options.headers as Record<string, string>),
		};

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, {
				...options,
				headers,
			});

			// Handle 204 No Content
			if (response.status === 204) {
				return { success: true, data: undefined as T };
			}

			const data: ApiResponse<T> = await response.json();

			if (!response.ok) {
				throw new ApiError(
					data.error || `HTTP ${response.status}`,
					response.status,
					data,
				);
			}

			return data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			// Network or parsing error
			throw new ApiError(
				error instanceof Error ? error.message : "Network error",
				0,
			);
		}
	}

	async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		const searchParams = params
			? `?${new URLSearchParams(params).toString()}`
			: "";
		const response = await this.request<T>(`${endpoint}${searchParams}`);
		return response.data as T;
	}

	async post<T>(endpoint: string, data?: any): Promise<T> {
		const response = await this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
		return response.data as T;
	}

	async patch<T>(endpoint: string, data?: any): Promise<T> {
		const response = await this.request<T>(endpoint, {
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		});
		return response.data as T;
	}

	async delete<T>(endpoint: string): Promise<T> {
		const response = await this.request<T>(endpoint, {
			method: "DELETE",
		});
		return response.data as T;
	}
}

// ============================================================================
// API CLIENT
// ============================================================================

export const createApiClient = (getAuthToken: () => Promise<string | null>) => {
	const httpClient = new HttpClient(API_BASE_URL, getAuthToken);

	return {
		// Users API
		users: {
			me: () =>
				httpClient.get<{ userId: string; sessionId: string }>("/users/me"),
			current: () => httpClient.get<User>("/users/current"),
			byClerkId: (clerkId: string) =>
				httpClient.get<User>(`/users/by-clerk-id/${clerkId}`),
			create: (data: NewUser) => httpClient.post<User>("/users", data),
			update: (data: UpdateUser) => httpClient.patch<User>("/users", data),
			delete: () => httpClient.delete<void>("/users"),
		},

		// Vehicles API
		vehicles: {
			list: (params?: QueryVehicle) =>
				httpClient.get<Vehicle[]>("/vehicles", params),
			get: (id: string) => httpClient.get<Vehicle>(`/vehicles/${id}`),
			search: (plateNumber: string) =>
				httpClient.get<Vehicle>(`/vehicles/search/${plateNumber}`),
			create: (data: NewVehicle) => httpClient.post<Vehicle>("/vehicles", data),
			update: (id: string, data: UpdateVehicle) =>
				httpClient.patch<Vehicle>(`/vehicles/${id}`, data),
			delete: (id: string) => httpClient.delete<void>(`/vehicles/${id}`),
		},

		// Claxons API
		claxons: {
			send: (data: NewClaxon) => httpClient.post<Claxon>("/claxons", data),
			inbox: (params?: ClaxonPaginationParams) =>
				httpClient.get<Claxon[]>("/claxons/inbox", params),
			sent: (params?: ClaxonPaginationParams) =>
				httpClient.get<Claxon[]>("/claxons/sent", params),
			get: (id: string) => httpClient.get<Claxon>(`/claxons/${id}`),
			markAsRead: (id: string) =>
				httpClient.patch<Claxon>(`/claxons/${id}`, { read: true }),
			update: (id: string, data: UpdateClaxon) =>
				httpClient.patch<Claxon>(`/claxons/${id}`, data),
			unreadCount: () =>
				httpClient.get<{ count: number }>("/claxons/inbox/unread-count"),
		},

		// Claxon Templates API
		claxonTemplates: {
			list: (params?: ClaxonTemplateParams) =>
				httpClient.get<ClaxonTemplate[]>("/claxon-templates", params),
			get: (id: string, language?: string) => {
				const params = language ? { language } : undefined;
				return httpClient.get<ClaxonTemplate>(
					`/claxon-templates/${id}`,
					params,
				);
			},
			getByCategory: (category: string, language?: string) => {
				const params = language ? { language } : undefined;
				return httpClient.get<ClaxonTemplate[]>(
					`/claxon-templates/category/${category}`,
					params,
				);
			},
		},

		// Health API
		health: () =>
			httpClient.get<{ status: string; timestamp: string }>("/health"),
	};
};

// ============================================================================
// HOOK FOR API CLIENT
// ============================================================================

export const useApiClient = () => {
	const { getToken } = useAuth();

	const getAuthToken = async () => {
		try {
			return await getToken();
		} catch (error) {
			console.error("Failed to get auth token:", error);
			return null;
		}
	};

	return createApiClient(getAuthToken);
};

// Export the API client instance for use outside of React components
let _apiClientInstance: ReturnType<typeof createApiClient> | null = null;

export const getApiClient = () => {
	if (!_apiClientInstance) {
		// For non-React contexts, we'll need to handle auth differently
		// This is a fallback that won't have authentication
		_apiClientInstance = createApiClient(async () => null);
	}
	return _apiClientInstance;
};

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queryKeys = {
	users: {
		me: ["users", "me"] as const,
		current: ["users", "current"] as const,
		byClerkId: (clerkId: string) => ["users", "by-clerk-id", clerkId] as const,
	},
	vehicles: {
		all: (params?: QueryVehicle) => ["vehicles", params] as const,
		byId: (id: string) => ["vehicles", id] as const,
		search: (plateNumber: string) =>
			["vehicles", "search", plateNumber] as const,
	},
	claxonTemplates: {
		all: (params?: ClaxonTemplateParams) =>
			["claxon-templates", params] as const,
		byId: (id: string, language?: string) =>
			["claxon-templates", id, language] as const,
		byCategory: (category: string, language?: string) =>
			["claxon-templates", "category", category, language] as const,
	},
	claxons: {
		inbox: (params?: ClaxonPaginationParams) =>
			["claxons", "inbox", params] as const,
		sent: (params?: ClaxonPaginationParams) =>
			["claxons", "sent", params] as const,
		byId: (id: string) => ["claxons", id] as const,
		unreadCount: ["claxons", "unread-count"] as const,
	},
	health: ["health"] as const,
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export { ApiError };
export type {
	ClaxonPaginationParams as PaginationParams,
	QueryVehicle as VehicleQueryParams,
};
