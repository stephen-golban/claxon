import { Redirect } from "expo-router";
import { isEmpty } from "lodash";
import { FullScreenLoader } from "@/components/common";
import { WelcomeScreen } from "@/screens/protected/welcome";
import { useGetMe } from "@/services/api/accounts";

export default function Page() {
  const { data, isPending } = useGetMe();

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (isEmpty(data?.email)) {
    return <Redirect href="/(protected)/personal-details" />;
  }

  return <WelcomeScreen loading={false} />;
}
