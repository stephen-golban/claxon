import { Redirect } from "expo-router";
import { isEmpty } from "lodash";
import { WelcomeScreen } from "@/screens/protected/welcome";
import { useGetMe } from "@/services/api/accounts";

export default function Page() {
  const { data } = useGetMe(false);

  if (!isEmpty(data?.email)) {
    return <Redirect href="/tabs" />;
  }

  return <WelcomeScreen />;
}
