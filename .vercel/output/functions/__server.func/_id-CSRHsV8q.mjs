import { r as formatNaira } from "./_ssr/utils-DhFUnFCj.mjs";
import { y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { m as ArrowLeft, o as Shirt, s as Plus } from "./_libs/lucide-react.mjs";
import { o as Route$8 } from "./_ssr/router-v_4pl9av.mjs";
import { t as ClothPhoto } from "./_ssr/cloth-photo-I59xF1t-.mjs";
import { t as Empty } from "./_ssr/empty-inSjgfx_.mjs";
import { t as Badge } from "./_ssr/badge-CASRzmVc.mjs";
import { t as Button } from "./_ssr/button-CDvKYGyv.mjs";
import { i as getBale } from "./_ssr/inventory-CRzQucNw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CSRHsV8q.js
var import_jsx_runtime = require_jsx_runtime();
function BaleDetail() {
	const { id } = Route$8.useParams();
	const { data, isPending } = useQuery({
		queryKey: ["bale", id],
		queryFn: () => getBale({ data: { id } })
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-3xl bg-paper" });
	const bale = data?.bale;
	if (!bale) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: ["Bale not found. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/bales",
			children: "Back"
		})]
	});
	const avg = bale.pieces > 0 ? bale.purchasePrice / bale.pieces : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/bales",
					className: "grid size-11 place-items-center rounded-full bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl",
						children: bale.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							bale.shopName,
							" · ",
							bale.purchasedAt
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Purchase cost"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "money text-2xl",
						children: formatNaira(bale.purchasePrice)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Avg per piece"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "money text-2xl",
						children: formatNaira(avg)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"You have recorded ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-ink",
						children: bale.recorded
					}),
					" of",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-ink",
						children: bale.pieces
					}),
					" pieces.",
					bale.sold ? ` ${bale.sold} already sold.` : ""
				]
			}),
			bale.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted",
				children: bale.notes
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/clothes/new",
					search: { bale: bale.id },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Add a piece from this bale"]
				})
			}),
			!data.clothes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, {
					className: "size-10",
					strokeWidth: 1.4
				}),
				title: "Nothing sorted yet",
				hint: "Open the bale and add each cloth with a photo and a price."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-2 gap-3",
				children: data.clothes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/clothes/$id",
					params: { id: c.id },
					className: "block overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClothPhoto, {
						photo: c.photo,
						color: c.color,
						className: "aspect-[3/4] w-full",
						alt: c.description
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-2 text-sm font-semibold",
							children: c.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: c.status === "available" ? "good" : "neutral",
								children: c.status === "available" ? "In shop" : "Sold"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "money",
								children: formatNaira(c.sellingPrice)
							})]
						})]
					})]
				}) }, c.id))
			})
		]
	});
}
//#endregion
export { BaleDetail as component };
