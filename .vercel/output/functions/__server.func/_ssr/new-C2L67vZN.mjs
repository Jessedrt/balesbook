import { o as __toESM } from "../_runtime.mjs";
import { c as todayIso } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { m as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { t as createBale } from "./inventory-CRzQucNw.mjs";
import { a as getShops } from "./ledger-DEZuFrDL.mjs";
import { i as Textarea, n as Input, r as NativeSelect, t as Field } from "./input-DOqfzTzL.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-C2L67vZN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewBale() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const shops = useQuery({
		queryKey: ["shops"],
		queryFn: () => getShops()
	});
	const shopFilter = useShopFilter((s) => s.shopId);
	const [name, setName] = (0, import_react.useState)("");
	const [shopId, setShopId] = (0, import_react.useState)(shopFilter ?? "");
	const [purchasedAt, setPurchasedAt] = (0, import_react.useState)(todayIso());
	const [price, setPrice] = (0, import_react.useState)("");
	const [pieces, setPieces] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const resolvedShop = shopId || shops.data?.shops[0]?.id || "";
	const avg = Number(price) > 0 && Number(pieces) > 0 ? Number(price) / Number(pieces) : 0;
	const mut = useMutation({
		mutationFn: () => createBale({ data: {
			shopId: resolvedShop,
			name: name.trim(),
			purchasedAt,
			purchasePrice: Number(price),
			pieces: Number(pieces),
			notes
		} }),
		onSuccess: async (res) => {
			await qc.invalidateQueries();
			toast.success("Bale saved");
			navigate({
				to: "/bales/$id",
				params: { id: res.id }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto flex max-w-lg flex-col gap-4",
		onSubmit: (e) => {
			e.preventDefault();
			mut.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/bales",
					className: "grid size-11 place-items-center rounded-full bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "New bale"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Bale name / number",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Bale #003",
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Which shop?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: resolvedShop,
					onChange: (e) => setShopId(e.target.value),
					children: shops.data?.shops.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.name
					}, s.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Date purchased",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: purchasedAt,
					onChange: (e) => setPurchasedAt(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Purchase price (₦)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: price,
						onChange: (e) => setPrice(e.target.value.replace(/[^\d]/g, "")),
						placeholder: "250000",
						required: true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Number of pieces",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: pieces,
						onChange: (e) => setPieces(e.target.value.replace(/[^\d]/g, "")),
						placeholder: "80",
						required: true
					})
				})]
			}),
			avg > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary",
				children: ["Average cost per piece: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold",
					children: ["₦", Math.round(avg).toLocaleString("en-NG")]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Notes",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					placeholder: "Where it came from, quality…"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				disabled: mut.isPending || !name || !price || !pieces,
				children: mut.isPending ? "Saving…" : "Save bale"
			})
		]
	});
}
//#endregion
export { NewBale as component };
