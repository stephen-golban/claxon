import type { NativeStackHeaderRightProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "../theme-switcher";

const HeaderLeft = (showBackButton: boolean, onBack?: () => void): ReactNode => {
	const router = useRouter();
	const canGoBack = router.canGoBack();

	if (!showBackButton || !canGoBack) {
		return <View />;
	}

	const handleBack = onBack || router.back;

	return (
		<Button size="icon" variant="ghost" onPress={handleBack} className="my-3 items-start">
			<MoveLeftIcon className="text-primary" size={24} />
		</Button>
	);
};

const headerTitleStyle: StyleProp<
	Pick<TextStyle, "fontFamily" | "fontSize" | "fontWeight"> & {
		color?: string;
	}
> = {
	color: "transparent",
};

const headerBackground = () => <View className="bg-background" />;

const HeaderRight = (_props: NativeStackHeaderRightProps): ReactNode => {
	return (
		<View className="flex-row items-center gap-x-4 py-3">
			{/* <LanguageSwitcher /> */}
			<ThemeSwitcher />
		</View>
	);
};

export const UnprotectedHeader = {
	headerLeft: (showBackButton: boolean, onBack?: () => void) => HeaderLeft(showBackButton, onBack),
	headerRight: HeaderRight,
	headerTitleStyle,
	headerBackground,
};
