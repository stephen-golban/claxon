import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import { queryKeys } from "./query-keys";
import type { ClaxonTemplate, ClaxonTemplateParams } from "./types";

// ============================================================================
// API PROCS
// ============================================================================

export const claxonTemplatesApi = {
	list: (
		client: ReturnType<typeof useApiClient>,
		params?: ClaxonTemplateParams,
	) => client.get<ClaxonTemplate[]>("/claxon-templates", params),
	get: (
		client: ReturnType<typeof useApiClient>,
		id: string,
		language?: string,
	) => {
		const params = language ? { language } : undefined;
		return client.get<ClaxonTemplate>(`/claxon-templates/${id}`, params);
	},
	getByCategory: (
		client: ReturnType<typeof useApiClient>,
		category: string,
		language?: string,
	) => {
		const params = language ? { language } : undefined;
		return client.get<ClaxonTemplate[]>(
			`/claxon-templates/category/${category}`,
			params,
		);
	},
};

// ============================================================================
// HOOKS
// ============================================================================

export const useClaxonTemplates = (params?: ClaxonTemplateParams) => {
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxonTemplates.all(params),
		queryFn: () => claxonTemplatesApi.list(apiClient, params),
	});
};

export const useClaxonTemplate = (id: string, language?: string) => {
	const apiClient = useApiClient();

	return useQuery({
		queryKey: queryKeys.claxonTemplates.byId(id, language),
		queryFn: () => claxonTemplatesApi.get(apiClient, id, language),
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
		queryFn: () =>
			claxonTemplatesApi.getByCategory(apiClient, category, language),
		enabled: !!category,
	});
};
