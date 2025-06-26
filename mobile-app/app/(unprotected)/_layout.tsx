import { Stack } from "expo-router";
import { UnprotectedHeader } from "@/components/common/headers";

export default function UnprotectedLayout() {
	const { headerLeft, ...header } = UnprotectedHeader;

	return <Stack screenOptions={{ headerShown: true, ...header, headerLeft: () => headerLeft(true) }} />;
}
