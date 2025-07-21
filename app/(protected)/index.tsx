import { Redirect } from "expo-router";
import { FullScreenLoader } from "@/components/common";
import { isProfileComplete } from "@/lib/utils";
import { WelcomeScreen } from "@/screens/protected/welcome";
import { useGetAccountStatistics, useGetMe } from "@/services/api/accounts";

export default function Page() {
  const me = useGetMe();
  const statistics = useGetAccountStatistics();

  const meLoading = me.isLoading || me.isPending;
  const statisticsLoading = statistics.isLoading || statistics.isPending;

  if (meLoading || statisticsLoading) {
    return <FullScreenLoader />;
  }

  const isSetupFinished = me.data ? isProfileComplete(me.data) : false;
  const vehicleCount = statistics.data ? statistics.data.vehicleCount : 0;

  if (isSetupFinished && vehicleCount > 0) {
    return <Redirect href="/(protected)/tabs" />;
  }

  return <WelcomeScreen isSetupFinished={isSetupFinished} vehicleCount={vehicleCount} />;
}
