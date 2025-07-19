import { Redirect, useLocalSearchParams } from "expo-router";
import { useMount } from "@/hooks";
import CreateLicensePlateScreen from "@/screens/protected/vehicle/create/license-plate";
import { useGoBackStore } from "@/stores/go-back";

export default function CreateLicensePlate() {
  const { id } = useLocalSearchParams<{ id: string }>();

  useMount(() => useGoBackStore.setState({ hideGoBack: true }));

  if (!id) {
    return <Redirect href="/vehicle/create" />;
  }

  return <CreateLicensePlateScreen id={id} />;
}
