import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "expo-status-bar";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "@/components/ui/toast";
import { useColorScheme } from "@/hooks";
import { DARK_THEME, LIGHT_THEME } from "@/lib/constants";
import TanstackClerkProvider from "./tanstack-clerk";

interface AppProvidersProps extends React.PropsWithChildren {
	onLayout?: () => void;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
	const { isDark } = useColorScheme();

	return (
		<TanstackClerkProvider>
			<ThemeProvider value={isDark ? DARK_THEME : LIGHT_THEME}>
				<SafeAreaProvider initialMetrics={initialWindowMetrics}>
					<KeyboardProvider>
						<GestureHandlerRootView style={{ flex: 1 }}>
							<BottomSheetModalProvider>
								<SystemBars style="auto" />
								<StatusBar style="auto" animated />
								{children}
								<PortalHost />
								<ToastProvider />
							</BottomSheetModalProvider>
						</GestureHandlerRootView>
					</KeyboardProvider>
				</SafeAreaProvider>
			</ThemeProvider>
		</TanstackClerkProvider>
	);
};

export default AppProviders;
