import { t as cn } from "./utils-DhFUnFCj.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-pills-vZr7lp4Y.js
var import_jsx_runtime = require_jsx_runtime();
function ShopPills({ shops }) {
	const shopId = useShopFilter((s) => s.shopId);
	const setShopId = useShopFilter((s) => s.setShopId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
			active: shopId === null,
			onClick: () => setShopId(null),
			children: "All shops"
		}), shops.map((shop) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
			active: shopId === shop.id,
			onClick: () => setShopId(shop.id),
			children: shop.name
		}, shop.id))]
	});
}
function Pill({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors duration-150", active ? "bg-primary text-primary-fg" : "bg-surface text-ink shadow-[var(--shadow-card)]"),
		children
	});
}
//#endregion
export { ShopPills as t };
