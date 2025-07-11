export const VEHICLE_COLORS = [
	{ code: "WHI", description: "White", rgba: "rgba(255, 255, 255, 1)" },
	{ code: "BLK", description: "Black", rgba: "rgba(0, 0, 0, 1)" },
	{ code: "GRY", description: "Gray", rgba: "rgba(128, 128, 128, 1)" },
	{
		code: "SIL",
		description: "Silver/Aluminum",
		rgba: "rgba(192, 192, 192, 1)",
	},
	{ code: "BLU", description: "Blue", rgba: "rgba(0, 0, 255, 1)" },
	{ code: "RED", description: "Red", rgba: "rgba(255, 0, 0, 1)" },
	{ code: "GRN", description: "Green", rgba: "rgba(0, 128, 0, 1)" },
	{ code: "YEL", description: "Yellow", rgba: "rgba(255, 255, 0, 1)" },
	{ code: "ONG", description: "Orange", rgba: "rgba(255, 165, 0, 1)" },
	{ code: "PNK", description: "Pink", rgba: "rgba(255, 192, 203, 1)" },
	{ code: "PUR", description: "Purple", rgba: "rgba(128, 0, 128, 1)" },
	{ code: "BRZ", description: "Bronze", rgba: "rgba(205, 127, 50, 1)" },
	{ code: "BGE", description: "Beige", rgba: "rgba(245, 245, 220, 1)" },
	{ code: "MAR", description: "Burgundy (Maroon)", rgba: "rgba(128, 0, 0, 1)" },
	{ code: "CRM", description: "Cream/Ivory", rgba: "rgba(255, 253, 208, 1)" },
	{ code: "CAM", description: "Camouflage", rgba: null },
	{ code: "MUL", description: "Multicolored", rgba: null },
] as const;

export const LICENSE_PLATE_TYPES = {
	cars: {
		standard: {
			default: {
				maskLeft: { value: "ABC" },
				maskRight: { value: "123" },
				value: "standard-default",
				image: require("@/assets/images/plates/cars/standard/default.png"),
			},
			old_four: {
				maskLeft: { value: "AB CD" },
				maskRight: { value: "123" },
				value: "standard-old-four",
				image: require("@/assets/images/plates/cars/standard/old-four.png"),
			},
			capital_c: {
				maskLeft: { value: "AB", nonEditableText: "C" },
				maskRight: { value: "123" },
				value: "standard-capital-c",
				image: require("@/assets/images/plates/cars/standard/capital-c.png"),
			},
			capital_k: {
				maskLeft: { value: "AB", nonEditableText: "K" },
				maskRight: { value: "123" },
				value: "standard-capital-k",
				image: require("@/assets/images/plates/cars/standard/capital-k.png"),
			},
			public_transport: {
				maskLeft: { value: "ABC" },
				maskRight: { value: "123" },
				value: "standard-public-transport",
				image: require("@/assets/images/plates/cars/standard/public-transport.png"),
			},
			neutral: {
				maskLeft: { value: "ABC" },
				maskRight: { value: "123" },
				value: "standard-neutral",
				image: require("@/assets/images/plates/cars/standard/neutral.png"),
			},
		},
		regional: {
			transnistria: {
				maskLeft: { value: "123", nonEditableText: "T" },
				maskRight: { value: "AB" },
				value: "transnistria",
				image: require("@/assets/images/plates/cars/regional/transnistria.png"),
			},
		},
		special: {
			diplomatic: {
				maskLeft: { value: "123", nonEditableText: "CD" },
				maskRight: { value: "AB" },
				value: "special-diplomatic",
				image: require("@/assets/images/plates/cars/special/diplomatic.png"),
			},
			presidential: {
				maskLeft: { value: "RM", nonEditableText: "RM" },
				maskRight: { value: "1234" },
				value: "special-presidential",
				image: require("@/assets/images/plates/cars/special/presidential.png"),
			},
			government: {
				maskLeft: { value: "RMG", nonEditableText: "RMG" },
				maskRight: { value: "123" },
				value: "special-government",
				image: require("@/assets/images/plates/cars/special/government.png"),
			},
			mai: {
				maskLeft: { value: "MAI", nonEditableText: "MAI" },
				maskRight: { value: "1234" },
				value: "special-mai",
				image: require("@/assets/images/plates/cars/special/mai.png"),
			},
			fa: {
				maskLeft: { value: "FA", nonEditableText: "FA" },
				maskRight: { value: "1234" },
				value: "special-fa",
				image: require("@/assets/images/plates/cars/special/fa.png"),
			},
			temporary: {
				maskLeft: { value: "H", nonEditableText: "H" },
				maskRight: { value: "1234" },
				value: "special-temporary",
				image: require("@/assets/images/plates/cars/special/temporary.png"),
			},
			transit: {
				maskLeft: { value: "P", nonEditableText: "P" },
				maskRight: { value: "1234" },
				value: "special-transit",
				image: require("@/assets/images/plates/cars/special/transit.png"),
			},
		},
	},
};

export type LicensePlateType =
	| "cars.standard.default"
	| "cars.standard.neutral"
	| "cars.standard.old_four"
	| "cars.standard.capital_c"
	| "cars.standard.capital_k"
	| "cars.standard.public_transport"
	| "cars.regional.transnistria"
	| "cars.special.diplomatic"
	| "cars.special.presidential"
	| "cars.special.government"
	| "cars.special.mai"
	| "cars.special.fa"
	| "cars.special.temporary"
	| "cars.special.transit";
