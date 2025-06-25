export class CreateUserDto {
  phone: string;
  email: string;
  dob?: string;
  gender?: string;
  language?: string;
  lastName?: string;
  firstName?: string;
  avatarUrl?: string;
  privacySettings?: any;
  isPhonePublic?: boolean;
  notificationPreferences?: any;
}
