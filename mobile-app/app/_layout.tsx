import {
	Nunito_400Regular,
	Nunito_700Bold,
	useFonts,
} from "@expo-google-fonts/nunito";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { CustomSplashScreen } from "@/components/common";
import { useAppInit } from "@/hooks";
import AppProviders from "@/providers";
import { useAppStore } from "@/stores/app";
import { initI18n } from "@/translations";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
	const currentLanguage = useAppStore((state) => state.language);
	const [loaded, error] = useFonts({
		Nunito: Nunito_400Regular,
		Nunito_Bold: Nunito_700Bold,
	});

	const { isReady, handleLayoutReady } = useAppInit({
		dependencies: [loaded],
		initializationTasks: [() => initI18n(currentLanguage)],
	});

	React.useEffect(() => {
		if (error) throw error;
	}, [error]);

	return (
		<AppProviders>
			{!isReady ? (
				<CustomSplashScreen shouldFadeOut />
			) : (
				<Animated.View
					entering={FadeIn.duration(300)}
					style={{ flex: 1 }}
					onLayout={handleLayoutReady}
				>
					<RootLayoutNav />
				</Animated.View>
			)}
		</AppProviders>
	);
}

const RootLayoutNav = () => {
	const isAuthenticated = useAppStore((state) => state.isAuthenticated);

	return (
		<Stack
			screenOptions={{ headerShown: false }}
			initialRouteName="(unprotected)"
		>
			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="(protected)" />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="(unprotected)" />
			</Stack.Protected>
		</Stack>
	);
};
