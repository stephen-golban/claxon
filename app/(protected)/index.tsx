import { isEmpty } from "lodash";
import { CustomRedirect } from "@/components/common";
import { WelcomeScreen } from "@/screens/protected/welcome";
import { useGetMe } from "@/services/api/accounts";

export default function Page() {
  const { data } = useGetMe();

  if (!isEmpty(data?.email)) {
    return <CustomRedirect href="/tabs" />;
  }

  return <WelcomeScreen />;
}
