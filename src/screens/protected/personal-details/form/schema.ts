import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stringifyObjectValidate } from "@/lib/utils";
import type { Account } from "@/services/api/accounts";

const emailSchema = z.string().email(stringifyObjectValidate({ keyT: "errors:invalidEmail" }));

// Name validation with regex to allow only letters, spaces, hyphens
const nameSchema = z
  .string()
  .min(1, stringifyObjectValidate({ keyT: "errors:nameRequired" }))
  .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, stringifyObjectValidate({ keyT: "errors:nameInvalidFormat" }));

// Create a function to generate schema with dynamic image validation
export const createPersonalDetailsSchema = (hasExistingAvatar: boolean = false) =>
  z.object({
    email: emailSchema,
    first_name: nameSchema,
    last_name: nameSchema,
    image: z.object({
      path: z
        .string()
        .refine((path) => hasExistingAvatar || path.length > 0, stringifyObjectValidate({ keyT: "errors:required" })),
      arraybuffer: z.instanceof(ArrayBuffer),
      mimeType: z.string(),
      uri: z.string(),
    }),
    gender: z.string().min(1, stringifyObjectValidate({ keyT: "errors:genderRequired" })),
  });

// Default schema for backward compatibility
export const personalDetailsSchema = createPersonalDetailsSchema(false);

export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;

export const defaultValues: PersonalDetailsFormData = {
  email: "",
  gender: "",
  last_name: "",
  first_name: "",
  image: {
    path: "",
    arraybuffer: new ArrayBuffer(0),
    mimeType: "",
    uri: "",
  },
};

export const resolver = zodResolver(personalDetailsSchema);

/**
 * Transforms account data from the API to form data format
 * @param account - The account data from useGetMe hook
 * @returns PersonalDetailsFormData with account data or default values
 */
export const transformAccountToFormData = (account: Account | undefined): PersonalDetailsFormData => {
  if (!account) {
    return defaultValues;
  }

  return {
    email: account.email || "",
    first_name: account.first_name || "",
    last_name: account.last_name || "",
    gender: account.gender || "",
    image: {
      path: "",
      arraybuffer: new ArrayBuffer(0),
      mimeType: "",
      uri: "",
    },
  };
};
