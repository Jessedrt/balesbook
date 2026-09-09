import { i as greetingForHour, n as firstName, r as formatNaira } from "./utils-DhFUnFCj.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as ShoppingBag, c as Package, d as ChevronRight, o as Shirt, t as Wallet } from "../_libs/lucide-react.mjs";
import { t as ClothPhoto } from "./cloth-photo-I59xF1t-.mjs";
import { t as authMiddleware } from "./middleware-DFsrBw6e.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
import { t as ShopPills } from "./shop-pills-vZr7lp4Y.mjs";
import { n as useCurrentUser } from "./mark-C-0iUqEU.mjs";
import { t as AppShell } from "./app-shell-BldccHYd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-9jm_TrHW.js
var import_jsx_runtime = require_jsx_runtime();
var Filter = object({ shopId: string().nullable() });
var getDashboard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(Filter).handler(createSsrRpc("9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12"));
function Dashboard() {
	const user = useCurrentUser();
	const shopId = useShopFilter((s) => s.shopId);
	const { data, isPending } = useQuery({
		queryKey: ["dashboard", shopId],
		queryFn: () => getDashboard({ data: { shopId } })
	});
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const hello = greetingForHour(hour);
	if (isPending || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 animate-pulse rounded-full bg-paper" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-3xl bg-paper" }, i))
		})]
	});
	const name = firstName(user?.displayName) || data.greetingName;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted",
					children: hello
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight md:text-4xl",
					children: name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: data.business.name
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopPills, { shops: data.shops }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Today's sales",
						value: formatNaira(data.todaySales)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Today's expenses",
						value: formatNaira(data.todayExpenses)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Today's profit",
						value: formatNaira(data.todayProfit),
						hint: "Sales minus cloth cost and spending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Customers owing",
						value: formatNaira(data.outstanding),
						danger: data.outstanding > 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-3xl bg-surface px-4 py-3 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted",
					children: "Clothes available"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "money text-2xl",
					children: data.clothesAvailable
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/clothes",
					className: "text-sm font-semibold text-primary",
					children: "See my clothes"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						to: "/sales/new",
						icon: ShoppingBag,
						label: "Record sale",
						primary: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						to: "/clothes/new",
						icon: Shirt,
						label: "Add clothing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						to: "/bales",
						icon: Package,
						label: "Bales"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						to: "/expenses",
						icon: Wallet,
						label: "Expenses"
					})
				]
			}),
			data.owing.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Customers owing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/customers",
					className: "text-sm font-semibold text-primary",
					children: "All people"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
				children: data.owing.slice(0, 5).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: i > 0 ? "border-t border-border" : "",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/customers/$id",
						params: { id: c.id },
						className: "flex min-h-14 items-center justify-between gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 money text-lg text-danger",
							children: [formatNaira(c.outstanding), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-faint" })]
						})]
					})
				}, c.id))
			})] }) : null,
			shopId === null && data.shopStats.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-xl",
				children: "Both shops"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [data.shopStats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Sales",
								v: formatNaira(s.sales)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Expenses",
								v: formatNaira(s.expenses)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Profit",
								v: formatNaira(s.profit)
							})
						]
					})]
				}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-primary p-4 text-primary-fg sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold opacity-80",
						children: "All shops together"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs opacity-70",
								children: "Sales"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "money text-lg",
								children: formatNaira(data.shopStats.reduce((a, s) => a + s.sales, 0))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs opacity-70",
								children: "Expenses"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "money text-lg",
								children: formatNaira(data.shopStats.reduce((a, s) => a + s.expenses, 0))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs opacity-70",
								children: "Profit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "money text-lg",
								children: formatNaira(data.shopStats.reduce((a, s) => a + s.profit, 0))
							})] })
						]
					})]
				})]
			})] }) : null,
			data.recentSales.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-xl",
				children: "Recent sales"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: data.recentSales.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-2xl bg-surface p-2 pr-4 shadow-[var(--shadow-card)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClothPhoto, {
							photo: s.photo,
							className: "size-14 rounded-xl",
							alt: s.item
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-semibold",
								children: s.item
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									s.customerName,
									" · ",
									s.shopName
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "money text-lg",
							children: formatNaira(s.sellingPrice)
						})
					]
				}, s.id))
			})] }) : null
		]
	});
}
function Stat({ label, value, hint, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `money mt-1 text-2xl md:text-3xl ${danger ? "text-danger" : "text-ink"}`,
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-faint",
				children: hint
			}) : null
		]
	});
}
function Action({ to, icon: Icon, label, primary }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: primary ? "flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl bg-primary px-3 py-4 text-center text-primary-fg" : "flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl bg-surface px-3 py-4 text-center shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-6",
			strokeWidth: 1.8
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold",
			children: label
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "money",
			children: v
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {}) });
//#endregion
export { SplitComponent as component };
