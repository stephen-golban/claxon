import type { LicensePlateType } from "@/lib/constants";

export type BaseRenderPlateProps = {
	left: string;
	right: string;
	maskLeft?: {
		value: string;
		nonEditableText?: string;
	};
	maskRight?: {
		value: string;
	};
	disabled?: boolean;
	type: LicensePlateType;
	onLeftChange: (text: string) => void;
	onRightChange: (text: string) => void;
};

export type RenderPlateProps = Omit<BaseRenderPlateProps, "maskLeft" | "maskRight" | "disabled">;
