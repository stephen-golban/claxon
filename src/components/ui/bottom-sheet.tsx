import type { BottomSheetBackdropProps, BottomSheetFooterProps as GBottomSheetFooterProps } from "@gorhom/bottom-sheet";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetFlatList as GBottomSheetFlatList,
  BottomSheetFooter as GBottomSheetFooter,
  BottomSheetTextInput as GBottomSheetTextInput,
  BottomSheetView as GBottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useTheme as useNavigationTheme } from "@react-navigation/native";
import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { type GestureResponderEvent, Keyboard, Pressable, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XIcon } from "@/components/icons";
import { useColorScheme } from "@/hooks";
import { cn } from "@/lib/utils";
import { Button } from "./button";

// TODO: refactor and move to UI
// TODO: create web component, use https://ui.shadcn.com/docs/components/drawer

type BottomSheetRef = React.ComponentRef<typeof View>;
type BottomSheetProps = React.ComponentPropsWithoutRef<typeof View>;

interface BottomSheetContext {
  sheetRef: React.RefObject<BottomSheetModal>;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const BottomSheetContext = React.createContext({} as BottomSheetContext);

const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(({ ...props }, ref) => {
  const sheetRef = React.useRef<BottomSheetModal>(null);

  return (
    <BottomSheetContext.Provider value={{ sheetRef: sheetRef as React.RefObject<BottomSheetModal> }}>
      <View ref={ref} {...props} />
    </BottomSheetContext.Provider>
  );
});

BottomSheet.displayName = "BottomSheet";

function useBottomSheetContext() {
  const context = React.useContext(BottomSheetContext);
  if (!context) {
    throw new Error("BottomSheet compound components cannot be rendered outside the BottomSheet component");
  }
  return context;
}

const CLOSED_INDEX = -1;

type BottomSheetContentRef = React.ComponentRef<typeof BottomSheetModal>;

type BottomSheetContentProps = Omit<React.ComponentPropsWithoutRef<typeof BottomSheetModal>, "backdropComponent"> & {
  backdropProps?: Partial<React.ComponentPropsWithoutRef<typeof BottomSheetBackdrop>>;
};

const BottomSheetContent = React.forwardRef<BottomSheetContentRef, BottomSheetContentProps>(
  (
    {
      enablePanDownToClose = true,
      enableDynamicSizing = true,
      index = 0,
      backdropProps,
      backgroundStyle,
      android_keyboardInputMode = "adjustResize",
      ...props
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const { isDark } = useColorScheme();
    const { sheetRef } = useBottomSheetContext();
    const { colors } = useNavigationTheme();

    React.useImperativeHandle(ref, () => {
      if (!sheetRef.current) {
        return {} as BottomSheetModalMethods;
      }
      return sheetRef.current;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetRef.current]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: we need to use the backdropProps
    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => {
        const {
          pressBehavior = "close",
          opacity = isDark ? 0.3 : 0.7,
          disappearsOnIndex = CLOSED_INDEX,
          style,
          onPress,
          ...rest
        } = {
          ...props,
          ...backdropProps,
        };
        return (
          <BottomSheetBackdrop
            opacity={opacity}
            disappearsOnIndex={disappearsOnIndex}
            pressBehavior={pressBehavior}
            style={[
              {
                backgroundColor: !isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.3)",
              },
              style,
            ]}
            onPress={() => {
              if (Keyboard.isVisible()) {
                Keyboard.dismiss();
              }
              onPress?.();
            }}
            {...rest}
          />
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [backdropProps],
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={enableDynamicSizing}
        backgroundStyle={[{ backgroundColor: colors.background }, backgroundStyle]}
        handleIndicatorStyle={{
          backgroundColor: colors.text,
        }}
        topInset={insets.top}
        android_keyboardInputMode={android_keyboardInputMode}
        {...props}
      />
    );
  },
);

BottomSheetContent.displayName = "BottomSheetContent";

const BottomSheetOpenTrigger = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & {
    asChild?: boolean;
  }
>(({ onPress, asChild = false, ...props }, ref) => {
  const { sheetRef } = useBottomSheetContext();
  function handleOnPress(ev: GestureResponderEvent) {
    sheetRef.current?.present();
    onPress?.(ev);
  }
  const Trigger = asChild ? Slot.Pressable : Pressable;
  return <Trigger ref={ref} onPress={handleOnPress} {...props} />;
});

BottomSheetOpenTrigger.displayName = "BottomSheetOpenTrigger";

const BottomSheetCloseTrigger = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & {
    asChild?: boolean;
  }
>(({ onPress, asChild = false, ...props }, ref) => {
  const { dismiss } = useBottomSheetModal();
  function handleOnPress(ev: GestureResponderEvent) {
    dismiss();
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
    onPress?.(ev);
  }
  const Trigger = asChild ? Slot.Pressable : Pressable;
  return <Trigger ref={ref} onPress={handleOnPress} {...props} />;
});

BottomSheetCloseTrigger.displayName = "BottomSheetCloseTrigger";

const BOTTOM_SHEET_HEADER_HEIGHT = 60; // BottomSheetHeader height

type BottomSheetViewProps = Omit<React.ComponentPropsWithoutRef<typeof GBottomSheetView>, "style"> & {
  hadHeader?: boolean;
  style?: ViewStyle;
};

function BottomSheetView({ className, children, hadHeader = true, style, ...props }: BottomSheetViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <GBottomSheetView
      style={[
        {
          paddingBottom: insets.bottom + (hadHeader ? BOTTOM_SHEET_HEADER_HEIGHT : 0),
        },
        style,
      ]}
      className={cn("px-4", className)}
      {...props}
    >
      {children}
    </GBottomSheetView>
  );
}

type BottomSheetTextInputRef = React.ComponentRef<typeof GBottomSheetTextInput>;
type BottomSheetTextInputProps = React.ComponentPropsWithoutRef<typeof GBottomSheetTextInput>;
const BottomSheetTextInput = React.forwardRef<BottomSheetTextInputRef, BottomSheetTextInputProps>(
  ({ className, placeholderClassName, ...props }, ref) => {
    return (
      <GBottomSheetTextInput
        ref={ref}
        className={cn(
          "rounded-md border border-input bg-background px-3 text-xl h-14 leading-[1.25] items-center placeholder:text-muted-foreground disabled:opacity-50",
          className,
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  },
);

BottomSheetTextInput.displayName = "BottomSheetTextInput";

type BottomSheetFlatListRef = React.ComponentRef<typeof GBottomSheetFlatList>;
type BottomSheetFlatListProps = React.ComponentPropsWithoutRef<typeof GBottomSheetFlatList>;
const BottomSheetFlatList = React.forwardRef<BottomSheetFlatListRef, BottomSheetFlatListProps>(
  ({ className, ...props }, ref) => {
    const insets = useSafeAreaInsets();
    return (
      <GBottomSheetFlatList
        ref={ref}
        contentContainerStyle={[{ paddingBottom: insets.bottom }]}
        className={cn("py-4", className)}
        keyboardShouldPersistTaps="handled"
        {...props}
      />
    );
  },
);

BottomSheetFlatList.displayName = "BottomSheetFlatList";

type BottomSheetHeaderRef = React.ComponentRef<typeof View>;
type BottomSheetHeaderProps = React.ComponentPropsWithoutRef<typeof View>;
const BottomSheetHeader = React.forwardRef<BottomSheetHeaderRef, BottomSheetHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { dismiss } = useBottomSheetModal();
    function close() {
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
      }
      dismiss();
    }
    return (
      <View
        ref={ref}
        className={cn("border-b border-border flex-row items-center justify-between pl-4", className)}
        {...props}
      >
        {children}
        <Button onPress={close} variant="ghost" className="pr-4">
          <XIcon className="text-muted-foreground" size={24} />
        </Button>
      </View>
    );
  },
);

BottomSheetHeader.displayName = "BottomSheetHeader";

type BottomSheetFooterRef = React.ComponentRef<typeof View>;
type BottomSheetFooterProps = Omit<React.ComponentPropsWithoutRef<typeof View>, "style"> & {
  bottomSheetFooterProps: GBottomSheetFooterProps;
  children?: React.ReactNode;
  style?: ViewStyle;
};

/**
 * To be used in a useCallback function as a props to BottomSheetContent
 */
const BottomSheetFooter = React.forwardRef<BottomSheetFooterRef, BottomSheetFooterProps>(
  ({ bottomSheetFooterProps, children, className, style, ...props }, ref) => {
    const insets = useSafeAreaInsets();
    return (
      <GBottomSheetFooter {...bottomSheetFooterProps}>
        <View
          ref={ref}
          style={[{ paddingBottom: insets.bottom + 6 }, style]}
          className={cn("px-4 pt-1.5", className)}
          {...props}
        >
          {children}
        </View>
      </GBottomSheetFooter>
    );
  },
);

BottomSheetFooter.displayName = "BottomSheetFooter";

function useBottomSheet() {
  const ref = React.useRef<BottomSheetContentRef>(null);

  const open = React.useCallback(() => {
    // Use requestAnimationFrame to avoid accessing shared values during render
    requestAnimationFrame(() => {
      ref.current?.present();
    });
  }, []);

  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return { ref, open, close };
}

export {
  BottomSheet,
  BottomSheetCloseTrigger,
  BottomSheetContent,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetOpenTrigger,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheet,
};
