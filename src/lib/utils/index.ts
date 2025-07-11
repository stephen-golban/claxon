import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import type { TOptionsBase } from "i18next";
import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { twMerge } from "tailwind-merge";
import i18n from "@/translations";
import type { I18nKey } from "@/translations/types";
import type { ValidateMessageObject } from "@/typings/validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

export const ellipsisString = (text: string, maxLength = 10) => {
  if (!text) return "";

  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const stringifyObjectValidate = ({ keyT, options, optionsTx }: ValidateMessageObject) => {
  return JSON.stringify({
    keyT,
    options,
    optionsTx,
  });
};

export const formatPhoneNumber = (phone: string | { code: string; number: string; format?: string }) => {
  let digits: string;

  if (typeof phone === "string") {
    // Remove any non-digit characters
    digits = phone.replace(/\D/g, "");
  } else {
    // Combine code and number for object input
    const fullNumber = phone.code + phone.number;
    digits = fullNumber.replace(/\D/g, "");

    if (phone.format) {
      // Use custom format if provided
      const formatted = phone.format;
      let digitIndex = 0;
      return formatted.replace(/X/g, () => digits[digitIndex++] || "");
    }
  }

  // Default format: +373 XXX XX XXX
  return digits.replace(/^(\d{3})(\d{3})(\d{2})(\d{3})$/, "+$1 $2 $3 $4");
};

type $Dictionary<T = unknown> = { [key: string]: T };

export function translate(key: I18nKey, option?: (TOptionsBase & $Dictionary) | undefined) {
  return key ? i18n.t(key, option) : "";
}

export const translateError = (error: string) => {
  return translate(`errors:${error}` as I18nKey);
};

export const printError = (text: string, error: Error) => {
  console.error(`${text}: ${JSON.stringify(error, null, 2)}`);
};
