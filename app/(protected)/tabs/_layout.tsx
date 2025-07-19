import { Tabs } from "expo-router";
import { TabBar } from "@/components/common";
import { getProtectedHeader } from "@/components/common/headers";

export default function ProtectedTabsLayout() {
  const header = getProtectedHeader();

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={header}>
      <Tabs.Screen name="index" options={{ title: "Search" }} />
      <Tabs.Screen name="my-cars" options={{ title: "My Cars" }} />
      <Tabs.Screen name="claxons" options={{ title: "Claxons" }} />
    </Tabs>
  );
}
