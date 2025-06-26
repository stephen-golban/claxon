import type { FileRoute } from "uploadthing/types";

type JsonValue = string | number | boolean | null | undefined;
type JsonObject = {
	[key: string]: JsonValue | JsonObject | JsonArray;
};
type JsonArray = (JsonValue | JsonObject)[];
type Json = JsonValue | JsonObject | JsonArray;

export type UploadThingRouter = {
	avatarUploader: FileRoute<{
		input: undefined;
		output: {
			uploadedBy: string;
			url: string;
		};
		errorShape: Json;
	}>;
};
