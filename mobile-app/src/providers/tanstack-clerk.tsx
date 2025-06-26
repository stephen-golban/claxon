import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
	throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

// Create QueryClient with standard configuration
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
		},
		mutations: {
			retry: 1,
		},
	},
});

const TanstackClerkProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<ClerkProvider tokenCache={tokenCache} publishableKey={clerkKey}>
			<ClerkLoaded>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</ClerkLoaded>
		</ClerkProvider>
	);
};

export default TanstackClerkProvider;
