import { useCallback } from "react";

export function usePhoneInput() {
	const formatPhoneNumber = useCallback((text: string) => {
		// Remove any non-digit characters
		const cleaned = text.replace(/\D/g, "");
		// Limit to 8 digits (Moldova mobile numbers are 8 digits after country code)
		const truncated = cleaned.slice(0, 8);
		// Format the number with spaces (XXX XX XXX)
		const formatted = truncated.replace(
			/^(\d{3})(\d{1,2})?(\d{1,3})?$/,
			(_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join(" "),
		);
		return formatted;
	}, []);

	return {
		formatPhoneNumber,
	};
}
