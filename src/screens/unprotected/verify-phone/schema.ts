import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stringifyObjectValidate } from "@/lib/utils";

export const otpSchema = z.object({
	otp: z.string().length(6, stringifyObjectValidate({ keyT: "verificationCode:invalidCode" })),
});

export type OtpFormData = z.infer<typeof otpSchema>;

export const defaultValues: OtpFormData = { otp: "" };

export const resolver = zodResolver(otpSchema);
