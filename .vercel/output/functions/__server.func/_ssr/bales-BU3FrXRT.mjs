import { r as formatNaira } from "./utils-DhFUnFCj.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { c as Package, s as Plus } from "../_libs/lucide-react.mjs";
import { t as Empty } from "./empty-inSjgfx_.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { o as listBales } from "./inventory-CRzQucNw.mjs";
import { a as getShops } from "./ledger-DEZuFrDL.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
import { t as ShopPills } from "./shop-pills-vZr7lp4Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bales-BU3FrXRT.js
var import_jsx_runtime = require_jsx_runtime();
function BalesPage() {
	const shopId = useShopFilter((s) => s.shopId);
	const shops = useQuery({
		queryKey: ["shops"],
		queryFn: () => getShops()
	});
	const { data, isPending } = useQuery({
		queryKey: ["bales", shopId],
		queryFn: () => listBales({ data: { shopId } })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Bales"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "What you bought, still being sorted."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/bales/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " New bale"]
					})
				})]
			}),
			shops.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopPills, { shops: shops.data.shops }) : null,
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper" }) : !data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
					className: "size-10",
					strokeWidth: 1.4
				}),
				title: "No bales yet",
				hint: "When a new bale arrives, write it down here — price, pieces, which shop.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bales/new",
						children: "Add a bale"
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: data.map((b) => {
					const avg = b.pieces > 0 ? b.purchasePrice / b.pieces : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/bales/$id",
						params: { id: b.id },
						className: "block rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl",
								children: b.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									b.shopName,
									" · ",
									b.purchasedAt
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "money text-lg",
								children: formatNaira(b.purchasePrice)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 grid grid-cols-3 gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Pieces"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold",
									children: b.pieces
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Recorded"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-semibold",
									children: [
										b.recorded,
										"/",
										b.pieces
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Avg cost"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold",
									children: formatNaira(avg)
								})] })
							]
						})]
					}) }, b.id);
				})
			})
		]
	});
}
//#endregion
export { BalesPage as component };
