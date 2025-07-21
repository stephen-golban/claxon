import type { AuthError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { getSupabaseErrorCode, printError, translateError } from "@/lib/utils";
import type { Database } from "@/typings/database";
import { supabase } from "./client";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type UpdateVehicleBody = Database["public"]["Tables"]["vehicles"]["Update"];
export type CreateVehicleBody = Database["public"]["Tables"]["vehicles"]["Insert"];

export class VehicleService {
  /**
   * Creates a new vehicle for the current user
   * @param dto The vehicle details to create
   * @returns The created vehicle record
   * @throws Error if the vehicle creation fails
   */
  async create(dto: Omit<CreateVehicleBody, "user_id">): Promise<Vehicle> {
    // Get current user session to get user ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      printError("vehicle-create-user-error", userError || new Error("No user found"));
      throw getSupabaseErrorCode(userError as AuthError, "auth");
    }

    const { data, error } = await supabase
      .from("vehicles")
      .insert({ ...dto, user_id: user.id })
      .select()
      .single<Vehicle>();

    if (error) {
      printError("vehicle-create-error", error);
      throw getSupabaseErrorCode(error, "database");
    }

    return data;
  }

  /**
   * Gets all vehicles for the current user
   * @returns Array of user's vehicles
   * @throws Error if retrieval fails
   */
  async getMyVehicles(): Promise<Vehicle[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      printError("vehicle-getMyVehicles-user-error", userError || new Error("No user found"));
      throw getSupabaseErrorCode(userError as AuthError, "auth");
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      printError("vehicle-getMyVehicles-error", error);
      throw getSupabaseErrorCode(error, "database");
    }

    return data || [];
  }

  /**
   * Updates a vehicle by ID (must belong to current user)
   * @param id The vehicle ID to update
   * @param dto The vehicle details to update
   * @returns The updated vehicle record
   * @throws Error if the vehicle update fails
   */
  async update(id: string, dto: UpdateVehicleBody): Promise<Vehicle> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      printError("vehicle-update-user-error", userError || new Error("No user found"));
      throw getSupabaseErrorCode(userError as AuthError, "auth");
    }

    const { data, error } = await supabase
      .from("vehicles")
      .update(dto)
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user can only update their own vehicles
      .select()
      .single<Vehicle>();

    if (error) {
      printError("vehicle-update-error", error);
      throw getSupabaseErrorCode(error, "database");
    }

    return data;
  }

  /**
   * Gets a vehicle by ID (must belong to current user)
   * @param id The vehicle ID to retrieve
   * @returns The vehicle record
   * @throws Error if the vehicle retrieval fails
   */
  async getById(id: string): Promise<Vehicle> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      printError("vehicle-getById-user-error", userError || new Error("No user found"));
      throw getSupabaseErrorCode(userError as AuthError, "auth");
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user can only access their own vehicles
      .single<Vehicle>();

    if (error) {
      printError("vehicle-getById-error", error);
      throw getSupabaseErrorCode(error, "database");
    }

    return data;
  }

  /**
   * Deletes a vehicle by ID (must belong to current user)
   * @param id The vehicle ID to delete
   * @throws Error if the vehicle deletion fails
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      printError("vehicle-delete-user-error", userError || new Error("No user found"));
      throw getSupabaseErrorCode(userError as AuthError, "auth");
    }

    const { error } = await supabase.from("vehicles").delete().eq("id", id).eq("user_id", user.id); // Ensure user can only delete their own vehicles

    if (error) {
      printError("vehicle-delete-error", error);
      throw getSupabaseErrorCode(error, "database");
    }
  }
}

const vehicleService = new VehicleService();

// ============================================================================
// HOOKS
// ============================================================================

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleService.create,
    mutationKey: ["vehicles", "create"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["accounts", "statistics"] }); // Update vehicle count
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useGetMyVehicles = () => {
  return useQuery({
    queryKey: ["vehicles", "getMyVehicles"],
    queryFn: vehicleService.getMyVehicles,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    throwOnError: (error) => {
      toast.error(translateError(error.message));
      return true;
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateVehicleBody }) => vehicleService.update(id, dto),
    mutationKey: ["vehicles", "update"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useGetVehicleById = (id: string) => {
  return useQuery({
    queryKey: ["vehicles", "getById", id],
    queryFn: () => vehicleService.getById(id),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    throwOnError: (error) => {
      toast.error(translateError(error.message));
      return true;
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleService.delete,
    mutationKey: ["vehicles", "delete"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["accounts", "statistics"] }); // Update vehicle count
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useUpdateVehicleActiveState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      vehicleService.update(id, { is_active: isActive }),
    mutationKey: ["vehicles", "updateActiveState"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};
