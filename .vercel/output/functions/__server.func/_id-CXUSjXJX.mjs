import { o as __toESM } from "./_runtime.mjs";
import { c as todayIso, r as formatNaira } from "./_ssr/utils-DhFUnFCj.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/react+tanstack__react-query.mjs";
import { m as ArrowLeft } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$2 } from "./_ssr/router-v_4pl9av.mjs";
import { t as ClothPhoto } from "./_ssr/cloth-photo-I59xF1t-.mjs";
import { t as Button } from "./_ssr/button-CDvKYGyv.mjs";
import { c as recordPayment, r as getCustomer } from "./_ssr/ledger-DEZuFrDL.mjs";
import { n as Input, t as Field } from "./_ssr/input-DOqfzTzL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CXUSjXJX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomerDetail() {
	const { id } = Route$2.useParams();
	const qc = useQueryClient();
	const { data, isPending } = useQuery({
		queryKey: ["customer", id],
		queryFn: () => getCustomer({ data: { id } })
	});
	const [amount, setAmount] = (0, import_react.useState)("");
	const [paidAt, setPaidAt] = (0, import_react.useState)(todayIso());
	const mut = useMutation({
		mutationFn: () => recordPayment({ data: {
			customerId: id,
			amount: Number(amount),
			paidAt,
			notes: "Payment received"
		} }),
		onSuccess: async () => {
			await qc.invalidateQueries();
			toast.success("Payment recorded");
			setAmount("");
		},
		onError: (e) => toast.error(e.message)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-3xl bg-paper" });
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: ["Person not found. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/customers",
			children: "Back"
		})]
	});
	const c = data.customer;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/customers",
					className: "grid size-11 place-items-center rounded-full bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: c.name
				}), c.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: c.phone
				}) : null] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Bought",
						value: formatNaira(c.purchases)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Paid",
						value: formatNaira(c.paid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Owing",
						value: formatNaira(c.outstanding),
						danger: c.outstanding > 0
					})
				]
			}),
			c.outstanding > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				onSubmit: (e) => {
					e.preventDefault();
					mut.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Record a payment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount (₦)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: amount,
							onChange: (e) => setAmount(e.target.value.replace(/[^\d]/g, "")),
							placeholder: String(c.outstanding),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: paidAt,
							onChange: (e) => setPaidAt(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: mut.isPending || !amount,
						children: mut.isPending ? "Saving…" : "Save payment"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-primary-soft px-4 py-3 text-sm font-medium text-primary",
				children: "This person does not owe anything."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-xl",
				children: "Purchases"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: data.sales.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
									s.soldAt,
									" · ",
									s.shopName
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "money",
							children: formatNaira(s.sellingPrice)
						})
					]
				}, s.id))
			})] }),
			data.payments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-xl",
				children: "Payments"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
				children: data.payments.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: p.paidAt
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "money text-primary",
						children: formatNaira(p.amount)
					})]
				}, p.id))
			})] }) : null
		]
	});
}
function Mini({ label, value, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-surface p-3 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `money text-lg ${danger ? "text-danger" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { CustomerDetail as component };
