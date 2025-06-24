import { apiClient } from "@/lib/api";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const queryKeys = {
  users: {
    current: ["users", "current"] as const,
  },
  vehicles: {
    all: ["vehicles"] as const,
    byId: (id: string) => ["vehicles", id] as const,
    search: (plateNumber: string) => ["vehicles", "search", plateNumber] as const,
  },
  claxonTemplates: {
    all: (params?: { category?: string; language?: string }) => ["claxon-templates", params] as const,
    byId: (id: string, language?: string) => ["claxon-templates", id, language] as const,
    byCategory: (category: string, language?: string) => ["claxon-templates", "category", category, language] as const,
  },
  claxons: {
    inbox: (params?: { read?: boolean; limit?: number; offset?: number }) => ["claxons", "inbox", params] as const,
    sent: (params?: { limit?: number; offset?: number }) => ["claxons", "sent", params] as const,
    byId: (id: string) => ["claxons", id] as const,
    unreadCount: ["claxons", "unread-count"] as const,
  },
};

// User hooks
export const useCurrentUser = () => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.current,
    queryFn: () => apiClient.users.current(),
    enabled: isSignedIn,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.users.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.users.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.users.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current });
    },
  });
};

// Vehicle hooks
export const useVehicles = () => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.vehicles.all,
    queryFn: () => apiClient.vehicles.list(),
    enabled: isSignedIn,
  });
};

export const useVehicle = (id: string) => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.vehicles.byId(id),
    queryFn: () => apiClient.vehicles.get(id),
    enabled: isSignedIn && !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.vehicles.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof apiClient.vehicles.update>[1] }) =>
      apiClient.vehicles.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.byId(id) });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.vehicles.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    },
  });
};

export const useSearchVehicle = (plateNumber: string) => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.vehicles.search(plateNumber),
    queryFn: () => apiClient.vehicles.search(plateNumber),
    enabled: isSignedIn && !!plateNumber && plateNumber.length > 2,
  });
};

// Claxon template hooks
export const useClaxonTemplates = (params?: {
  category?: string;
  language?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.claxonTemplates.all(params),
    queryFn: () => apiClient.claxonTemplates.list(params),
  });
};

export const useClaxonTemplate = (id: string, language?: string) => {
  return useQuery({
    queryKey: queryKeys.claxonTemplates.byId(id, language),
    queryFn: () => apiClient.claxonTemplates.get(id, language),
    enabled: !!id,
  });
};

export const useClaxonTemplatesByCategory = (category: string, language?: string) => {
  return useQuery({
    queryKey: queryKeys.claxonTemplates.byCategory(category, language),
    queryFn: () => apiClient.claxonTemplates.getByCategory(category, language),
    enabled: !!category,
  });
};

// Claxon hooks
export const useInboxClaxons = (params?: {
  read?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.claxons.inbox(params),
    queryFn: () => apiClient.claxons.inbox(params),
    enabled: isSignedIn,
  });
};

export const useSentClaxons = (params?: {
  limit?: number;
  offset?: number;
}) => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.claxons.sent(params),
    queryFn: () => apiClient.claxons.sent(params),
    enabled: isSignedIn,
  });
};

export const useClaxon = (id: string) => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.claxons.byId(id),
    queryFn: () => apiClient.claxons.get(id),
    enabled: isSignedIn && !!id,
  });
};

export const useUnreadClaxonCount = () => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.claxons.unreadCount,
    queryFn: () => apiClient.claxons.unreadCount(),
    enabled: isSignedIn,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useSendClaxon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.claxons.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claxons"] });
    },
  });
};

export const useMarkClaxonAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.claxons.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claxons"] });
    },
  });
};
