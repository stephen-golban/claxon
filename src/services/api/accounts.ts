import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

    if (error) throw error;
    return data;
  }

  /**
   * Gets the current user's profile (uses RLS)
   * @returns The current user's profile
   * @throws Error if retrieval fails
   */
  async getMe(): Promise<Account> {
    const { data, error } = await supabase.from("accounts").select("*").single<Account>();

    if (error) throw error;
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

    if (error) throw error;
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

    if (error) throw error;
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
    const { data, error } = await supabase
      .from("accounts")
      .upsert({ ...dto, id })
      .select()
      .single<Account>();

    if (error) throw error;
    return data;
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

export const useGetMe = () => {
  return useQuery({
    queryKey: ["accounts", "getMe"],
    queryFn: accountService.getMe,
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto, id }: { dto: UpdateAccountBody; id: string }) => accountService.update(dto, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    mutationKey: ["accounts", "update"],
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
  });
};
