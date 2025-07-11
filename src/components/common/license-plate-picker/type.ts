import type React from "react";
import type { LicensePlateType } from "@/lib/constants";

export interface ILicensePlatePicker extends React.PropsWithChildren {
  type: LicensePlateType;
  onTypeChange: (type: LicensePlateType) => void;
}

export interface PlateItem {
  key: string;
  value: LicensePlateType;
  image: number;
  isSelected: boolean;
}

export interface PlateSection {
  title: string;
  data: PlateItem[];
}
