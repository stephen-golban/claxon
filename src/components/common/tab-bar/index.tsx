import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Car, Mail, Search, User } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks";
import { DARK_THEME, LIGHT_THEME } from "@/lib/constants";
import { TabBarItem } from "./tab-bar-item";
import type { TabInfo } from "./type";

const tabs: TabInfo[] = [
  { name: "search", title: "Search", icon: Search },
  { name: "inbox", title: "Inbox", icon: Mail },
  { name: "my-cars", title: "My Car", icon: Car },
  { name: "account", title: "Account", icon: User },
];

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDark } = useColorScheme();
  const THEME = isDark ? DARK_THEME : LIGHT_THEME;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: insets.bottom,
        borderTopColor: THEME.colors.border,
        backgroundColor: THEME.colors.background,
      }}
      className="flex-row items-center justify-around border-t min-h-[60px] pt-3"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const tabInfo = tabs.find((tab) => tab.name === route.name);
        if (!tabInfo) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.name}
            theme={THEME}
            tabInfo={tabInfo}
            onPress={onPress}
            isFocused={isFocused}
            label={label as string}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}
