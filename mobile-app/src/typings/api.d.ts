// Users Schema Types
export type User = {
	id: string;
	phone: string;
	email: string;
	clerkId: string;
	dob: string | null;
	gender: string | null;
	language: string | null;
	lastName: string | null;
	firstName: string | null;
	avatarUrl: string | null;
	privacySettings: string | null;
	isPhonePublic: boolean | null;
	notificationPreferences: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type NewUser = {
	id: string;
	phone: string;
	email: string;
	clerkId: string;
	dob?: string | null;
	gender?: string | null;
	language?: string | null;
	lastName?: string | null;
	firstName?: string | null;
	avatarUrl?: string | null;
	privacySettings?: string | null;
	isPhonePublic?: boolean | null;
	notificationPreferences?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
};

export type UpdateUser = {
	phone?: string;
	email?: string;
	dob?: string | null;
	gender?: string | null;
	language?: string | null;
	lastName?: string | null;
	firstName?: string | null;
	avatarUrl?: string | null;
	privacySettings?: string | null;
	isPhonePublic?: boolean | null;
	notificationPreferences?: string | null;
};

export type QueryUser = {
	language?: string | null;
	gender?: string | null;
	isPhonePublic?: boolean | null;
};

// Vehicles Schema Types
export type Vehicle = {
	id: string;
	userId: string;
	brand: string | null;
	model: string | null;
	color: string | null;
	phase: string | null;
	vinCode: string | null;
	plateType: string | null;
	plateNumber: string | null;
	plateCountry: string | null;
	plateLeftPart: string | null;
	plateRightPart: string | null;
	manufactureYear: number | null;
	isActive: boolean | null;
	createdAt: Date;
	updatedAt: Date;
};

export type NewVehicle = {
	id?: string;
	userId: string;
	brand?: string | null;
	model?: string | null;
	color?: string | null;
	phase?: string | null;
	vinCode?: string | null;
	plateType?: string | null;
	plateNumber?: string | null;
	plateCountry?: string | null;
	plateLeftPart?: string | null;
	plateRightPart?: string | null;
	manufactureYear?: number | null;
	isActive?: boolean | null;
	createdAt?: Date;
	updatedAt?: Date;
};

export type UpdateVehicle = {
	brand?: string | null;
	model?: string | null;
	color?: string | null;
	phase?: string | null;
	vinCode?: string | null;
	plateType?: string | null;
	plateNumber?: string | null;
	plateCountry?: string | null;
	plateLeftPart?: string | null;
	plateRightPart?: string | null;
	manufactureYear?: number | null;
	isActive?: boolean | null;
};

export type QueryVehicle = {
	brand?: string | null;
	model?: string | null;
	color?: string | null;
	plateType?: string | null;
	plateCountry?: string | null;
	isActive?: boolean | null;
};

// Claxons Schema Types
export type Claxon = {
	id: string;
	senderId: string;
	recipientId: string;
	vehicleId: string;
	templateId: string | null;
	licensePlate: string;
	type: string | null;
	customMessage: string | null;
	senderLanguage: string | null;
	read: boolean | null;
	readAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type NewClaxon = {
	id?: string;
	senderId: string;
	recipientId: string;
	vehicleId: string;
	templateId?: string | null;
	licensePlate: string;
	type?: string | null;
	customMessage?: string | null;
	senderLanguage?: string | null;
	read?: boolean | null;
	readAt?: Date | null;
	createdAt?: Date;
	updatedAt?: Date;
};

export type UpdateClaxon = {
	recipientId?: string;
	vehicleId?: string;
	templateId?: string | null;
	licensePlate?: string;
	type?: string | null;
	customMessage?: string | null;
	senderLanguage?: string | null;
	read?: boolean | null;
	readAt?: Date | null;
};

export type QueryClaxon = {
	read?: boolean | null;
	type?: string | null;
	senderLanguage?: string | null;
};

// Claxon Templates Schema Types
export type ClaxonTemplate = {
	id: string;
	category: string;
	isActive: boolean;
	messageEn: string;
	messageRo: string;
	messageRu: string;
	icon: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type NewClaxonTemplate = {
	id?: string;
	category: string;
	isActive?: boolean;
	messageEn: string;
	messageRo: string;
	messageRu: string;
	icon?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
};

export type UpdateClaxonTemplate = {
	category?: string;
	isActive?: boolean;
	messageEn?: string;
	messageRo?: string;
	messageRu?: string;
	icon?: string | null;
};

export type QueryClaxonTemplate = {
	category?: string;
	language?: "en" | "ro" | "ru";
};
