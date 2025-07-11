import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

export function ErrorScreen() {
  return (
    <View style={StyleSheet.absoluteFillObject} className="flex-1 items-center justify-center bg-background">
      <StatusBar style="auto" animated />
      <LottieView
        source={require("@/assets/animations/error.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text className="text-2xl font-bold">Something went wrong</Text>
    </View>
  );
}
