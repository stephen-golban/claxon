import { Redirect, Stack, useSegments } from "expo-router";
import { ProtectedHeader } from "@/components/common/headers";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
	const { headerLeft, ...header } = ProtectedHeader;
	const segments = useSegments() as string[];

	const isAuthenticated = useAppStore((state) => state.isAuthenticated);

	if (!isAuthenticated) {
		return <Redirect href="/(unprotected)" />;
	}

	// Show back button only if route is not index (/) and not personal-details
	// Index route: segments = ["(protected)"]
	// Personal details route: segments = ["(protected)", "personal-details"]
	const isIndexRoute = segments.length === 1 && segments[0] === "(protected)";
	const isPersonalDetailsRoute = segments.some(
		(segment) => segment === "personal-details",
	);
	const showBackButton = !isIndexRoute && !isPersonalDetailsRoute;

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				...header,
				headerLeft: (props) => headerLeft(props, showBackButton),
			}}
		/>
	);
}
