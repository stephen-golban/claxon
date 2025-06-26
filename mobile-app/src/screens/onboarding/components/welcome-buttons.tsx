import { useRouter } from "expo-router";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import { MoveLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedButton = Animated.createAnimatedComponent(Button);

interface WelcomeButtonsProps {
	currentIndex: number;
	onBack: () => void;
	onNext: () => void;
	totalSlides: number;
}

export function WelcomeButtons({ currentIndex, onBack, onNext, totalSlides }: WelcomeButtonsProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const { width } = useWindowDimensions();

	const isFirstSlide = currentIndex === 0;
	const isLastSlide = currentIndex === totalSlides - 1;

	const progress = useSharedValue(isFirstSlide ? 0 : 1);
	const lastSlideProgress = useSharedValue(isLastSlide ? 1 : 0);

	React.useEffect(() => {
		progress.value = withSpring(isFirstSlide ? 0 : 1, {
			damping: 15,
			stiffness: 100,
		});
	}, [isFirstSlide, progress]);

	React.useEffect(() => {
		lastSlideProgress.value = withSpring(isLastSlide ? 1 : 0, {
			damping: 20,
			stiffness: 120,
			mass: 1,
		});
	}, [isLastSlide, lastSlideProgress]);

	// Animated styles - completely separate from Unistyles
	const containerAnimatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: interpolate(lastSlideProgress.value, [0, 0.7, 1], [0, 0, -32], Extrapolation.CLAMP),
			},
		],
	}));

	const backButtonAnimatedStyle = useAnimatedStyle(() => {
		const slideProgress = lastSlideProgress.value;
		const isHidden = slideProgress > 0.3;

		return {
			opacity: progress.value * (isHidden ? 0 : 1),
			transform: [
				{
					translateX: interpolate(
						slideProgress,
						[0, 1], // Extended range for smoother sliding
						[0, width / 2],
						Extrapolation.CLAMP,
					),
				},
				{
					translateY: interpolate(slideProgress, [0, 0.3, 0.7, 1], [0, 0, 0, 64], Extrapolation.CLAMP),
				},
			],
			zIndex: isHidden ? -1 : 1,
			pointerEvents: isHidden ? "none" : "auto",
		};
	});

	const lastButtonAnimatedStyle = useAnimatedStyle(() => {
		const slideProgress = lastSlideProgress.value;
		const isVisible = slideProgress > 0.3;

		return {
			opacity: isVisible ? 1 : 0,
			transform: [
				{
					translateY: interpolate(slideProgress, [0, 0.3, 0.7, 1], [0, 0, 0, 30], Extrapolation.CLAMP),
				},
			],
			zIndex: -1,
			pointerEvents: isVisible ? "auto" : "none",
		};
	});

	const nextButtonAnimatedStyle = useAnimatedStyle(() => {
		const maxWidth = width - 40;
		const minWidth = maxWidth * 0.8;

		return {
			width: interpolate(
				lastSlideProgress.value,
				[0, 0.5, 1],
				[minWidth + (maxWidth - minWidth) * (1 - progress.value), maxWidth, maxWidth],
				Extrapolation.CLAMP,
			),
			marginLeft: interpolate(lastSlideProgress.value, [0, 1, 1], [20 * progress.value, 0, 0], Extrapolation.CLAMP),
			transform: [
				{
					translateY: interpolate(lastSlideProgress.value, [0, 0.5, 1], [0, 0, -20], Extrapolation.CLAMP),
				},
			],
		};
	});

	const handleNext = () => {
		if (isLastSlide) {
			router.push("/(unprotected)/sign-up");
		} else {
			onNext();
		}
	};

	const handleBackAction = () => {
		if (!isLastSlide) {
			onBack();
		}
	};

	const onPressLastButton = () => {
		router.push("/(unprotected)/sign-in");
	};

	return (
		<AnimatedView className="w-full flex-row items-center justify-end px-5" style={containerAnimatedStyle}>
			<AnimatedView
				style={backButtonAnimatedStyle}
				className={cn(
					"absolute left-5 w-10 h-10 z-10 items-center justify-center",
					isFirstSlide && "pointer-events-none opacity-50",
				)}
			>
				<MoveLeftIcon className="text-primary" onPress={handleBackAction} disabled={isFirstSlide} size={30} />
			</AnimatedView>

			<AnimatedButton
				size="lg"
				variant="ghost"
				onPress={onPressLastButton}
				className={cn("left-6 absolute w-full rounded-full")}
				style={[{ maxWidth: width - 40 }, lastButtonAnimatedStyle]}
			>
				<Text>{t("buttons:log_in")}</Text>
			</AnimatedButton>

			<AnimatedButton onPress={handleNext} style={nextButtonAnimatedStyle} className="rounded-full" size="lg">
				<Text>{isLastSlide ? t("onboarding:get_started") : t("buttons:continue")}</Text>
			</AnimatedButton>
		</AnimatedView>
	);
}
