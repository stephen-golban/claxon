import { Redirect, Tabs } from "expo-router";
import { TabBar } from "@/components/common";
import { getProtectedHeader } from "@/components/common/headers";
import { useAppStore } from "@/stores/app";

export default function ProtectedTabsLayout() {
  const header = getProtectedHeader();

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(unprotected)" />;
  }

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={header}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
      <Tabs.Screen name="my-cars" options={{ title: "My Cars" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
