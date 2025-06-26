import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type ClaxonPaginationParams,
	type ClaxonTemplateParams,
	type NewClaxon,
	type NewUser,
	type NewVehicle,
	type QueryVehicle,
	queryKeys,
	type UpdateClaxon,
	type UpdateUser,
	type UpdateVehicle,
	useApiClient,
} from "@/lib/api";

// ============================================================================
// USER HOOKS
// ============================================================================

export const useCurrentUser = () => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.users.current,
		queryFn: () => apiClient.users.current(),
		enabled: isSignedIn,
	});
};

export const useUserMe = () => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.users.me,
		queryFn: () => apiClient.users.me(),
		enabled: isSignedIn,
	});
};

export const useUserByClerkId = (clerkId: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.users.byClerkId(clerkId),
		queryFn: () => apiClient.users.byClerkId(clerkId),
		enabled: isSignedIn && !!clerkId,
	});
};

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (data: NewUser) => apiClient.users.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.current });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
		},
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (data: UpdateUser) => apiClient.users.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.current });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: () => apiClient.users.delete(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.current });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
		},
	});
};

// ============================================================================
// VEHICLE HOOKS
// ============================================================================

export const useVehicles = (params?: QueryVehicle) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.vehicles.all(params),
		queryFn: () => apiClient.vehicles.list(params),
		enabled: isSignedIn,
	});
};

export const useVehicle = (id: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.vehicles.byId(id),
		queryFn: () => apiClient.vehicles.get(id),
		enabled: isSignedIn && !!id,
	});
};

export const useSearchVehicle = (plateNumber: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.vehicles.search(plateNumber),
		queryFn: () => apiClient.vehicles.search(plateNumber),
		enabled: isSignedIn && !!plateNumber && plateNumber.length > 2,
	});
};

export const useCreateVehicle = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (data: NewVehicle) => apiClient.vehicles.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
		},
	});
};

export const useUpdateVehicle = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateVehicle }) =>
			apiClient.vehicles.update(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
			queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.byId(id) });
		},
	});
};

export const useDeleteVehicle = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (id: string) => apiClient.vehicles.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
		},
	});
};

// ============================================================================
// CLAXON TEMPLATE HOOKS
// ============================================================================

export const useClaxonTemplates = (params?: ClaxonTemplateParams) => {
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxonTemplates.all(params),
		queryFn: () => apiClient.claxonTemplates.list(params),
	});
};

export const useClaxonTemplate = (id: string, language?: string) => {
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxonTemplates.byId(id, language),
		queryFn: () => apiClient.claxonTemplates.get(id, language),
		enabled: !!id,
	});
};

export const useClaxonTemplatesByCategory = (
	category: string,
	language?: string,
) => {
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxonTemplates.byCategory(category, language),
		queryFn: () => apiClient.claxonTemplates.getByCategory(category, language),
		enabled: !!category,
	});
};

// ============================================================================
// CLAXON HOOKS
// ============================================================================

export const useInboxClaxons = (params?: ClaxonPaginationParams) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.inbox(params),
		queryFn: () => apiClient.claxons.inbox(params),
		enabled: isSignedIn,
	});
};

export const useSentClaxons = (params?: ClaxonPaginationParams) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.sent(params),
		queryFn: () => apiClient.claxons.sent(params),
		enabled: isSignedIn,
	});
};

export const useClaxon = (id: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.byId(id),
		queryFn: () => apiClient.claxons.get(id),
		enabled: isSignedIn && !!id,
	});
};

export const useUnreadClaxonCount = () => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxons.unreadCount,
		queryFn: () => apiClient.claxons.unreadCount(),
		enabled: isSignedIn,
		refetchInterval: 30000, // Refetch every 30 seconds
	});
};

export const useSendClaxon = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (data: NewClaxon) => apiClient.claxons.send(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["claxons"] });
		},
	});
};

export const useMarkClaxonAsRead = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (id: string) => apiClient.claxons.markAsRead(id),
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
			apiClient.claxons.update(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["claxons"] });
			queryClient.invalidateQueries({ queryKey: queryKeys.claxons.byId(id) });
		},
	});
};

// ============================================================================
// HEALTH HOOK
// ============================================================================

export const useHealth = () => {
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.health,
		queryFn: () => apiClient.health(),
		staleTime: 30000, // 30 seconds
	});
};

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

// Re-export query keys for convenience
export { queryKeys };

// Re-export types for convenience
export type {
	ClaxonPaginationParams,
	ClaxonTemplateParams,
	NewClaxon,
	NewUser,
	NewVehicle,
	QueryVehicle,
	UpdateClaxon,
	UpdateUser,
	UpdateVehicle,
} from "@/lib/api";
