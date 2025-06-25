export class CreateClaxonDto {
  recipientId: string;
  vehicleId: string;
  templateId?: string;
  licensePlate: string;
  type?: string;
  customMessage?: string;
  senderLanguage?: string;
}
