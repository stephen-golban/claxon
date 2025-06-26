import type { InterpolationMap } from "i18next";
import { type UseTranslationOptions, useTranslation as useITranslation } from "react-i18next";

import type { I18nKey } from "@/translations/types";

// biome-ignore lint/suspicious/noExplicitAny: we need to pass the event to the parent
export function useTranslation(ns?: I18nKey, opts?: UseTranslationOptions<any>) {
	const { t: T, ...rest } = useITranslation<I18nKey>(ns, opts);
	// biome-ignore lint/suspicious/noExplicitAny: we need to pass the event to the parent
	const t = (key: I18nKey, options?: InterpolationMap<any>) => T(key, options);

	return { t, ...rest };
}
