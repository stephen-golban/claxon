import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { z } from "zod";
import { stringifyObjectValidate } from "@/lib/utils";

const emailSchema = z
	.string()
	.email(stringifyObjectValidate({ keyT: "errors:invalidEmail" }));

const MIN_AGE = 16;
const dobSchema = z.date().refine(
	(date) => {
		const today = new Date();
		const birthDate = new Date(date);
		const age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			return age - 1 >= MIN_AGE;
		}

		return age >= MIN_AGE;
	},
	stringifyObjectValidate({ keyT: "errors:minAge" }),
);

// Name validation with regex to allow only letters, spaces, hyphens
const nameSchema = z
	.string()
	.min(1, stringifyObjectValidate({ keyT: "errors:nameRequired" }))
	.regex(
		/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/,
		stringifyObjectValidate({ keyT: "errors:nameInvalidFormat" }),
	);

export const signUpSchema = z.object({
	email: emailSchema,
	phone: z
		.string()
		.regex(
			/^(\d{3}\s\d{1,2}\s\d{3})$/,
			stringifyObjectValidate({ keyT: "errors:phoneNumberFormat" }),
		),
	first_name: nameSchema,
	last_name: nameSchema,
	dob: dobSchema,
	image: z.object({
		uri: z
			.string()
			.min(1, stringifyObjectValidate({ keyT: "errors:required" })),
		mimeType: z.string(),
		uploadedUrl: z
			.string()
			.min(1, stringifyObjectValidate({ keyT: "errors:required" })),
	}),
	gender: z
		.string()
		.min(1, stringifyObjectValidate({ keyT: "errors:genderRequired" })),
	termsAccepted: z
		.boolean()
		.refine(
			(val) => val === true,
			stringifyObjectValidate({ keyT: "errors:required" }),
		),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const defaultValues: SignUpFormData = {
	email: "",
	phone: "",
	image: {
		uri: "",
		mimeType: "",
		uploadedUrl: "",
	},
	gender: "",
	last_name: "",
	first_name: "",
	dob: dayjs().subtract(16, "year").toDate(),
	termsAccepted: false,
};

export const resolver = zodResolver(signUpSchema);
