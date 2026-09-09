import { create } from "zustand";

/** null = all shops */
export const useShopFilter = create<{
  shopId: string | null;
  setShopId: (shopId: string | null) => void;
}>((set) => ({
  shopId: null,
  setShopId: (shopId) => set({ shopId }),
}));
