import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface CustomSplashScreenProps {
	onAnimationComplete?: () => void;
	shouldFadeOut?: boolean;
}

export function CustomSplashScreen({
	onAnimationComplete,
	shouldFadeOut = false,
}: CustomSplashScreenProps) {
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	React.useEffect(() => {
		if (shouldFadeOut) {
			opacity.value = withTiming(0, { duration: 300 }, (finished) => {
				if (finished && onAnimationComplete) {
					runOnJS(onAnimationComplete)();
				}
			});
		}
	}, [shouldFadeOut, opacity, onAnimationComplete]);

	return (
		<Animated.View
			style={[StyleSheet.absoluteFillObject, animatedStyle]}
			className="flex-1 items-center justify-center bg-background"
		>
			<StatusBar style="auto" animated />
			<LottieView
				source={require("@/assets/animations/car.lottie")}
				autoPlay
				loop
				style={{ width: 200, height: 200 }}
			/>
		</Animated.View>
	);
}
