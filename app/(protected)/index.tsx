import { Redirect } from "expo-router";
import { FullScreenLoader } from "@/components/common";
import { WelcomeScreen } from "@/screens/protected/welcome";
import { useGetMe } from "@/services/api/accounts";

export default function Page() {
  const { data, isLoading } = useGetMe();

  if (isLoading || !data) {
    return <FullScreenLoader />;
  }

  if (data.is_setup_finished) {
    return <Redirect href="/(protected)/search" />;
  }

  return <WelcomeScreen data={data} />;
}
