import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./client";
import { queryKeys } from "./query-keys";
import type { NewUser, UpdateUser, User } from "./types";

// ============================================================================
// API PROCS
// ============================================================================

export const usersApi = {
	me: (client: ReturnType<typeof useApiClient>) =>
		client.get<{ userId: string; sessionId: string }>("/users/me"),
	current: (client: ReturnType<typeof useApiClient>) =>
		client.get<User>("/users/current"),
	byClerkId: (client: ReturnType<typeof useApiClient>, clerkId: string) =>
		client.get<User>(`/users/by-clerk-id/${clerkId}`),
	create: (client: ReturnType<typeof useApiClient>, data: NewUser) =>
		client.post<User>("/users", data),
	update: (client: ReturnType<typeof useApiClient>, data: UpdateUser) =>
		client.patch<User>("/users", data),
	delete: (client: ReturnType<typeof useApiClient>) =>
		client.delete<void>("/users"),
};

// ============================================================================
// HOOKS
// ============================================================================

export const useCurrentUser = () => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.users.current,
		queryFn: () => usersApi.current(apiClient),
		enabled: isSignedIn,
	});
};

export const useUserMe = () => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.users.me,
		queryFn: () => usersApi.me(apiClient),
		enabled: isSignedIn,
	});
};

export const useUserByClerkId = (clerkId: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.users.byClerkId(clerkId),
		queryFn: () => usersApi.byClerkId(apiClient, clerkId),
		enabled: isSignedIn && !!clerkId,
	});
};

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (data: NewUser) => usersApi.create(apiClient, data),
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
		mutationFn: (data: UpdateUser) => usersApi.update(apiClient, data),
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
		mutationFn: () => usersApi.delete(apiClient),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.current });
			queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
		},
	});
};
