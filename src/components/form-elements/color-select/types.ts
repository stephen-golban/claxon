import type { VEHICLE_COLORS } from "@/lib/constants";

export type VehicleColor = (typeof VEHICLE_COLORS)[number];

export type VehicleColorCode = VehicleColor["code"];
export type ColorNavigationDirection = "left" | "right";

export interface BaseColorSelectFieldProps {
  label?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
}

export interface ColorOptionProps {
  color: VehicleColor;
  isSelected: boolean;
  onSelect: (colorCode: string) => void;
  disabled?: boolean;
}

export interface ColorFieldProps {
  value: string;
  onChange: (value: string) => void;
  onOpenPicker: () => void;
  disabled?: boolean;
  selectedColor: VehicleColor | undefined;
  className?: string;
}

export interface ColorBottomSheetProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  selectedColor: VehicleColor | undefined;
  disabled?: boolean;
  isOpen: boolean;
}
