import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { z } from "zod";
import { stringifyObjectValidate } from "@/lib/utils";

const emailSchema = z.string().email(stringifyObjectValidate({ keyT: "errors:invalidEmail" }));

const MIN_AGE = 16;
const dobSchema = z.date().refine(
  (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
  .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, stringifyObjectValidate({ keyT: "errors:nameInvalidFormat" }));

export const profileSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema.optional().or(z.literal("")),
  dob: dobSchema.optional(),
  gender: z.string().optional(),
  avatar: z
    .object({
      path: z.string(),
      arraybuffer: z.any(),
      mimeType: z.string(),
      uri: z.string(),
    })
    .optional(),
  share_phone: z.boolean().optional(),
  language: z.enum(["ro", "en", "ru"]).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Mock default values - in real app these would come from the user's profile
export const defaultValues: ProfileFormData = {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  dob: dayjs().subtract(25, "year").toDate(),
  gender: "male",
  share_phone: false,
  language: "en",
  avatar: {
    uri: "",
    path: "",
    mimeType: "",
    arraybuffer: new ArrayBuffer(0),
  },
};

export const resolver = zodResolver(profileSchema);
