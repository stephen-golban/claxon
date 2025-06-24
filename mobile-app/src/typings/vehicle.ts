import type { LicensePlateType } from "@/lib/constants";

export type VehiclePlate = {
  plate_country: string;
  plate_left_part: string;
  plate_right_part: string;
  plate_number: string;
  plate_type: LicensePlateType;
};
