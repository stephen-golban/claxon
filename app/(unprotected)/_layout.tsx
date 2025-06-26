import { Redirect, Stack, useSegments } from "expo-router";
import { UnprotectedHeader } from "@/components/common/headers";
import { useAppStore } from "@/stores/app";

export default function UnprotectedLayout() {
	const { headerLeft, ...header } = UnprotectedHeader;
	const segments = useSegments();

	const isAuthenticated = useAppStore((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Redirect href="/(protected)" />;
	}

	// Show back button only if current route is not "verify"
	const showBackButton = segments[segments.length - 1] !== "verify";

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				...header,
				headerLeft: () => headerLeft(showBackButton),
			}}
		/>
	);
}
