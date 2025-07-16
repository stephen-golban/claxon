import { Tabs } from "expo-router";
import { TabBar } from "@/components/common";

export default function ProtectedTabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Search" }} />
      <Tabs.Screen name="my-cars" options={{ title: "My Cars" }} />
      <Tabs.Screen name="claxons" options={{ title: "Claxons" }} />
    </Tabs>
  );
}
