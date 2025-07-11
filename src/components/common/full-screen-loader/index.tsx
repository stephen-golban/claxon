import LottieView from "lottie-react-native";
import type React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

interface IFullScreenLoader extends React.PropsWithChildren {
  noSafeArea?: boolean;
  className?: string;
  spinnerColor?: string;
  disableBackground?: boolean;
}

const FullScreenLoader: React.FC<IFullScreenLoader> = ({
  className,
  children,
  noSafeArea,
  disableBackground = false,
}) => {
  const Wrapper = noSafeArea ? View : SafeAreaView;

  return (
    <Wrapper
      style={[StyleSheet.absoluteFillObject]}
      className={cn("z-50 flex-1 items-center justify-center", !disableBackground && "bg-background", className)}
    >
      <LottieView
        source={require("@/assets/animations/loading.lottie")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      {children}
    </Wrapper>
  );
};

export { FullScreenLoader };
