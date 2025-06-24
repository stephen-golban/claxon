import i18n from "i18next";

import * as Localization from "expo-localization";
import { locales } from "./locales";

import { setAppStoreKey } from "@/stores/app";
import { initReactI18next } from "react-i18next";

import { APP_CONSTANTS } from "@/lib/constants";

import type { LocalesType } from "./types";

export const initI18n = async (lng: string | undefined) => {
  let savedLanguage = lng;

  if (!savedLanguage) {
    const locales = Localization.getLocales();
    const lang = locales[0].languageCode || "";
    savedLanguage = lang;
    setAppStoreKey("language", lang);
  }

  i18n.use(initReactI18next).init({
    resources: locales as LocalesType,
    fallbackLng: APP_CONSTANTS.DEFAULT_LANGUAGE,
    compatibilityJSON: "v4",
    lng: savedLanguage as string,
    interpolation: { escapeValue: false },
  });
};

export default i18n;
