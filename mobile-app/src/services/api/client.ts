/** biome-ignore-all lint/suspicious/noExplicitAny: we need to use any for generic fetcher */

import { useAuth } from "@clerk/clerk-expo";
import type { ApiResponse } from "./types";

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

// ============================================================================
// HTTP CLIENT
// ============================================================================

export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public response?: ApiResponse,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export class HttpClient {
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
		const token = await this.getAuthToken();

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(options.headers as Record<string, string>),
		};

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, { ...options, headers });

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
// API CLIENT HOOK
// ============================================================================

let _apiClientInstance: HttpClient | null = null;

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

	if (!_apiClientInstance) {
		_apiClientInstance = new HttpClient(API_BASE_URL, getAuthToken);
	}

	// In a React hook context, we can re-create it to ensure it has the latest `getToken` function.
	// For this app's lifecycle, a singleton is likely fine, but this is safer.
	return new HttpClient(API_BASE_URL, getAuthToken);
};

export const getApiClient = () => {
	if (!_apiClientInstance) {
		_apiClientInstance = new HttpClient(API_BASE_URL, async () => null);
	}
	return _apiClientInstance;
};
