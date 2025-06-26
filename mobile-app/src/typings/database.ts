export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          avatar_url: string | null
          created_at: string
          dob: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: string
          is_phone_public: boolean | null
          language: string | null
          last_name: string | null
          notification_preferences: Json | null
          phone: string
          privacy_settings: Json | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          is_phone_public?: boolean | null
          language?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          phone: string
          privacy_settings?: Json | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_phone_public?: boolean | null
          language?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          phone?: string
          privacy_settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      claxon_templates: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          message_en: string
          message_ro: string
          message_ru: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          message_en: string
          message_ro: string
          message_ru: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          message_en?: string
          message_ro?: string
          message_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      claxons: {
        Row: {
          created_at: string
          custom_message: string | null
          id: string
          license_plate: string
          read: boolean | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          sender_language: string | null
          template_id: string | null
          type: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          custom_message?: string | null
          id?: string
          license_plate: string
          read?: boolean | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          sender_language?: string | null
          template_id?: string | null
          type?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          custom_message?: string | null
          id?: string
          license_plate?: string
          read?: boolean | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          sender_language?: string | null
          template_id?: string | null
          type?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claxons_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claxons_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claxons_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "claxon_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claxons_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string | null
          color: string | null
          created_at: string
          id: string
          is_active: boolean | null
          manufacture_year: number | null
          model: string | null
          phase: string | null
          plate_country: string | null
          plate_left_part: string | null
          plate_number: string | null
          plate_right_part: string | null
          plate_type: string | null
          updated_at: string
          user_id: string
          vin_code: string | null
        }
        Insert: {
          brand?: string | null
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          manufacture_year?: number | null
          model?: string | null
          phase?: string | null
          plate_country?: string | null
          plate_left_part?: string | null
          plate_number?: string | null
          plate_right_part?: string | null
          plate_type?: string | null
          updated_at?: string
          user_id: string
          vin_code?: string | null
        }
        Update: {
          brand?: string | null
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          manufacture_year?: number | null
          model?: string | null
          phase?: string | null
          plate_country?: string | null
          plate_left_part?: string | null
          plate_number?: string | null
          plate_right_part?: string | null
          plate_type?: string | null
          updated_at?: string
          user_id?: string
          vin_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
