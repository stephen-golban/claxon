import type {
	ClaxonPaginationParams,
	ClaxonTemplateParams,
	QueryVehicle,
} from "./types";

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
