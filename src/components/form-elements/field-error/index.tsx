import type React from "react";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface IFieldError {
	message: string;
	className?: string;
}

const FieldError: React.FC<IFieldError> = ({ message, className }) => {
	return (
		<Animated.View
			entering={FadeIn.duration(200)}
			exiting={FadeOut.duration(50)}
		>
			<Text className={cn("text-sm text-destructive", className)}>
				{message}
			</Text>
		</Animated.View>
	);
};

export { FieldError };
