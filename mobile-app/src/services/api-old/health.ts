import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import { queryKeys } from "./query-keys";

// ============================================================================
// API PROCS
// ============================================================================

export const healthApi = {
	check: (client: ReturnType<typeof useApiClient>) =>
		client.get<{ status: string; timestamp: string }>("/health"),
};

// ============================================================================
// HOOKS
// ============================================================================

export const useHealth = () => {
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.health,
		queryFn: () => healthApi.check(apiClient),
		staleTime: 30000, // 30 seconds
	});
};
