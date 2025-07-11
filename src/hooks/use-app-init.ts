import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";

interface UseAppInitOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	dependencies?: unknown[];
	initializationTasks?: (Promise<unknown> | (() => Promise<unknown>))[];
}

export function useAppInit({
	onError,
	onSuccess,
	dependencies = [],
	initializationTasks = [],
}: UseAppInitOptions = {}) {
	const [error, setError] = useState<Error>();
	const [isReady, setIsReady] = useState(false);

	async function initialize() {
		try {
			await Promise.all(
				initializationTasks.map((task) =>
					typeof task === "function"
						? (task as () => Promise<unknown>)()
						: task,
				),
			);

			// Add 500ms delay before setting ready state
			await new Promise((resolve) => setTimeout(resolve, 500));

			setIsReady(true);
			onSuccess?.();
		} catch (e) {
			const error = e instanceof Error ? e : new Error("Initialization failed");
			setError(error);
			onError?.(error);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: We need to re-run the initialization tasks when the dependencies change
	useEffect(() => {
		initialize();
	}, [...dependencies]);

	const handleLayoutReady = useCallback(async () => {
		if (isReady) {
			try {
				await SplashScreen.hideAsync();
			} catch (e) {
				console.warn("Error hiding splash screen:", e);
			}
		}
	}, [isReady]);

	return {
		isReady,
		error,
		handleLayoutReady,
	};
}
