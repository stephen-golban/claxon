import { create } from "zustand";

interface AppState {
  pathname: string;
  goBack: () => void;
  hideGoBack: boolean;
}

export const useGoBackStore = create<AppState>(() => ({
  pathname: "",
  goBack: () => {},
  hideGoBack: false,
}));
