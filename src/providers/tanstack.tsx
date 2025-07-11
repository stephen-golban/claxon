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

  // Reset query cache every 5 minutes
  // React.useEffect(() => {
  //   const interval = setInterval(
  //     () => {
  //       console.log("Clearing query cache");
  //       queryClient.clear();
  //     },
  //     0.1 * 60 * 1000,
  //   ); // 0.1 minutes

  //   return () => clearInterval(interval);
  // }, [queryClient]);

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
