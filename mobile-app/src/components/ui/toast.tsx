import { cn } from "@/lib/utils";
import { BlurView } from "expo-blur";
import * as React from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { type ToastConfig } from "react-native-toast-message";
import { XIcon } from "../icons";
import { Text } from "./text";

/**
 * Temporary fix for warning when accessing useLayoutEffect on the server. See issue
 * https://github.com/calintamas/react-native-toast-message/issues/530
 */
if (typeof document === "undefined") {
  // @ts-ignore
  React.useLayoutEffect = React.useEffect;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

// Elegant toast animation wrapper component
const AnimatedToast = ({
  children,
  onPress,
  variant = "default",
}: {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "success" | "error" | "warning";
}) => {
  const translateY = React.useRef(new Animated.Value(-20)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity, scale]);

  const getBackgroundGlow = () => {
    switch (variant) {
      case "success":
        return "";
      case "error":
        return "bg-red-500/30";
      case "warning":
        return "bg-yellow-500/50";
      default:
        return "";
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }, { scale }],
        opacity,
        width: SCREEN_WIDTH * 0.92,
        maxWidth: 500,
        alignSelf: "center",
      }}
    >
      <Pressable
        onPress={onPress}
        className={cn("mx-auto mb-3 w-full overflow-hidden", "rounded-xl shadow-lg", getBackgroundGlow())}
      >
        <BlurView intensity={50} tint="dark" className="w-full" experimentalBlurMethod="dimezisBlurView">
          <View className="px-1">{children}</View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
};

// Custom Toast Alert variant that's more elegant
const ToastAlert = ({
  text,
  variant = "default",
  onClose,
}: {
  text: string;
  variant?: "default" | "destructive";
  onClose?: () => void;
}) => {
  return (
    <View className="flex-row items-center px-5 py-4">
      <View className="flex-1">
        <Text className="pl-0 text-base text-white">{text}</Text>
      </View>
      <Pressable
        onPress={onClose}
        className="h-8 w-8 items-center justify-center"
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <XIcon size={16} className="text-white/50" />
      </Pressable>
    </View>
  );
};

/**
 * Custom toast configuration using an elegant design
 */
const TOAST_CONFIG: ToastConfig = {
  success: ({ text1, onPress }) => (
    <AnimatedToast onPress={onPress} variant="success">
      <ToastAlert text={text1 || ""} variant="default" onClose={() => Toast.hide()} />
    </AnimatedToast>
  ),
  error: ({ text1, onPress }) => (
    <AnimatedToast onPress={onPress} variant="error">
      <ToastAlert text={text1 || ""} variant="destructive" onClose={() => Toast.hide()} />
    </AnimatedToast>
  ),
  info: ({ text1, onPress }) => (
    <AnimatedToast onPress={onPress} variant="default">
      <ToastAlert text={text1 || ""} variant="default" onClose={() => Toast.hide()} />
    </AnimatedToast>
  ),
  warning: ({ text1, onPress }) => (
    <AnimatedToast onPress={onPress} variant="warning">
      <ToastAlert text={text1 || ""} variant="default" onClose={() => Toast.hide()} />
    </AnimatedToast>
  ),
};

/**
 * Toast Provider component
 * If you want to use a Toast in a Modal, you will need to add another
 * `ToastProvider` as a child of the Modal.
 */
function ToastProvider() {
  const insets = useSafeAreaInsets();

  return (
    <Toast
      config={TOAST_CONFIG}
      topOffset={insets.top + 10}
      bottomOffset={insets.bottom + 10}
      visibilityTime={6000}
      autoHide={true}
      position="top"
    />
  );
}

/**
 * Toast utility function for displaying toasts
 */
const toast = {
  success: (message: string) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  },
  error: (message: string) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  },
  info: (message: string) => {
    Toast.show({
      type: "info",
      text1: message,
    });
  },
  warning: (message: string) => {
    Toast.show({
      type: "warning",
      text1: message,
    });
  },
};

export { ToastProvider, toast };
