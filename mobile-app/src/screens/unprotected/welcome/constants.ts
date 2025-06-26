import { useTranslation } from "@/hooks";

export const useWelcomeSlides = () => {
	const { t } = useTranslation();
	return [
		{
			id: 1,
			title: t("onboarding:slides:connect:title"),
			description: t("onboarding:slides:connect:description"),
			icon: require("@/assets/animations/car.lottie"),
		},
		{
			id: 2,
			title: t("onboarding:slides:send:title"),
			description: t("onboarding:slides:send:description"),
			icon: require("@/assets/animations/claxon.lottie"),
		},
		{
			id: 3,
			title: t("onboarding:slides:perfect:title"),
			description: t("onboarding:slides:perfect:description"),
			icon: require("@/assets/animations/feedback.lottie"),
		},
	];
};
