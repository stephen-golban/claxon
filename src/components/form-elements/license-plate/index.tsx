import _ from "lodash";
import type React from "react";

import { LICENSE_PLATE_TYPES } from "@/lib/constants";
import { BasePlate } from "./base-plate";
import type { BaseRenderPlateProps } from "./type";

/**
 * A component that renders the appropriate license plate based on the specified type.
 * This is the main entry point for using license plates in the application.
 */
const LicensePlateField: React.FC<BaseRenderPlateProps> = ({
	type,
	...props
}) => {
	const common = { type, ...props };

	const plate = _.get(LICENSE_PLATE_TYPES, type);

	return (
		<BasePlate
			{...common}
			maskLeft={plate.maskLeft}
			maskRight={plate.maskRight}
		/>
	);
};

LicensePlateField.displayName = "LicensePlateField";

export { LicensePlateField };
