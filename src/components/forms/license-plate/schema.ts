import { z } from "zod";

import type { LicensePlateType } from "@/lib/constants";
import { stringifyObjectValidate } from "@/lib/utils";

// Complete schema for vehicle plate
export const schema = (leftLength: number, rightLength: number) =>
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
  });

export type LicensePlateFormData = z.infer<ReturnType<typeof schema>> & {
  type: LicensePlateType;
};
