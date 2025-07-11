import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";
import { useColorScheme } from "@/hooks";

interface LoadingSpinnerProps extends Omit<ActivityIndicatorProps, "size"> {
  inverse?: boolean;
  size?: "small" | "large" | number;
}

export function LoadingSpinner({ size = "small", color, inverse = false, ...props }: LoadingSpinnerProps) {
  const { isDark } = useColorScheme();
  const isActuallyDark = inverse ? !isDark : isDark;

  const COLOR = color || (isActuallyDark ? "#e5e7eb" : "#1f2937");
  return <ActivityIndicator size={size} color={COLOR} {...props} />;
}
