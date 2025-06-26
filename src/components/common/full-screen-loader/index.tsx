import type React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../loading-spinner";

interface IFullScreenLoader extends React.PropsWithChildren {
	noSafeArea?: boolean;
	className?: string;
	spinnerColor?: string;
	disableBackground?: boolean;
}

const FullScreenLoader: React.FC<IFullScreenLoader> = ({
	className,
	children,
	noSafeArea,
	disableBackground = false,
	spinnerColor,
}) => {
	const Wrapper = noSafeArea ? View : SafeAreaView;

	return (
		<Wrapper
			style={[StyleSheet.absoluteFillObject]}
			className={cn("z-10 flex-1 items-center justify-center", !disableBackground && "bg-background", className)}
		>
			<LoadingSpinner className="-mt-20" color={spinnerColor} />
			{children}
		</Wrapper>
	);
};

export { FullScreenLoader };
