import { Pressable } from "react-native-gesture-handler";
import Animated, {
	Easing,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import type { DARK_THEME, LIGHT_THEME } from "@/lib/constants";
import type { TabInfo } from "./type";

interface TabBarItemProps {
	tabInfo: TabInfo;
	label: string;
	isFocused: boolean;
	onPress: () => void;
	onLongPress: () => void;
	theme: typeof DARK_THEME | typeof LIGHT_THEME;
}

export function TabBarItem({ tabInfo, label, isFocused, onPress, onLongPress, theme }: TabBarItemProps) {
	const scale = useSharedValue(1);
	const iconTranslateY = useSharedValue(0);
	const textOpacity = useSharedValue(0);
	const textTranslateY = useSharedValue(10);

	// Use useDerivedValue to reactively update animations based on isFocused
	useDerivedValue(() => {
		scale.value = withSpring(isFocused ? 1.05 : 1, {
			damping: 25,
			stiffness: 120,
			mass: 0.8,
		});

		iconTranslateY.value = withTiming(isFocused ? -8 : 0, {
			duration: 400,
			easing: Easing.inOut(Easing.ease),
		});

		textOpacity.value = withTiming(isFocused ? 1 : 0, {
			duration: 350,
			easing: Easing.inOut(Easing.ease),
		});

		textTranslateY.value = withTiming(isFocused ? 0 : 10, {
			duration: 400,
			easing: Easing.inOut(Easing.ease),
		});
	}, [isFocused]);

	const handlePressIn = () => {
		scale.value = withSpring(0.97, {
			damping: 30,
			stiffness: 300,
		});
	};

	const handlePressOut = () => {
		scale.value = withSpring(isFocused ? 1.05 : 1, {
			damping: 25,
			stiffness: 120,
			mass: 0.8,
		});
	};

	const animatedContainerStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	const animatedIconStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: iconTranslateY.value }],
		};
	});

	const animatedTextStyle = useAnimatedStyle(() => {
		return {
			opacity: textOpacity.value,
			transform: [{ translateY: textTranslateY.value }],
		};
	});

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			className="flex-1 items-center justify-center py-2"
		>
			<Animated.View style={animatedContainerStyle} className="items-center justify-center h-16">
				{/* Icon container with slide animation */}
				<Animated.View style={animatedIconStyle} className="items-center justify-center h-12 w-12">
					<tabInfo.icon size={24} color={isFocused ? theme.colors.text : theme.colors.primary} />
				</Animated.View>

				{/* Label with slide up and fade animation */}
				<Animated.View style={animatedTextStyle} className="absolute bottom-0 items-center w-full">
					<Text
						className="text-xs font-medium text-center"
						style={{ color: theme.colors.text }}
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{label}
					</Text>
				</Animated.View>
			</Animated.View>
		</Pressable>
	);
}
