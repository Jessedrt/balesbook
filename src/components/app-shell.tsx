import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChartColumn,
  House,
  MoreHorizontal,
  Package,
  Shirt,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import { OfflineBanner } from "@/components/offline-banner";
import { UserButton } from "@/lib/auth/gates";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useUiState } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { BaleMark } from "./mark";

const tabs = [
  { to: "/", label: "Home", icon: House, exact: true },
  { to: "/clothes", label: "Clothes", icon: Shirt, exact: false },
  { to: "/sales/new", label: "Sell", icon: ShoppingBag, exact: false, primary: true },
  { to: "/customers", label: "People", icon: Users, exact: false },
  { to: "/more", label: "More", icon: MoreHorizontal, exact: false },
] as const;

const moreLinks = [
  { to: "/bales", label: "Bales", icon: Package },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/reports", label: "Reports", icon: ChartColumn },
];

/**
 * Safe-area insets come from Capacitor's SystemBars plugin inside the Android
 * app (it writes `--safe-area-inset-*` on the root element) and from
 * `viewport-fit=cover` in a browser. The `env()` fallback keeps it correct on
 * iOS/Android Chrome; the `0px` fallback keeps it flat everywhere else.
 */
const insetTop = "var(--safe-area-inset-top, env(safe-area-inset-top, 0px))";
const insetBottom = "var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  // The keyboard covers a third of a small phone; the tab bar would just be in
  // the way (and tappable over the wrong field) while it is up.
  const keyboardOpen = useUiState((s) => s.keyboardOpen);

  if (isPending) {
    return (
      <div className="selvage grid min-h-dvh place-items-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <BaleMark className="size-12" />
          <p className="font-display text-2xl tracking-tight">
            Bale<span className="italic text-primary">Book</span>
          </p>
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="selvage min-h-dvh bg-bg text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-surface/80 p-4 backdrop-blur-sm md:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1">
          {tabs.filter((t) => !("primary" in t && t.primary)).map((tab) => (
            <SideLink key={tab.to} to={tab.to} icon={tab.icon} active={isActive(pathname, tab)}>
              {tab.label}
            </SideLink>
          ))}
          <SideLink
            to="/sales/new"
            icon={ShoppingBag}
            active={pathname.startsWith("/sales")}
            emphasis
          >
            Record sale
          </SideLink>
          {moreLinks.map((l) => (
            <SideLink key={l.to} to={l.to} icon={l.icon} active={pathname.startsWith(l.to)}>
              {l.label}
            </SideLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-border pt-4">
          {isPending ? (
            <div className="h-10 w-full animate-pulse rounded-full bg-paper" />
          ) : (
            <UserButton />
          )}
        </div>
      </aside>

      <div className="md:pl-60">
        <header
          className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur-sm md:hidden"
          style={{ paddingTop: insetTop }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Brand />
            {isPending ? (
              <div className="size-9 animate-pulse rounded-full bg-paper" />
            ) : (
              <UserButton />
            )}
          </div>
          <OfflineBanner />
        </header>
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4 md:max-w-5xl md:pb-10 md:pt-8">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-2 pt-2 backdrop-blur-sm md:hidden"
        style={{
          paddingBottom: `max(0.5rem, ${insetBottom})`,
          // Hidden (not just dimmed) while the keyboard is up.
          display: keyboardOpen ? "none" : undefined,
        }}
        aria-hidden={keyboardOpen || undefined}
      >
        <ul className="grid grid-cols-5 items-end">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab);
            const Icon = tab.icon;
            const primary = "primary" in tab && tab.primary;
            return (
              <li key={tab.to} className="flex justify-center">
                <Link
                  to={tab.to}
                  className={cn(
                    "flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-semibold",
                    primary && "-mt-5",
                    !primary && (active ? "text-primary" : "text-muted"),
                  )}
                >
                  {primary ? (
                    <span className="grid size-14 place-items-center rounded-full bg-primary text-primary-fg shadow-[0_8px_20px_-8px_#1e5843]">
                      <Icon className="size-6" strokeWidth={2} />
                    </span>
                  ) : (
                    <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                  )}
                  <span className={cn(primary && "mt-1 text-primary")}>{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <BaleMark className="size-8" />
      <span className="font-display text-xl tracking-tight text-ink">
        Bale<span className="italic text-primary">Book</span>
      </span>
    </Link>
  );
}

function SideLink({
  to,
  icon: Icon,
  active,
  children,
  emphasis,
}: {
  to: string;
  icon: typeof House;
  active: boolean;
  children: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
        emphasis
          ? "bg-primary text-primary-fg"
          : active
            ? "bg-primary-soft text-primary"
            : "text-muted hover:bg-surface-2 hover:text-ink",
      )}
    >
      <Icon className="size-5" strokeWidth={1.8} />
      {children}
    </Link>
  );
}

function isActive(pathname: string, tab: { to: string; exact: boolean }) {
  if (tab.exact) return pathname === "/";
  if (tab.to === "/more") {
    return (
      pathname === "/more" ||
      pathname.startsWith("/bales") ||
      pathname.startsWith("/expenses") ||
      pathname.startsWith("/reports")
    );
  }
  return pathname === tab.to || pathname.startsWith(`${tab.to}/`);
}
