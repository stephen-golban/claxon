import { useMemo } from "react";
import { LICENSE_PLATE_TYPES, type LicensePlateType } from "@/lib/constants";
import type { PlateSection } from "./type";

export const usePlateSections = (type: LicensePlateType): PlateSection[] => {
	return useMemo((): PlateSection[] => {
		const standardPlates = Object.entries(LICENSE_PLATE_TYPES.cars.standard).map(([key, plate]) => ({
			key,
			value: `cars.standard.${key}` as LicensePlateType,
			image: plate.image,
			isSelected: type === `cars.standard.${key}`,
		}));

		// Governmental plates are now part of special plates
		const governmentalPlateKeys = ["diplomatic", "presidential", "government", "mai"];
		const governmentalPlates = governmentalPlateKeys.map((key) => {
			const plate = LICENSE_PLATE_TYPES.cars.special[key as keyof typeof LICENSE_PLATE_TYPES.cars.special];
			return {
				key,
				value: `cars.special.${key}` as LicensePlateType,
				image: plate.image,
				isSelected: type === `cars.special.${key}`,
			};
		});

		// Special plates excluding governmental ones
		const specialPlateKeys = ["fa", "temporary", "transit"];
		const specialPlates = specialPlateKeys.map((key) => {
			const plate = LICENSE_PLATE_TYPES.cars.special[key as keyof typeof LICENSE_PLATE_TYPES.cars.special];
			return {
				key,
				value: `cars.special.${key}` as LicensePlateType,
				image: plate.image,
				isSelected: type === `cars.special.${key}`,
			};
		});

		const transnistriaPlate = {
			key: "transnistria",
			value: "cars.regional.transnistria" as LicensePlateType,
			image: LICENSE_PLATE_TYPES.cars.regional.transnistria.image,
			isSelected: type === "cars.regional.transnistria",
		};

		return [
			{ title: "Standard Plates", data: standardPlates },
			{ title: "Governmental Plates", data: governmentalPlates },
			{ title: "Special Plates", data: specialPlates },
			{ title: "Regional Plates", data: [transnistriaPlate] },
		];
	}, [type]);
};
