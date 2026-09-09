import { o as __toESM } from "../_runtime.mjs";
import { r as formatNaira } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { o as Shirt, s as Plus } from "../_libs/lucide-react.mjs";
import { t as ClothPhoto } from "./cloth-photo-I59xF1t-.mjs";
import { t as Empty } from "./empty-inSjgfx_.mjs";
import { t as Badge } from "./badge-CASRzmVc.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { s as listClothes } from "./inventory-CRzQucNw.mjs";
import { a as getShops } from "./ledger-DEZuFrDL.mjs";
import { n as Input } from "./input-DOqfzTzL.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
import { t as ShopPills } from "./shop-pills-vZr7lp4Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clothes-DKlqiUBR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClothesPage() {
	const shopId = useShopFilter((s) => s.shopId);
	const [status, setStatus] = (0, import_react.useState)("available");
	const [search, setSearch] = (0, import_react.useState)("");
	const shops = useQuery({
		queryKey: ["shops"],
		queryFn: () => getShops()
	});
	const { data, isPending } = useQuery({
		queryKey: [
			"clothes",
			shopId,
			status,
			search
		],
		queryFn: () => listClothes({ data: {
			shopId,
			status,
			search
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "My clothes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Each piece, one by one."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/clothes/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Add"]
					})
				})]
			}),
			shops.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopPills, { shops: shops.data.shops }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search colour, type, description",
				value: search,
				onChange: (e) => setSearch(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					"available",
					"sold",
					"all"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStatus(s),
					className: status === s ? "h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg" : "h-10 rounded-full bg-surface px-4 text-sm font-semibold text-ink shadow-[var(--shadow-card)]",
					children: s === "available" ? "Available" : s === "sold" ? "Sold" : "All"
				}, s))
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[3/4] animate-pulse rounded-3xl bg-paper" }, i))
			}) : !data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, {
					className: "size-10",
					strokeWidth: 1.4
				}),
				title: "No clothes here yet",
				hint: "Add a piece with a photo, or open a bale and start sorting.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/clothes/new",
						children: "Add clothing"
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3",
				children: data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/clothes/$id",
					params: { id: c.id },
					className: "block overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClothPhoto, {
						photo: c.photo,
						color: c.color,
						category: c.category,
						alt: c.description,
						className: "aspect-[3/4] w-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-sm font-semibold leading-snug",
									children: c.description
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: c.status === "available" ? "good" : "neutral",
									children: c.status === "available" ? "In shop" : "Sold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [c.size ? `Size ${c.size} · ` : "", c.shopName]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "money mt-1 text-lg",
								children: formatNaira(c.sellingPrice)
							})
						]
					})]
				}) }, c.id))
			})
		]
	});
}
//#endregion
export { ClothesPage as component };
