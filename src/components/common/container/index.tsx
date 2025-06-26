import type React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import type { Edge, Edges } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { FullScreenLoader } from "../full-screen-loader";
import TopText from "./top-text";

interface IContainer extends React.PropsWithChildren {
  className?: string;
  removeEdges?: Edge[];
  removePX?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const EDGES: Edges = ["top", "right", "bottom", "left"];

const _Container: React.FC<IContainer> = ({
  style,
  children,
  className,
  loading = false,
  removePX = false,
  removeEdges = ["top"],
}) => {
  const edges = EDGES.filter((edge) => !removeEdges?.includes(edge));

  return (
    <SafeAreaView edges={edges} style={style} className="flex-1">
      <View className={cn("flex-1 pt-10 bg-background px-5 pb-2", className, removePX && "px-0")}>{children}</View>
      {loading && <FullScreenLoader />}
    </SafeAreaView>
  );
};

const Container = Object.assign(_Container, {
  TopText,
});

export { Container };
