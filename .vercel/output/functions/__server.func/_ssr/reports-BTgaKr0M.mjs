import { o as __toESM } from "../_runtime.mjs";
import { r as formatNaira } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as getShops, i as getReport } from "./ledger-DEZuFrDL.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
import { t as ShopPills } from "./shop-pills-vZr7lp4Y.mjs";
import { t as AppShell } from "./app-shell-BldccHYd.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-BTgaKr0M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const shopId = useShopFilter((s) => s.shopId);
	const [period, setPeriod] = (0, import_react.useState)("daily");
	const shops = useQuery({
		queryKey: ["shops"],
		queryFn: () => getShops()
	});
	const { data, isPending } = useQuery({
		queryKey: [
			"report",
			period,
			shopId
		],
		queryFn: () => getReport({ data: {
			period,
			shopId
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Reports"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Plain numbers. No accounting talk."
			})] }),
			shops.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopPills, { shops: shops.data.shops }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					"daily",
					"weekly",
					"monthly"
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPeriod(p),
					className: period === p ? "h-10 rounded-full bg-primary px-4 text-sm font-semibold capitalize text-primary-fg" : "h-10 rounded-full bg-surface px-4 text-sm font-semibold capitalize shadow-[var(--shadow-card)]",
					children: p === "daily" ? "Today" : p === "weekly" ? "This week" : "This month"
				}, p))
			}),
			isPending || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-3xl bg-paper" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Sales",
							value: formatNaira(data.sales)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Expenses",
							value: formatNaira(data.expenses)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Profit",
							value: formatNaira(data.profit)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Items sold",
							value: String(data.itemsSold)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Money collected",
							value: formatNaira(data.collected)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Customers owing",
							value: formatNaira(data.outstanding),
							danger: data.outstanding > 0
						})
					]
				}),
				data.byDay.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-display text-xl",
						children: "Sales and spending"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: data.byDay,
								barGap: 4,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tickFormatter: (d) => String(d).slice(8),
										tick: {
											fill: "#6F675C",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v) => formatNaira(Number(v)),
										labelFormatter: (l) => String(l),
										contentStyle: {
											background: "#FBF6EC",
											border: "1px solid #E0D4C2",
											borderRadius: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sales",
										fill: "#1E5843",
										radius: [
											6,
											6,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "expenses",
										fill: "#9A3B30",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}) : null,
				data.categories.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl",
					children: "What sold best"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
					children: data.categories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: c.category
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [c.count, " sold"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "money",
							children: formatNaira(c.sales)
						})]
					}, c.category))
				})] }) : null,
				shopId === null && data.shopStats.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl",
					children: "Shop by shop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: data.shopStats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: ["Sales ", formatNaira(s.sales)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["Expenses ", formatNaira(s.expenses)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "money mt-1 text-xl",
								children: [formatNaira(s.profit), " profit"]
							})
						]
					}, s.id))
				})] }) : null
			] })
		]
	});
}
function Stat({ label, value, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `money mt-1 text-2xl ${danger ? "text-danger" : ""}`,
			children: value
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsPage, {}) });
//#endregion
export { SplitComponent as component };
