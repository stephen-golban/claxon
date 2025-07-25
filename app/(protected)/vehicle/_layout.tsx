import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";

export default function VehicleLayout() {
  return (
    <BottomSheetModalProvider>
      <Slot />
    </BottomSheetModalProvider>
  );
}
