import { useLocalSearchParams } from "expo-router";
import VerifyPhoneScreen from "@/screens/unprotected/verify-phone";

export default function Verify() {
  const { phone } = useLocalSearchParams();
  return <VerifyPhoneScreen phone={phone as string} />;
}
