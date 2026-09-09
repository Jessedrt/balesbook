import { r as formatNaira } from "./_ssr/utils-DhFUnFCj.mjs";
import { x as useNavigate, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/react+tanstack__react-query.mjs";
import { a as ShoppingBag, i as Trash2, m as ArrowLeft } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as Route$5 } from "./_ssr/router-v_4pl9av.mjs";
import { t as ClothPhoto } from "./_ssr/cloth-photo-I59xF1t-.mjs";
import { t as Badge } from "./_ssr/badge-CASRzmVc.mjs";
import { t as Button } from "./_ssr/button-CDvKYGyv.mjs";
import { a as getCloth, r as deleteCloth } from "./_ssr/inventory-CRzQucNw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-De3OpQLc.js
var import_jsx_runtime = require_jsx_runtime();
function ClothDetail() {
	const { id } = Route$5.useParams();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data, isPending } = useQuery({
		queryKey: ["cloth", id],
		queryFn: () => getCloth({ data: { id } })
	});
	const del = useMutation({
		mutationFn: () => deleteCloth({ data: { id } }),
		onSuccess: async () => {
			await qc.invalidateQueries();
			toast.success("Removed");
			navigate({ to: "/clothes" });
		}
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 animate-pulse rounded-3xl bg-paper" });
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: ["This cloth is gone. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/clothes",
			children: "Back to clothes"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-lg flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/clothes",
					className: "grid size-11 place-items-center rounded-full bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "flex-1 font-display text-2xl leading-tight",
					children: data.description
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClothPhoto, {
				photo: data.photo,
				color: data.color,
				category: data.category,
				alt: data.description,
				className: "aspect-[3/4] w-full rounded-3xl"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: data.status === "available" ? "good" : "neutral",
						children: data.status === "available" ? "Available" : "Sold"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: data.shopName }),
					data.size ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["Size ", data.size] }) : null,
					data.color ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: data.color }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Selling price"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "money text-3xl",
						children: formatNaira(data.sellingPrice)
					}),
					data.cost > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"About ",
							formatNaira(data.cost),
							" from the bale",
							data.baleName ? ` (${data.baleName})` : ""
						]
					}) : null
				]
			}),
			data.status === "available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/sales/new",
						search: { cloth: data.id },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {}), " Sell this"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					className: "text-danger",
					onClick: () => {
						if (confirm("Remove this cloth from the shop?")) del.mutate();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), " Remove"]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Sold",
					data.soldAt ? ` on ${data.soldAt}` : "",
					"."
				]
			})
		]
	});
}
//#endregion
export { ClothDetail as component };
