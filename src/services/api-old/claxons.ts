import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./client";
import { queryKeys } from "./query-keys";
import type {
	Claxon,
	ClaxonPaginationParams,
	NewClaxon,
	UpdateClaxon,
} from "./types";

// ============================================================================
// API PROCS
// ============================================================================

export const claxonsApi = {
	send: (client: ReturnType<typeof useApiClient>, data: NewClaxon) =>
		client.post<Claxon>("/claxons", data),
	inbox: (
		client: ReturnType<typeof useApiClient>,
		params?: ClaxonPaginationParams,
	) => client.get<Claxon[]>("/claxons/inbox", params),
	sent: (
		client: ReturnType<typeof useApiClient>,
		params?: ClaxonPaginationParams,
	) => client.get<Claxon[]>("/claxons/sent", params),
	get: (client: ReturnType<typeof useApiClient>, id: string) =>
		client.get<Claxon>(`/claxons/${id}`),
	markAsRead: (client: ReturnType<typeof useApiClient>, id: string) =>
		client.patch<Claxon>(`/claxons/${id}`, { read: true }),
	update: (
		client: ReturnType<typeof useApiClient>,
		id: string,
		data: UpdateClaxon,
	) => client.patch<Claxon>(`/claxons/${id}`, data),
	unreadCount: (client: ReturnType<typeof useApiClient>) =>
		client.get<{ count: number }>("/claxons/inbox/unread-count"),
};

// ============================================================================
// HOOKS
// ============================================================================

export const useInboxClaxons = (params?: ClaxonPaginationParams) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.inbox(params),
		queryFn: () => claxonsApi.inbox(apiClient, params),
		enabled: isSignedIn,
	});
};

export const useSentClaxons = (params?: ClaxonPaginationParams) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.sent(params),
		queryFn: () => claxonsApi.sent(apiClient, params),
		enabled: isSignedIn,
	});
};

export const useClaxon = (id: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.byId(id),
		queryFn: () => claxonsApi.get(apiClient, id),
		enabled: isSignedIn && !!id,
	});
};

export const useUnreadClaxonCount = () => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.unreadCount,
		queryFn: () => claxonsApi.unreadCount(apiClient),
		enabled: isSignedIn,
		refetchInterval: 30000, // Refetch every 30 seconds
	});
};

export const useSendClaxon = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (data: NewClaxon) => claxonsApi.send(apiClient, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["claxons"] });
		},
	});
};

export const useMarkClaxonAsRead = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (id: string) => claxonsApi.markAsRead(apiClient, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["claxons"] });
		},
	});
};

export const useUpdateClaxon = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateClaxon }) =>
			claxonsApi.update(apiClient, id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["claxons"] });
			queryClient.invalidateQueries({ queryKey: queryKeys.claxons.byId(id) });
		},
	});
};
