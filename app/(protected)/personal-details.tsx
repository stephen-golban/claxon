import { Stack } from "expo-router";
import PersonalDetailsScreen from "@/screens/protected/personal-details";

export default function PersonalDetails() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PersonalDetailsScreen />
    </>
  );
}
