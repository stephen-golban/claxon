import React, { useMemo } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import type { Edge, Edges } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { EmptyState } from "../empty-state";
import { FullScreenLoader } from "../full-screen-loader";
import TopText from "./top-text";

interface IContainer extends React.PropsWithChildren {
  className?: string;
  removeEdges?: Edge[];
  removePX?: boolean;
  loading?: boolean;
  isEmpty?: boolean;
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
  isEmpty = false,
}) => {
  const edges = useMemo(() => EDGES.filter((edge) => !removeEdges?.includes(edge)), [removeEdges]);

  const { hasTopText, topTextChild } = useMemo(() => {
    if (!isEmpty) return { hasTopText: false, topTextChild: null };

    const childrenArray = React.Children.toArray(children);
    const topText = childrenArray.find((child) => React.isValidElement(child) && child.type === TopText);

    return {
      hasTopText: !!topText,
      topTextChild: topText,
    };
  }, [isEmpty, children]);

  const content = useMemo(() => {
    if (isEmpty) {
      if (hasTopText) {
        return (
          <>
            {topTextChild}
            <EmptyState title="No data" description="No data found" />
          </>
        );
      }
      return <EmptyState title="No data" description="No data found" />;
    }
    return children;
  }, [isEmpty, hasTopText, topTextChild, children]);

  return (
    <SafeAreaView edges={edges} style={style} className="flex-1">
      <View className={cn("flex-1 pt-10 bg-background px-5 pb-2", className, removePX && "px-0")}>
        {loading ? <FullScreenLoader /> : content}
      </View>
    </SafeAreaView>
  );
};

const Container = Object.assign(_Container, {
  TopText,
});

export { Container };
