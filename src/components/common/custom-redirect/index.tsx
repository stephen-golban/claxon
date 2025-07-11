import { useFocusEffect, useRouter } from "expo-router";
import type { Href } from "expo-router/build/types";
import { useCallback } from "react";
import { FullScreenLoader } from "../full-screen-loader";

interface ICustomRedirect {
  href: Href;
}

const CustomRedirect: React.FC<ICustomRedirect> = ({ href }) => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      router.replace(href);
    }, [href, router]),
  );

  return <FullScreenLoader />;
};

export { CustomRedirect };
