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
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Consider data fresh for 2 minutes by default
            staleTime: 2 * 60 * 1000,
            // Keep data in cache for 10 minutes by default
            gcTime: 10 * 60 * 1000,
            // Retry failed requests once by default
            retry: 1,
            // Don't refetch on window focus for better performance
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect unless data is stale
            refetchOnReconnect: "always",
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      }),
  );

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
