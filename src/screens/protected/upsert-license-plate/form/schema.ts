import _ from "lodash";
import { z } from "zod";
import { LICENSE_PLATE_TYPES, type LicensePlateType } from "@/lib/constants";
import { stringifyObjectValidate } from "@/lib/utils";
import type { Vehicle } from "@/services/api/vehicles";

// License plate form validation schema
export const upsertLicensePlateSchema = (leftLength: number, rightLength: number) =>
  z.object({
    plate: z.object({
      left: z.string().min(leftLength, stringifyObjectValidate({ keyT: "errors:required" })),
      right: z
        .string()
        .min(rightLength, stringifyObjectValidate({ keyT: "errors:required" }))
        .refine(
          (val) => !/^0+$/.test(val),
          stringifyObjectValidate({
            keyT: "errors:plateNumberCannotBeZeroOnly",
          }),
        ),
    }),
    plate_type: z.string().min(1, stringifyObjectValidate({ keyT: "errors:required" })) as z.ZodType<LicensePlateType>,
  });

export type UpsertLicensePlateFormData = z.infer<ReturnType<typeof upsertLicensePlateSchema>> & {
  plate_type: LicensePlateType;
};

const schemaValues: UpsertLicensePlateFormData = {
  plate_type: "cars.standard.default",
  plate: {
    left: "",
    right: "",
  },
};

export const createDefaultValues = (vehicle?: Vehicle | undefined) => {
  if (!vehicle) {
    return schemaValues;
  }
  return {
    plate_type: (vehicle.plate_type || schemaValues.plate_type) as LicensePlateType,
    plate: {
      left: vehicle.plate_left_part || schemaValues.plate.left,
      right: vehicle.plate_right_part || schemaValues.plate.right,
    },
  };
};

export const createResolver = (type: LicensePlateType) => {
  const plate = _.get(LICENSE_PLATE_TYPES, type);
  if (!plate) {
    return upsertLicensePlateSchema(3, 3);
  }

  const leftLength = plate.maskLeft?.value?.length || 3;
  const rightLength = plate.maskRight?.value?.length || 3;

  return upsertLicensePlateSchema(leftLength, rightLength);
};
