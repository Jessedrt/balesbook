import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Navigate, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as hasGateSessionMarker } from "./server-FjvVHekD.mjs";
import { a as ShoppingBag, c as Package, f as ChartColumn, l as House, n as Users, o as Shirt, t as Wallet, u as Ellipsis } from "../_libs/lucide-react.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { n as useCurrentUser, r as useCurrentUserState, t as BaleMark } from "./mark-C-0iUqEU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-BldccHYd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var tabs = [
	{
		to: "/",
		label: "Home",
		icon: House,
		exact: true
	},
	{
		to: "/clothes",
		label: "Clothes",
		icon: Shirt,
		exact: false
	},
	{
		to: "/sales/new",
		label: "Sell",
		icon: ShoppingBag,
		exact: false,
		primary: true
	},
	{
		to: "/customers",
		label: "People",
		icon: Users,
		exact: false
	},
	{
		to: "/more",
		label: "More",
		icon: Ellipsis,
		exact: false
	}
];
var moreLinks = [
	{
		to: "/bales",
		label: "Bales",
		icon: Package
	},
	{
		to: "/expenses",
		label: "Expenses",
		icon: Wallet
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "selvage grid min-h-dvh place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaleMark, { className: "size-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-2xl tracking-tight",
				children: ["Bale", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "italic text-primary",
					children: "Book"
				})]
			})]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "selvage min-h-dvh bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-surface/80 p-4 backdrop-blur-sm md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mt-8 flex flex-col gap-1",
						children: [
							tabs.filter((t) => !("primary" in t && t.primary)).map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideLink, {
								to: tab.to,
								icon: tab.icon,
								active: isActive(pathname, tab),
								children: tab.label
							}, tab.to)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideLink, {
								to: "/sales/new",
								icon: ShoppingBag,
								active: pathname.startsWith("/sales"),
								emphasis: true,
								children: "Record sale"
							}),
							moreLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideLink, {
								to: l.to,
								icon: l.icon,
								active: pathname.startsWith(l.to),
								children: l.label
							}, l.to))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto border-t border-border pt-4",
						children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-full animate-pulse rounded-full bg-paper" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-9 animate-pulse rounded-full bg-paper" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-3xl px-4 pb-28 pt-4 md:max-w-5xl md:pb-10 md:pt-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-5 items-end",
					children: tabs.map((tab) => {
						const active = isActive(pathname, tab);
						const Icon = tab.icon;
						const primary = "primary" in tab && tab.primary;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: tab.to,
								className: cn("flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-semibold", primary && "-mt-5", !primary && (active ? "text-primary" : "text-muted")),
								children: [primary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-14 place-items-center rounded-full bg-primary text-primary-fg shadow-[0_8px_20px_-8px_#1e5843]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-6",
										strokeWidth: 2
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5",
									strokeWidth: active ? 2.4 : 1.8
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn(primary && "mt-1 text-primary"),
									children: tab.label
								})]
							})
						}, tab.to);
					})
				})
			})
		]
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaleMark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-display text-xl tracking-tight text-ink",
			children: ["Bale", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "italic text-primary",
				children: "Book"
			})]
		})]
	});
}
function SideLink({ to, icon: Icon, active, children, emphasis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors", emphasis ? "bg-primary text-primary-fg" : active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-ink"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-5",
			strokeWidth: 1.8
		}), children]
	});
}
function isActive(pathname, tab) {
	if (tab.exact) return pathname === "/";
	if (tab.to === "/more") return pathname === "/more" || pathname.startsWith("/bales") || pathname.startsWith("/expenses") || pathname.startsWith("/reports");
	return pathname === tab.to || pathname.startsWith(`${tab.to}/`);
}
//#endregion
export { AppShell as t };
