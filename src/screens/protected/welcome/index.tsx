import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import type React from "react";
import { View } from "react-native";

import { Container } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { supabase } from "@/services/api/client";

interface IWelcomeScreen {
	loading: boolean;
}

const WelcomeScreen: React.FC<IWelcomeScreen> = ({ loading }) => {
	const router = useRouter();

	return (
		<Container loading={loading} removeEdges={[]}>
			<Container.TopText
				title="Welcome to Claxon!"
				subtitle="Choose how you'd like to get started. You can explore the app right away or register your car to receive claxons."
			/>
			<Button onPress={() => supabase.auth.signOut()}>
				<Text>Logout</Text>
			</Button>

			<View className="flex-1 items-center justify-center">
				<LottieView
					autoPlay
					loop
					source={require("@/assets/animations/claxon.lottie")}
					style={{ width: 250, height: 250, alignSelf: "center" }}
				/>
			</View>
			<View className="gap-4">
				<Button
					onPress={() => router.push("/tabs")}
					variant="default"
					size="lg"
					className="rounded-full"
				>
					<Text>Explore the app</Text>
				</Button>

				<Button
					onPress={() => router.push("/tabs/my-cars")}
					variant="outline"
					size="lg"
					className="rounded-full"
				>
					<Text>Register your first car</Text>
				</Button>
			</View>
		</Container>
	);
};

export { WelcomeScreen };
