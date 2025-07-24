import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { getSupabaseErrorCode, printError, translateError } from "@/lib/utils";
import type { Database } from "@/typings/database";
import { supabase } from "./client";

// ============================================================================
// TYPES
// ============================================================================

export type ClaxonRow = Database["public"]["Tables"]["claxons"]["Row"];
export type ClaxonTemplateRow = Database["public"]["Tables"]["claxon_templates"]["Row"];
export type AccountRow = Database["public"]["Tables"]["accounts"]["Row"];
export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];

export interface ClaxonWithRelations extends ClaxonRow {
  sender?: Pick<AccountRow, "id" | "first_name" | "last_name" | "avatar_url">;
  recipient?: Pick<AccountRow, "id" | "first_name" | "last_name" | "avatar_url">;
  template?: ClaxonTemplateRow;
  vehicle?: Pick<VehicleRow, "id" | "plate_number">;
  // Computed fields for UI
  displayMessage: string;
  isReceived: boolean;
}

export interface MarkAsReadBody {
  messageId: string;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class ClaxonService {
  /**
   * Get all claxons for the current user (both sent and received)
   * @returns Array of claxons with populated relations
   */
  async getMyClaxons(): Promise<ClaxonWithRelations[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("claxons")
      .select(`
        *,
        sender:accounts!claxons_sender_id_fkey(id, first_name, last_name, avatar_url),
        recipient:accounts!claxons_recipient_id_fkey(id, first_name, last_name, avatar_url),
        template:claxon_templates(id, category, message_en, message_ro, message_ru, icon, is_active),
        vehicle:vehicles(id, plate_number)
      `)
      .or(`sender_id.eq.${user.user.id},recipient_id.eq.${user.user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      printError("claxons-getMyClaxons-error", error);
      throw getSupabaseErrorCode(error);
    }

    // Transform the data to match our UI expectations
    return data.map((claxon) => {
      const isReceived = claxon.recipient_id === user.user.id;
      
      // Determine display message based on type and language
      let displayMessage = "";
      if (claxon.type === "custom" && claxon.custom_message) {
        displayMessage = claxon.custom_message;
      } else if (claxon.template) {
        // Use English as default, could be enhanced to use user's language preference
        displayMessage = claxon.template.message_en;
      }

      return {
        ...claxon,
        displayMessage,
        isReceived,
      } as ClaxonWithRelations;
    });
  }

  /**
   * Mark a specific claxon as read
   * @param messageId The ID of the claxon to mark as read
   */
  async markAsRead(messageId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("claxons")
      .update({ 
        read: true, 
        read_at: new Date().toISOString() 
      })
      .eq("id", messageId)
      .eq("recipient_id", user.user.id); // Only allow marking own received messages as read

    if (error) {
      printError("claxons-markAsRead-error", error);
      throw getSupabaseErrorCode(error);
    }
  }

  /**
   * Mark all received claxons as read for the current user
   */
  async markAllAsRead(): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("claxons")
      .update({ 
        read: true, 
        read_at: new Date().toISOString() 
      })
      .eq("recipient_id", user.user.id)
      .eq("read", false); // Only update unread messages

    if (error) {
      printError("claxons-markAllAsRead-error", error);
      throw getSupabaseErrorCode(error);
    }
  }

  /**
   * Get claxon templates for sending messages
   */
  async getActiveTemplates(): Promise<ClaxonTemplateRow[]> {
    const { data, error } = await supabase
      .from("claxon_templates")
      .select("*")
      .eq("is_active", true)
      .order("category");

    if (error) {
      printError("claxons-getActiveTemplates-error", error);
      throw getSupabaseErrorCode(error);
    }

    return data;
  }
}

const claxonService = new ClaxonService();

// ============================================================================
// HOOKS
// ============================================================================

export const useGetMyClaxons = () => {
  return useQuery({
    queryKey: ["claxons", "getMyClaxons"],
    queryFn: claxonService.getMyClaxons,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes (messages change frequently)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    throwOnError: (error) => {
      toast.error(translateError(error.message));
      return true;
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claxonService.markAsRead,
    mutationKey: ["claxons", "markAsRead"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claxons"] });
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claxonService.markAllAsRead,
    mutationKey: ["claxons", "markAllAsRead"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claxons"] });
    },
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useGetActiveTemplates = () => {
  return useQuery({
    queryKey: ["claxons", "templates", "active"],
    queryFn: claxonService.getActiveTemplates,
    staleTime: 30 * 60 * 1000, // Templates don't change often, keep fresh for 30 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    throwOnError: (error) => {
      toast.error(translateError(error.message));
      return true;
    },
  });
};
