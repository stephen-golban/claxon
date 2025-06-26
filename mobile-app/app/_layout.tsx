import { useAuth } from "@clerk/clerk-expo";
import {
	Nunito_400Regular,
	Nunito_700Bold,
	useFonts,
} from "@expo-google-fonts/nunito";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
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
	const router = useRouter();
	const pathname = usePathname();
	const segments = useSegments();
	const { isSignedIn, isLoaded } = useAuth();

	const inProtectedRoute =
		segments[0] === "(protected)" || pathname.includes("/(protected)");

	// biome-ignore lint/correctness/useExhaustiveDependencies: we need to check if the user is signed in and if they are in a protected route
	React.useEffect(() => {
		if (!isLoaded) return;

		if (isSignedIn && !inProtectedRoute) {
			router.replace("/(protected)");
		} else if (!isSignedIn && inProtectedRoute) {
			router.replace("/");
		}
	}, [isSignedIn, isLoaded, inProtectedRoute]);

	if (!isLoaded) {
		return null;
	}

	return <Stack screenOptions={{ headerShown: false }} />;
};
