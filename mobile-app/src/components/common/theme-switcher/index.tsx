import React from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/hooks";

export function ThemeSwitcher() {
	const { isDark, toggleColorScheme } = useColorScheme();

	const Icon = isDark ? SunIcon : MoonIcon;

	return (
		<Button size="icon" variant="ghost" onPress={toggleColorScheme}>
			<Icon size={24} className="text-foreground" />
		</Button>
	);
}
