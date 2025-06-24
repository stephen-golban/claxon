import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/hooks";

import { ToastProvider } from "@/components/ui/toast";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { SystemBars } from "react-native-edge-to-edge";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TanstackClerkProvider from "./tanstack-clerk";

import { DARK_THEME, LIGHT_THEME } from "@/lib/constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initialWindowMetrics } from "react-native-safe-area-context";

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
