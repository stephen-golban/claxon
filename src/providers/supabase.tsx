import { usePathname } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "@/services/api/client";
import { setAppStoreKey, useAppStore } from "@/stores/app";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SupabaseProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated } = useAppStore();
  console.log("isAuthenticated", isAuthenticated, pathname);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (pathname !== "/verify") {
        setAppStoreKey("isAuthenticated", !!session);
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      if (pathname !== "/verify") {
        setAppStoreKey("isAuthenticated", !!session);
      }
    });
  }, [pathname]);

  return children;
};

export default SupabaseProvider;
