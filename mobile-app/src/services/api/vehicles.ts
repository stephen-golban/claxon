import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./client";
import { queryKeys } from "./query-keys";
import type { NewVehicle, QueryVehicle, UpdateVehicle, Vehicle } from "./types";

// ============================================================================
// API PROCS
// ============================================================================

export const vehiclesApi = {
	list: (client: ReturnType<typeof useApiClient>, params?: QueryVehicle) =>
		client.get<Vehicle[]>("/vehicles", params),
	get: (client: ReturnType<typeof useApiClient>, id: string) =>
		client.get<Vehicle>(`/vehicles/${id}`),
	search: (client: ReturnType<typeof useApiClient>, plateNumber: string) =>
		client.get<Vehicle>(`/vehicles/search/${plateNumber}`),
	create: (client: ReturnType<typeof useApiClient>, data: NewVehicle) =>
		client.post<Vehicle>("/vehicles", data),
	update: (
		client: ReturnType<typeof useApiClient>,
		id: string,
		data: UpdateVehicle,
	) => client.patch<Vehicle>(`/vehicles/${id}`, data),
	delete: (client: ReturnType<typeof useApiClient>, id: string) =>
		client.delete<void>(`/vehicles/${id}`),
};

// ============================================================================
// HOOKS
// ============================================================================

export const useVehicles = (params?: QueryVehicle) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.vehicles.all(params),
		queryFn: () => vehiclesApi.list(apiClient, params),
		enabled: isSignedIn,
	});
};

export const useVehicle = (id: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.vehicles.byId(id),
		queryFn: () => vehiclesApi.get(apiClient, id),
		enabled: isSignedIn && !!id,
	});
};

export const useSearchVehicle = (plateNumber: string) => {
	const { isSignedIn } = useAuth();
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.vehicles.search(plateNumber),
		queryFn: () => vehiclesApi.search(apiClient, plateNumber),
		enabled: isSignedIn && !!plateNumber && plateNumber.length > 2,
	});
};

export const useCreateVehicle = () => {
	const queryClient = useQueryClient();
	const apiClient = useApiClient();

	return useMutation({
		mutationFn: (data: NewVehicle) => vehiclesApi.create(apiClient, data),
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
			vehiclesApi.update(apiClient, id, data),
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
		mutationFn: (id: string) => vehiclesApi.delete(apiClient, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
		},
	});
};
