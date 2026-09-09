import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { c as Package, d as ChevronRight, f as ChartColumn, t as Wallet } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { a as getShops, u as updateBusiness } from "./ledger-DEZuFrDL.mjs";
import { n as Input, t as Field } from "./input-DOqfzTzL.mjs";
import { t as AppShell } from "./app-shell-BldccHYd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-DLlkj9p2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MorePage() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["shops"],
		queryFn: () => getShops()
	});
	const [biz, setBiz] = (0, import_react.useState)("");
	const [shopNames, setShopNames] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setBiz(data.business.name);
		setShopNames(data.shops.map((s) => ({
			id: s.id,
			name: s.name
		})));
	}, [data]);
	const mut = useMutation({
		mutationFn: () => updateBusiness({ data: {
			businessName: biz,
			shops: shopNames
		} }),
		onSuccess: async () => {
			await qc.invalidateQueries();
			toast.success("Saved");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "More"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Bales, spending, reports and shop names."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreLink, {
						to: "/bales",
						icon: Package,
						label: "Bales",
						hint: "What you bought in bulk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreLink, {
						to: "/expenses",
						icon: Wallet,
						label: "Expenses",
						hint: "Transport, rent, packing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreLink, {
						to: "/reports",
						icon: ChartColumn,
						label: "Reports",
						hint: "Today, this week, this month"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Shop names"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						mut.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Business name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: biz,
								onChange: (e) => setBiz(e.target.value),
								required: true
							})
						}),
						shopNames.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: `Shop ${i + 1}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.name,
								onChange: (e) => setShopNames((all) => all.map((x) => x.id === s.id ? {
									...x,
									name: e.target.value
								} : x)),
								required: true
							})
						}, s.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: mut.isPending,
							children: mut.isPending ? "Saving…" : "Save names"
						})
					]
				})]
			})
		]
	});
}
function MoreLink({ to, icon: Icon, label, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "border-b border-border last:border-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to,
			className: "flex min-h-16 items-center gap-3 px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 place-items-center rounded-xl bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-5",
						strokeWidth: 1.8
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm text-muted",
						children: hint
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 text-faint" })
			]
		})
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MorePage, {}) });
//#endregion
export { SplitComponent as component };
