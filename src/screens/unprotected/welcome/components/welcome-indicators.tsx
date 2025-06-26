import type React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

import { useColorScheme } from "@/hooks";

const AnimatedView = Animated.createAnimatedComponent(View);

interface IWelcomeIndicators {
	length: number;
	currentPage: number;
}

const WelcomeIndicators: React.FC<IWelcomeIndicators> = ({ currentPage, length }) => {
	const { isDark } = useColorScheme();

	return (
		<View className="flex-row justify-center gap-x-2">
			{Array.from({ length }).map((_, index) => {
				const isActive = index === currentPage;

				// eslint-disable-next-line react-hooks/rules-of-hooks
				const indicatorStyle = useAnimatedStyle(() => ({
					width: withSpring(isActive ? 32 : 16, {
						damping: 15,
						stiffness: 100,
					}),
					backgroundColor: withSpring(isActive ? (isDark ? "white" : "rgb(31, 41, 55)") : "rgb(156, 163, 175)", {
						damping: 15,
					}),
				}));

				return (
					<AnimatedView
						key={`indicator-${
							// biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is safe here since indicators are static and won't be reordered
							index
						}`}
						style={indicatorStyle}
						className="h-1 rounded-full"
					/>
				);
			})}
		</View>
	);
};

export { WelcomeIndicators };
