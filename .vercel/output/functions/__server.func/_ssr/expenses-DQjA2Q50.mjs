import { o as __toESM } from "../_runtime.mjs";
import { c as todayIso, r as formatNaira } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as Wallet } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as EXPENSE_CATEGORIES } from "./constants-CSFo1eyC.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { a as getShops, n as deleteExpense, s as listExpenses, t as createExpense } from "./ledger-DEZuFrDL.mjs";
import { n as Input, r as NativeSelect, t as Field } from "./input-DOqfzTzL.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
import { t as ShopPills } from "./shop-pills-vZr7lp4Y.mjs";
import { t as AppShell } from "./app-shell-BldccHYd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-DQjA2Q50.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExpensesPage() {
	const shopId = useShopFilter((s) => s.shopId);
	const qc = useQueryClient();
	const shops = useQuery({
		queryKey: ["shops"],
		queryFn: () => getShops()
	});
	const { data, isPending } = useQuery({
		queryKey: ["expenses", shopId],
		queryFn: () => listExpenses({ data: { shopId } })
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [category, setCategory] = (0, import_react.useState)(EXPENSE_CATEGORIES[0]);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [spentAt, setSpentAt] = (0, import_react.useState)(todayIso());
	const [notes, setNotes] = (0, import_react.useState)("");
	const [expShop, setExpShop] = (0, import_react.useState)(shopId ?? "");
	const mut = useMutation({
		mutationFn: () => createExpense({ data: {
			shopId: expShop || shopId || shops.data?.shops[0]?.id || null,
			category,
			amount: Number(amount),
			spentAt,
			notes
		} }),
		onSuccess: async () => {
			await qc.invalidateQueries();
			toast.success("Expense saved");
			setAmount("");
			setNotes("");
			setOpen(false);
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: (id) => deleteExpense({ data: { id } }),
		onSuccess: () => qc.invalidateQueries()
	});
	const total = (data ?? []).reduce((a, e) => a + e.amount, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Expenses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Transport, rent, packing, staff…"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setOpen((v) => !v),
					children: "Add"
				})]
			}),
			shops.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopPills, { shops: shops.data.shops }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Shown total"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "money text-3xl",
					children: formatNaira(total)
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				onSubmit: (e) => {
					e.preventDefault();
					mut.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "What kind?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							children: EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount (₦)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: amount,
							onChange: (e) => setAmount(e.target.value.replace(/[^\d]/g, "")),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Shop",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: expShop || shops.data?.shops[0]?.id || "",
							onChange: (e) => setExpShop(e.target.value),
							children: shops.data?.shops.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: s.name
							}, s.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: spentAt,
							onChange: (e) => setSpentAt(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Note",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							placeholder: "Optional"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: mut.isPending || !amount,
						children: mut.isPending ? "Saving…" : "Save expense"
					})
				]
			}) : null,
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper" }) : !data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, {
					className: "size-10",
					strokeWidth: 1.4
				}),
				title: "No expenses yet",
				hint: "Write down transport, rent and the little costs so profit is true."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
				children: data.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center justify-between gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: e.category
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							e.spentAt,
							e.shopName ? ` · ${e.shopName}` : "",
							e.notes ? ` · ${e.notes}` : ""
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "money text-lg",
							children: formatNaira(e.amount)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs font-semibold text-muted",
							onClick: () => del.mutate(e.id),
							children: "Remove"
						})]
					})]
				}, e.id))
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensesPage, {}) });
//#endregion
export { SplitComponent as component };
