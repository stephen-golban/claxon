import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateEffect } from "@/hooks";
import { LICENSE_PLATE_TYPES, type LicensePlateType } from "@/lib/constants";
import type { VehiclePlate } from "@/typings/vehicle";
import type { SearchVehiclePlateFormData } from "./schema";
import { createDefaultValues, createResolver } from "./util";

/**
 * Custom hook for managing the vehicle plate form
 *
 * @param initialData - Optional initial data for the form
 * @returns Form handling tools and validation state
 */

export default function useVehiclePlateForm(
	initialData?: Partial<VehiclePlate> | null,
) {
	const [type, setType] = useState<LicensePlateType>("cars.standard.default");

	const resolver = zodResolver(createResolver(type));
	const defaultValues = createDefaultValues(initialData);

	const formMethods = useForm<Omit<SearchVehiclePlateFormData, "type">>({
		resolver,
		defaultValues,
		mode: "onChange",
	});
	useUpdateEffect(() => {
		const initialValues = createDefaultValues();
		formMethods.reset(initialValues);
	}, [type]);
	// Reset the form with new data if needed
	const resetForm = useCallback(
		(data?: Partial<VehiclePlate>) => {
			const initialValues = createDefaultValues(data);
			formMethods.reset(initialValues);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[formMethods.reset],
	);

	return {
		type,
		setType,
		resetForm,
		...formMethods,
	};
}
