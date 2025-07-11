import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  const mode = colorScheme ?? "dark";
  const isDark = colorScheme === "dark";

  return {
    mode,
    isDark,
    setColorScheme,
    toggleColorScheme,
  };
}
