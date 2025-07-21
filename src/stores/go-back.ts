import { create } from "zustand";

interface AppState {
  pathname: string;
  goBack: (() => void) | null;
  hideGoBack: boolean;
}

export const useGoBackStore = create<AppState>(() => ({
  pathname: "",
  goBack: null,
  hideGoBack: false,
}));
