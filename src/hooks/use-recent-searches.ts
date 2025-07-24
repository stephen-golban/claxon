import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recentSearchesService } from "@/services/storage/recent-searches";

export const useGetRecentSearches = () => {
  return useQuery({
    queryKey: ["recentSearches"],
    queryFn: recentSearchesService.getRecentSearches,
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

export const useAddRecentSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ plateNumber, found }: { plateNumber: string; found: boolean }) =>
      recentSearchesService.addRecentSearch(plateNumber, found),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
  });
};

export const useClearRecentSearches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recentSearchesService.clearRecentSearches,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
  });
};
