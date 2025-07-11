import type React from "react";
import { Pressable, View } from "react-native";
import { Checkbox } from "@/components/ui/checkbox";
import { useErrorMessageTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import TermsAcceptance from "@/screens/unprotected/terms-acceptance";
import { FieldError } from "../field-error";

interface BaseTermsAcceptanceFieldProps {
	value: boolean;
	onChange: (value: boolean) => void;
	onBlur: () => void;
	error?: string;
	className?: string;
	disabled?: boolean;
	type?: "login" | "signup";
}

const BaseTermsAcceptanceField: React.FC<BaseTermsAcceptanceFieldProps> = ({
	value,
	onChange,
	onBlur,
	error,
	className,
	disabled = false,
	type = "signup",
}) => {
	const errorMessage = useErrorMessageTranslation(error);
	const handlePress = () => {
		if (!disabled) {
			onChange(!value);
		}
	};

	return (
		<View className={cn("gap-y-2", className)}>
			<Pressable
				onPress={handlePress}
				onBlur={onBlur}
				className="flex-row items-center gap-x-3"
				disabled={disabled}
			>
				<Checkbox
					checked={value}
					onCheckedChange={() => {}}
					disabled={disabled}
					className="mt-1"
				/>
				<View className="flex-1 mt-1">
					<TermsAcceptance type={type} center={false} />
				</View>
			</Pressable>
			{errorMessage && <FieldError message={errorMessage} />}
		</View>
	);
};

export default BaseTermsAcceptanceField;
