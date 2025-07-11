import { z } from "zod";
import { stringifyObjectValidate } from "@/lib/utils";

export const signInSchema = z.object({
	phone: z
		.string()
		.regex(
			/^(\d{3}\s\d{1,2}\s\d{3})$/,
			stringifyObjectValidate({ keyT: "errors:phoneNumberFormat" }),
		),
});

export type SignInFormData = z.infer<typeof signInSchema>;
