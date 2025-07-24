// Re-export types from the API service for backward compatibility
export type {
  ClaxonRow,
  ClaxonTemplateRow,
  ClaxonWithRelations,
} from "@/services/api/claxons";

// Legacy type - deprecated, use ClaxonWithRelations instead
export interface ClaxonMessage {
  _id: string;
  _creationTime: number;
  read: boolean;
  license_plate: string;
  sender_id: string;
  vehicle_id: string;
  recipient_id: string;
  custom_message?: string;
  template_id?: string;
  type: "custom" | "predefined";
  sender_language: "ro" | "en" | "ru";
  read_at?: number;

  // Populated fields (would come from joins in real app)
  sender?: {
    _id: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
  recipient?: {
    _id: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
  template?: {
    _id: string;
    category: string;
    message_en: string;
    message_ro: string;
    message_ru: string;
    icon?: string;
    is_active: boolean;
  };
  vehicle?: {
    _id: string;
    license_plate: string;
  };

  // Computed fields for UI
  messageType: "custom" | "predefined";
  displayMessage: string;
  isReceived: boolean;
  isUrgent?: boolean;
}
