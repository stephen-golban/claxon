import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { APP_CONSTANTS } from "@/lib/constants";

interface AppState {
  language: string | undefined;
  isAuthenticated: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: undefined,
      isAuthenticated: false,
    }),
    {
      name: APP_CONSTANTS.STORAGE.APP,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const setAppStoreKey = (key: keyof AppState, value: AppState[keyof AppState]) => {
  useAppStore.setState({ [key]: value });
};

export const setAppStoreKeys = (keys: Partial<AppState>) => {
  useAppStore.setState(keys);
};

export const resetAppStore = () => {
  useAppStore.setState({ language: undefined, isAuthenticated: false });
};
