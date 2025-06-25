export class UpdateClaxonDto {
  recipientId?: string;
  vehicleId?: string;
  templateId?: string;
  licensePlate?: string;
  type?: string;
  customMessage?: string;
  senderLanguage?: string;
  read?: boolean;
  readAt?: Date;
}
