import { create } from "zustand";

interface IProgrammaticGoBack {
	goBack?: () => void;
	isHidden: boolean;
}

export const useProgrammaticGoBack = create<IProgrammaticGoBack>((set) => ({
	isHidden: false,
	goBack: undefined,
}));
