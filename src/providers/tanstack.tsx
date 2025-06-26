import { focusManager, onlineManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Network from "expo-network";
import React from "react";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";

interface ITanstackQueryClientProvider extends React.PropsWithChildren {}

function onNetworkStatusChange(state: Network.NetworkState) {
  onlineManager.setOnline(!!state.isConnected);
}

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const TanstackQueryClientProvider: React.FC<ITanstackQueryClientProvider> = ({ children }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    const networkSubscription = Network.addNetworkStateListener(onNetworkStatusChange);

    return () => {
      subscription.remove();
      networkSubscription.remove();
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanstackQueryClientProvider;
