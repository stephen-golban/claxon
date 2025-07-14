import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Account } from "@/services/api/accounts";

// Account form schema for settings that can be modified
export const accountFormSchema = z.object({
  is_phone_public: z.boolean(),
  language: z.enum(["en", "ro", "ru"]),
});

export type AccountFormData = z.infer<typeof accountFormSchema>;

export const defaultValues: AccountFormData = {
  is_phone_public: false,
  language: "ro",
};

export const resolver = zodResolver(accountFormSchema);

/**
 * Transforms account data from the API to form data format
 * @param account - The account data from useGetMe hook
 * @returns AccountFormData with account data or default values
 */
export const transformAccountToFormData = (account: Account | undefined): AccountFormData => {
  if (!account) {
    return defaultValues;
  }

  return {
    is_phone_public: account.is_phone_public || false,
    language: (account.language as "en" | "ro" | "ru") || defaultValues.language,
  };
};
