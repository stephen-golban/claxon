import type {
	NativeStackHeaderLeftProps,
	NativeStackHeaderRightProps,
} from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { BellIcon, MoveLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useCurrentUser, useUnreadClaxonCount } from "@/services/api";
import { ProfileAvatar } from "../profile-avatar";
import { ThemeSwitcher } from "../theme-switcher";

const HeaderLeft = (_props: NativeStackHeaderLeftProps): ReactNode => {
	const router = useRouter();

	const canGoBack = router.canGoBack();

	if (!canGoBack) {
		return null;
	}

	return (
		<Button
			size="icon"
			variant="ghost"
			onPress={() => router.back()}
			className="active:bg-transparent my-4"
		>
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
	const { data: user, isPending, isLoading } = useCurrentUser();
	const { data: unreadCount } = useUnreadClaxonCount();

	return (
		<View className="flex-row items-center gap-3 py-4">
			<ThemeSwitcher />
			<Button
				size="icon"
				variant="ghost"
				onPress={() => {}}
				className="active:bg-transparent relative"
			>
				<BellIcon className="text-primary" size={24} />
				{unreadCount && unreadCount.count > 0 && (
					<View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
						<Text className="text-xs text-white font-bold">
							{unreadCount.count > 99 ? "99+" : unreadCount.count.toString()}
						</Text>
					</View>
				)}
			</Button>
			<ProfileAvatar data={user} isLoading={isLoading || isPending} />
		</View>
	);
};

export const ProtectedHeader = {
	headerLeft: HeaderLeft,
	headerRight: HeaderRight,
	headerTitleStyle,
	headerBackground,
};
