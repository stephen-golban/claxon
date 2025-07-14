import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { ERROR_CODES } from "@/lib/constants";
import { printError, translateError } from "@/lib/utils";
import type { Database } from "@/typings/database";
import { supabase } from "./client";

export type Account = Database["public"]["Tables"]["accounts"]["Row"];
export type UpdateAccountBody = Database["public"]["Tables"]["accounts"]["Update"];
export type CreateAccountBody = Database["public"]["Tables"]["accounts"]["Insert"];

export class AccountService {
  /**
   * Retrieves a profile by ID (which is the same as user ID)
   * @param id The ID of the profile/user to retrieve
   * @returns The profile record
   * @throws Error if the profile retrieval fails
   */
  async getById(id: string): Promise<Account> {
    const { data, error } = await supabase.from("accounts").select("*").eq("id", id).single<Account>();

    if (error) {
      printError(`account-getById-error`, error);
      throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
    }

    return data;
  }

  /**
   * Gets the current user's profile (uses RLS)
   * @returns The current user's profile
   * @throws Error if retrieval fails
   */
  async getMe(): Promise<Account> {
    const { data, error } = await supabase.from("accounts").select("*").single<Account>();

    if (error) {
      printError(`account-getMe-error`, error);
      await supabase.auth.signOut();
      throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
    }

    return data;
  }

  /**
   * Updates the current user's profile (uses RLS)
   * @param dto The profile details to update
   * @returns The updated profile record
   * @throws Error if the profile update fails
   */
  async update(dto: UpdateAccountBody, id: string): Promise<Account> {
    const { data, error } = await supabase.from("accounts").update(dto).eq("id", id).select().single<Account>();

    if (error) {
      printError(`account-update-error`, error);
      throw new Error(ERROR_CODES.USER.UPDATE_FAILED);
    }
    return data;
  }

  /**
   * Creates a new profile
   * @param dto The profile details to create
   * @returns The created profile record
   * @throws Error if the profile creation fails
   */
  async create(dto: CreateAccountBody): Promise<Account> {
    const { data, error } = await supabase.from("accounts").insert(dto).select().single<Account>();

    if (error) {
      printError(`account-create-error`, error);
      throw new Error(ERROR_CODES.USER.CREATION_FAILED);
    }
    return data;
  }

  /**
   * Upserts a profile (creates if not exists, updates if exists)
   * @param dto The profile details to upsert
   * @param id The ID of the profile to upsert
   * @returns The upserted profile record
   * @throws Error if the upsert operation fails
   */
  async upsert(dto: CreateAccountBody, id: string): Promise<Account> {
    const { data, error } = await supabase.from("accounts").upsert(dto).eq("id", id).select().single<Account>();

    if (error) {
      printError(`account-upsert-error`, error);
      throw new Error(ERROR_CODES.USER.CREATION_FAILED);
    }
    return data;
  }

  /**
   * Deletes the current user's account and all associated data
   * This will cascade delete all related records (vehicles, claxons, etc.)
   * @throws Error if the account deletion fails
   */
  async deleteAccount(): Promise<void> {
    try {
      // Get current user session to get user ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        printError("account-delete-user-error", userError || new Error("No user found"));
        throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
      }

      // Delete the account record (this will cascade delete all related data)
      const { error: deleteError } = await supabase.from("accounts").delete().eq("id", user.id);

      if (deleteError) {
        printError("account-delete-error", deleteError);
        throw new Error(ERROR_CODES.USER.UPDATE_FAILED);
      }

      // Sign out the user after successful deletion
      await supabase.auth.signOut();
    } catch (error) {
      printError("account-delete-error", error as Error);
      throw new Error(ERROR_CODES.USER.UPDATE_FAILED);
    }
  }
}

const accountService = new AccountService();
// ============================================================================
// HOOKS
// ============================================================================

export const useGetAccountById = (id: string) => {
  return useQuery({
    queryKey: ["accounts", "getById", id],
    queryFn: () => accountService.getById(id),
    enabled: !!id,
  });
};

export const usePrefetchGetMe = () => {
  const queryClient = useQueryClient();

  return queryClient.prefetchQuery({
    queryKey: ["accounts", "getMe"],
    queryFn: accountService.getMe,
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["accounts", "getMe"],
    queryFn: accountService.getMe,
    // User data is relatively stable, keep it fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep user data in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
    throwOnError: (error) => {
      toast.error(translateError(error.message));
      return true;
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto, id }: { dto: UpdateAccountBody; id: string }) => accountService.update(dto, id),
    mutationKey: ["accounts", "update"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useUpdateAccountPhoneSharing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPhonePublic }: { id: string; isPhonePublic: boolean }) =>
      accountService.update({ is_phone_public: isPhonePublic }, id),
    mutationKey: ["accounts", "updatePhoneSharing"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    mutationKey: ["accounts", "create"],
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useUpsertAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto, id }: { dto: CreateAccountBody; id: string }) => accountService.upsert(dto, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    mutationKey: ["accounts", "upsert"],
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

// ============================================================================
// STATISTICS SERVICES
// ============================================================================

export interface AccountStatistics {
  vehicleCount: number;
  claxonsSent: number;
  claxonsReceived: number;
}

export class AccountStatisticsService {
  /**
   * Gets statistics for the current user's account
   * @returns Account statistics including vehicle count and claxon counts
   * @throws Error if statistics retrieval fails
   */
  async getMyStatistics(): Promise<AccountStatistics> {
    try {
      // Get current user session to get user ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        printError("account-statistics-user-error", userError || new Error("No user found"));
        throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
      }

      // Get vehicle count for current user (active vehicles only)
      const { count: vehicleCount, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (vehicleError) {
        printError("account-statistics-vehicles-error", vehicleError);
        throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
      }

      // Get claxons sent count (where current user is sender)
      const { count: claxonsSent, error: sentError } = await supabase
        .from("claxons")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", user.id);

      if (sentError) {
        printError("account-statistics-sent-error", sentError);
        throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
      }

      // Get claxons received count (where current user is recipient)
      const { count: claxonsReceived, error: receivedError } = await supabase
        .from("claxons")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", user.id);

      if (receivedError) {
        printError("account-statistics-received-error", receivedError);
        throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
      }

      return {
        vehicleCount: vehicleCount || 0,
        claxonsSent: claxonsSent || 0,
        claxonsReceived: claxonsReceived || 0,
      };
    } catch (error) {
      printError("account-statistics-error", error as Error);
      throw new Error(ERROR_CODES.USER.RETRIEVAL_FAILED);
    }
  }
}

const accountStatisticsService = new AccountStatisticsService();

export const useGetAccountStatistics = () => {
  return useQuery({
    queryKey: ["accounts", "statistics"],
    queryFn: accountStatisticsService.getMyStatistics,
    // Statistics change less frequently, keep fresh for 10 minutes
    staleTime: 10 * 60 * 1000,
    // Keep statistics in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
    throwOnError: (error) => {
      toast.error(translateError(error.message));
      return true;
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountService.deleteAccount,
    mutationKey: ["accounts", "delete"],
    onSuccess: () => {
      // Clear all cached data since user is being deleted
      queryClient.clear();
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};
