import { Redirect } from "expo-router";
import { FullScreenLoader } from "@/components/common";
import { WelcomeScreen } from "@/screens/protected/welcome";
import { useGetAccountStatistics, useGetMe } from "@/services/api/accounts";

export default function Page() {
  const me = useGetMe();
  const statistics = useGetAccountStatistics();

  if (me.isLoading || statistics.isLoading || !me.data || !statistics.data) {
    return <FullScreenLoader />;
  }

  if (me.data.is_setup_finished) {
    return <Redirect href="/(protected)/tabs" />;
  }

  const vehicleCount = statistics.data.vehicleCount || 0;

  return <WelcomeScreen data={me.data} vehicleCount={vehicleCount} />;
}
