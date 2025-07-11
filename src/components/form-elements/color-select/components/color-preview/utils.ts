import type { SharedValue } from "react-native-reanimated";
import {
	type WithTimingConfig,
	withSequence,
	withTiming,
} from "react-native-reanimated";

/**
 * Default scale animation configuration for feedback
 */
const FEEDBACK_TIMING_CONFIG: WithTimingConfig = {
	duration: 100,
};

/**
 * Provides a scale animation feedback when a color is selected
 *
 * @param scale - The scale shared value to animate
 */
export const provideFeedbackAnimation = (scale: SharedValue<number>): void => {
	scale.value = withSequence(
		withTiming(0.95, FEEDBACK_TIMING_CONFIG),
		withTiming(1.03, FEEDBACK_TIMING_CONFIG),
		withTiming(1, FEEDBACK_TIMING_CONFIG),
	);
};

/**
 * Array of color codes where white text would have poor contrast
 * Used to determine when to use dark text instead of white text
 */
export const LIGHT_COLORS = [
	"BGE", // Beige
	"CRM", // Cream/Ivory
	"PNK", // Pink
	"SIL", // Silver/Aluminum
	"WHI", // White
	"YEL", // Yellow
];
