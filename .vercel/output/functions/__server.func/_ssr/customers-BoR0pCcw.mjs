import { o as __toESM } from "../_runtime.mjs";
import { r as formatNaira } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as Users, s as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Empty } from "./empty-inSjgfx_.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { d as upsertCustomer, o as listCustomers } from "./ledger-DEZuFrDL.mjs";
import { n as Input, t as Field } from "./input-DOqfzTzL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-BoR0pCcw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const qc = useQueryClient();
	const [owingOnly, setOwingOnly] = (0, import_react.useState)(false);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const { data, isPending } = useQuery({
		queryKey: ["customers", owingOnly],
		queryFn: () => listCustomers({ data: { owingOnly } })
	});
	const mut = useMutation({
		mutationFn: () => upsertCustomer({ data: {
			id: null,
			name,
			phone,
			notes: ""
		} }),
		onSuccess: async () => {
			await qc.invalidateQueries();
			toast.success("Customer saved");
			setName("");
			setPhone("");
			setAdding(false);
		},
		onError: (e) => toast.error(e.message)
	});
	const totalOwing = (data ?? []).reduce((a, c) => a + c.outstanding, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "People"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Who bought, who still owes."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAdding((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " New"]
				})]
			}),
			adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				onSubmit: (e) => {
					e.preventDefault();
					mut.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							inputMode: "tel"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: mut.isPending,
						children: mut.isPending ? "Saving…" : "Save person"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-3xl bg-danger-soft px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-danger",
					children: "Total outstanding"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "money text-2xl text-danger",
					children: formatNaira(owingOnly ? totalOwing : totalOwing)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOwingOnly((v) => !v),
					className: "h-10 rounded-full bg-surface px-4 text-sm font-semibold",
					children: owingOnly ? "Show all" : "Owing only"
				})]
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-3xl bg-paper" }) : !data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
					className: "size-10",
					strokeWidth: 1.4
				}),
				title: "No customers yet",
				hint: "Add a name when you make a sale, or save them here first."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]",
				children: data.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: i > 0 ? "border-t border-border" : "",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/customers/$id",
						params: { id: c.id },
						className: "flex min-h-16 items-center justify-between gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Bought ",
								formatNaira(c.purchases),
								" · Paid ",
								formatNaira(c.paid)
							]
						})] }), c.outstanding > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "money text-lg text-danger",
							children: formatNaira(c.outstanding)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-primary",
							children: "Settled"
						})]
					})
				}, c.id))
			})
		]
	});
}
//#endregion
export { CustomersPage as component };
