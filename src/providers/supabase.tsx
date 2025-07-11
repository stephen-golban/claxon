import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "@/services/api/client";
import { setAppStoreKey } from "@/stores/app";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SupabaseProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAppStoreKey("isAuthenticated", !!session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setAppStoreKey("isAuthenticated", !!session);
    });
  }, []);

  return children;
};

export default SupabaseProvider;
