import { Redirect, Stack } from "expo-router";
import { ProtectedHeader } from "@/components/common/headers";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
	const { headerLeft, ...header } = ProtectedHeader;

	const isAuthenticated = useAppStore((state) => state.isAuthenticated);

	if (!isAuthenticated) {
		return <Redirect href="/(unprotected)" />;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				...header,
				headerLeft: (props) => headerLeft(props),
			}}
		/>
	);
}
