import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-store-LfrQ1e4d.js
/** null = all shops */
var useShopFilter = create((set) => ({
	shopId: null,
	setShopId: (shopId) => set({ shopId })
}));
//#endregion
export { useShopFilter as t };
