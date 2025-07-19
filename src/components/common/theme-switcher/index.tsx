import * as Haptics from "expo-haptics";
import { MoonIcon, SunIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/hooks";

export function ThemeSwitcher() {
  const { isDark, toggleColorScheme } = useColorScheme();

  const Icon = isDark ? SunIcon : MoonIcon;

  const handleToggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleColorScheme();
  };

  return (
    <Button size="icon" variant="ghost" onPress={handleToggleTheme}>
      <Icon size={20} className="text-foreground" />
    </Button>
  );
}
