import _ from "lodash";
import type { LicensePlateType } from "@/lib/constants";
import { LICENSE_PLATE_TYPES } from "@/lib/constants";
import type { VehiclePlate } from "@/typings/vehicle";
import { schema } from "./schema";

export const createResolver = (type: LicensePlateType) => {
  const plate = _.get(LICENSE_PLATE_TYPES, type);
  if (!plate) return schema(3, 3);

  const isStandard = plate.value.includes("standard");
  const rightLength = isStandard ? 1 : plate.maskRight.value.length || 0;

  return schema(plate.maskLeft.value.length, rightLength);
};

export const createDefaultValues = (data?: Partial<VehiclePlate> | null) => {
  if (!data) {
    return {
      plate: {
        left: "",
        right: "",
      },
    };
  }

  return {
    plate: {
      left: data?.plate_left_part || "",
      right: data?.plate_right_part || "",
    },
  };
};
