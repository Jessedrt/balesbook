import { o as __toESM } from "../_runtime.mjs";
import { c as todayIso, r as formatNaira } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { m as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$1 } from "./router-v_4pl9av.mjs";
import { t as ClothPhoto } from "./cloth-photo-I59xF1t-.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { s as listClothes } from "./inventory-CRzQucNw.mjs";
import { l as recordSale, o as listCustomers } from "./ledger-DEZuFrDL.mjs";
import { n as Input, r as NativeSelect, t as Field } from "./input-DOqfzTzL.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-DYgB_KUS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecordSale() {
	const { cloth: preselect } = Route$1.useSearch();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const shopId = useShopFilter((s) => s.shopId);
	const clothes = useQuery({
		queryKey: [
			"clothes",
			shopId,
			"available",
			""
		],
		queryFn: () => listClothes({ data: {
			shopId,
			status: "available",
			search: ""
		} })
	});
	const customers = useQuery({
		queryKey: ["customers", false],
		queryFn: () => listCustomers({ data: { owingOnly: false } })
	});
	const [clothingId, setClothingId] = (0, import_react.useState)(preselect ?? "");
	const item = (0, import_react.useMemo)(() => clothes.data?.find((c) => c.id === clothingId) ?? null, [clothes.data, clothingId]);
	const [customerId, setCustomerId] = (0, import_react.useState)("");
	const [newName, setNewName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [paid, setPaid] = (0, import_react.useState)("");
	const [soldAt, setSoldAt] = (0, import_react.useState)(todayIso());
	const selling = Number(price) || item?.sellingPrice || 0;
	const paidN = paid === "" ? selling : Number(paid) || 0;
	const outstanding = Math.max(0, selling - paidN);
	const mut = useMutation({
		mutationFn: () => recordSale({ data: {
			clothingId,
			customerId: customerId || null,
			newCustomerName: customerId ? null : newName,
			sellingPrice: selling,
			paid: paidN,
			soldAt,
			notes: ""
		} }),
		onSuccess: async (res) => {
			await qc.invalidateQueries();
			if (res.outstanding > 0) toast.success(`Sold. ${formatNaira(res.outstanding)} still owing.`);
			else toast.success("Sold, fully paid.");
			navigate({ to: "/" });
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
					to: "/",
					className: "grid size-11 place-items-center rounded-full bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Record sale"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Which cloth?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: clothingId,
					onChange: (e) => {
						setClothingId(e.target.value);
						const next = clothes.data?.find((c) => c.id === e.target.value);
						if (next) {
							setPrice(String(next.sellingPrice));
							setPaid(String(next.sellingPrice));
						}
					},
					required: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Choose a piece…"
					}), clothes.data?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: c.id,
						children: [
							c.description,
							" · ",
							c.shopName,
							" · ",
							formatNaira(c.sellingPrice)
						]
					}, c.id))]
				})
			}),
			item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl bg-surface p-2 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClothPhoto, {
					photo: item.photo,
					color: item.color,
					className: "size-20 rounded-xl",
					alt: item.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: item.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [item.shopName, item.size ? ` · Size ${item.size}` : ""]
				})] })]
			}) : null,
			!item && clothes.data && clothes.data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-3 gap-2",
				children: clothes.data.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setClothingId(c.id);
						setPrice(String(c.sellingPrice));
						setPaid(String(c.sellingPrice));
					},
					className: "w-full overflow-hidden rounded-2xl bg-surface text-left shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClothPhoto, {
						photo: c.photo,
						color: c.color,
						className: "aspect-[3/4] w-full",
						alt: c.description
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate px-2 py-1.5 text-xs font-semibold",
						children: c.description
					})]
				}) }, c.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Customer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: customerId,
					onChange: (e) => setCustomerId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Someone new…"
					}), customers.data?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: c.id,
						children: [c.name, c.outstanding > 0 ? ` (owes ${formatNaira(c.outstanding)})` : ""]
					}, c.id))]
				})
			}),
			!customerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "New customer name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: newName,
					onChange: (e) => setNewName(e.target.value),
					placeholder: "Aisha",
					required: !customerId
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Selling price (₦)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: price || (item ? String(item.sellingPrice) : ""),
						onChange: (e) => setPrice(e.target.value.replace(/[^\d]/g, "")),
						required: true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Amount paid (₦)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: paid,
						onChange: (e) => setPaid(e.target.value.replace(/[^\d]/g, "")),
						placeholder: String(selling || "")
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Date",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: soldAt,
					onChange: (e) => setSoldAt(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Total",
						v: formatNaira(selling)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Paid",
						v: formatNaira(paidN)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Outstanding",
						v: formatNaira(outstanding),
						danger: outstanding > 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				disabled: mut.isPending || !clothingId || !customerId && !newName.trim(),
				children: mut.isPending ? "Saving…" : "Save sale"
			})
		]
	});
}
function Row({ k, v, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `money text-lg ${danger ? "text-danger" : ""}`,
			children: v
		})]
	});
}
//#endregion
export { RecordSale as component };
