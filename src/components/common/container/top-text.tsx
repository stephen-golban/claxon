import type React from "react";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface ITopText {
	title: string;
	center?: boolean;
	subtitle: string | React.JSX.Element;
}

const TopText: React.FC<ITopText> = ({ title, subtitle, center = false }) => {
	return (
		<>
			<Text className={cn("mb-4 text-4xl font-bold", center && "text-center")}>
				{title}
			</Text>
			<Text
				className={cn(
					"mb-8 text-base text-foreground",
					center && "text-center",
				)}
			>
				{subtitle}
			</Text>
		</>
	);
};

export default TopText;
