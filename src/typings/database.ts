export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          dob: string | null;
          email: string | null;
          first_name: string | null;
          gender: string | null;
          id: string;
          is_phone_public: boolean | null;
          is_setup_finished: boolean | null;
          language: string | null;
          last_name: string | null;
          notification_preferences: Json | null;
          phone: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          dob?: string | null;
          email?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id: string;
          is_phone_public?: boolean | null;
          is_setup_finished?: boolean | null;
          language?: string | null;
          last_name?: string | null;
          notification_preferences?: Json | null;
          phone: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          dob?: string | null;
          email?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: string;
          is_phone_public?: boolean | null;
          is_setup_finished?: boolean | null;
          language?: string | null;
          last_name?: string | null;
          notification_preferences?: Json | null;
          phone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      claxon_templates: {
        Row: {
          category: string;
          created_at: string;
          icon: string | null;
          id: string;
          is_active: boolean;
          message_en: string;
          message_ro: string;
          message_ru: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          message_en: string;
          message_ro: string;
          message_ru: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          message_en?: string;
          message_ro?: string;
          message_ru?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      claxons: {
        Row: {
          created_at: string;
          custom_message: string | null;
          id: string;
          license_plate: string;
          read: boolean | null;
          read_at: string | null;
          recipient_id: string;
          sender_id: string;
          sender_language: string | null;
          template_id: string | null;
          type: string | null;
          updated_at: string;
          vehicle_id: string;
        };
        Insert: {
          created_at?: string;
          custom_message?: string | null;
          id?: string;
          license_plate: string;
          read?: boolean | null;
          read_at?: string | null;
          recipient_id: string;
          sender_id: string;
          sender_language?: string | null;
          template_id?: string | null;
          type?: string | null;
          updated_at?: string;
          vehicle_id: string;
        };
        Update: {
          created_at?: string;
          custom_message?: string | null;
          id?: string;
          license_plate?: string;
          read?: boolean | null;
          read_at?: string | null;
          recipient_id?: string;
          sender_id?: string;
          sender_language?: string | null;
          template_id?: string | null;
          type?: string | null;
          updated_at?: string;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "claxons_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claxons_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claxons_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "claxon_templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claxons_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicles: {
        Row: {
          brand: string | null;
          color: string | null;
          created_at: string;
          id: string;
          manufacture_year: number | null;
          model: string | null;
          phase: string | null;
          plate_country: string | null;
          plate_left_part: string | null;
          plate_number: string | null;
          plate_right_part: string | null;
          plate_type: string | null;
          updated_at: string;
          user_id: string;
          vin_code: string | null;
        };
        Insert: {
          brand?: string | null;
          color?: string | null;
          created_at?: string;
          id?: string;

          manufacture_year?: number | null;
          model?: string | null;
          phase?: string | null;
          plate_country?: string | null;
          plate_left_part?: string | null;
          plate_number?: string | null;
          plate_right_part?: string | null;
          plate_type?: string | null;
          updated_at?: string;
          user_id: string;
          vin_code?: string | null;
        };
        Update: {
          brand?: string | null;
          color?: string | null;
          created_at?: string;
          id?: string;

          manufacture_year?: number | null;
          model?: string | null;
          phase?: string | null;
          plate_country?: string | null;
          plate_left_part?: string | null;
          plate_number?: string | null;
          plate_right_part?: string | null;
          plate_type?: string | null;
          updated_at?: string;
          user_id?: string;
          vin_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      bytea_to_text: {
        Args: { data: string };
        Returns: string;
      };
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_delete: {
        Args: { uri: string } | { uri: string; content: string; content_type: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_get: {
        Args: { uri: string } | { uri: string; data: Json };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_head: {
        Args: { uri: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_header: {
        Args: { field: string; value: string };
        Returns: Database["public"]["CompositeTypes"]["http_header"];
      };
      http_list_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: {
          curlopt: string;
          value: string;
        }[];
      };
      http_patch: {
        Args: { uri: string; content: string; content_type: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_post: {
        Args: { uri: string; content: string; content_type: string } | { uri: string; data: Json };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_put: {
        Args: { uri: string; content: string; content_type: string };
        Returns: Database["public"]["CompositeTypes"]["http_response"];
      };
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      http_set_curlopt: {
        Args: { curlopt: string; value: string };
        Returns: boolean;
      };
      text_to_bytea: {
        Args: { data: string };
        Returns: string;
      };
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      http_header: {
        field: string | null;
        value: string | null;
      };
      http_request: {
        method: unknown | null;
        uri: string | null;
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null;
        content_type: string | null;
        content: string | null;
      };
      http_response: {
        status: number | null;
        content_type: string | null;
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null;
        content: string | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
