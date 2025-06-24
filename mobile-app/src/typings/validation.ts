import type { I18nKey } from "@/translations/types";

export type ValidateMessageObject = {
  keyT: I18nKey;
  optionsTx?: Record<string, I18nKey>;
  options?: Record<string, string | number>;
};

export enum OnboardingPhase {
  index = "index",
  personal_details = "personal_details",
  vehicle_details = "vehicle_details",
  vehicle_plate = "vehicle_plate",
  done = "done",
}
