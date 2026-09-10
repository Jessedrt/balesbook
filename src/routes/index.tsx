import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  Package,
  Shirt,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ErrorState } from "@/components/error-state";
import { ClothPhoto } from "@/components/cloth-photo";
import { ShopPills } from "@/components/shop-pills";
import { getDashboard } from "@/lib/server/dashboard";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useShopFilter } from "@/lib/shop-store";
import { useUiState } from "@/lib/ui-store";
import { appHour, firstName, formatNaira, greetingForHour } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const user = useCurrentUser();
  const shopId = useShopFilter((s) => s.shopId);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", shopId],
    queryFn: () => getDashboard({ data: { shopId } }),
  });
  const online = useUiState((s) => s.online);

  const hello = greetingForHour(appHour());

  if (isError) {
    return (
      <ErrorState
        title="Could not load your dashboard"
        message={error instanceof Error ? error.message : null}
        offline={!online}
        onRetry={() => void refetch()}
      />
    );
  }

  if (isPending || !data) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded-full bg-paper" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-paper" />
          ))}
        </div>
      </div>
    );
  }

  const name = firstName(user?.displayName) || data.greetingName;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted">{hello}</p>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">{name}</h1>
        <p className="mt-1 text-sm text-muted">{data.business.name}</p>
      </div>

      <ShopPills shops={data.shops} />

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Today's sales" value={formatNaira(data.todaySales)} />
        <Stat label="Today's expenses" value={formatNaira(data.todayExpenses)} />
        <Stat
          label="Today's profit"
          value={formatNaira(data.todayProfit)}
          hint="Sales minus cloth cost and spending"
        />
        <Stat
          label="Customers owing"
          value={formatNaira(data.outstanding)}
          danger={data.outstanding > 0}
        />
      </section>

      <div className="flex items-center justify-between rounded-3xl bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-sm font-medium text-muted">Clothes available</p>
          <p className="money text-2xl">{data.clothesAvailable}</p>
        </div>
        <Link to="/clothes" className="text-sm font-semibold text-primary">
          See my clothes
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Action to="/sales/new" icon={ShoppingBag} label="Record sale" primary />
        <Action to="/clothes/new" icon={Shirt} label="Add clothing" />
        <Action to="/bales" icon={Package} label="Bales" />
        <Action to="/expenses" icon={Wallet} label="Expenses" />
      </section>

      {data.owing.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Customers owing</h2>
            <Link to="/customers" className="text-sm font-semibold text-primary">
              All people
            </Link>
          </div>
          <ul className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]">
            {data.owing.slice(0, 5).map((c, i) => (
              <li key={c.id} className={i > 0 ? "border-t border-border" : ""}>
                <Link
                  to="/customers/$id"
                  params={{ id: c.id }}
                  className="flex min-h-14 items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="font-semibold">{c.name}</span>
                  <span className="flex items-center gap-1 money text-lg text-danger">
                    {formatNaira(c.outstanding)}
                    <ChevronRight className="size-4 text-faint" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {shopId === null && data.shopStats.length > 1 ? (
        <section>
          <h2 className="mb-3 font-display text-xl">Both shops</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.shopStats.map((s) => (
              <div key={s.id} className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
                <p className="font-semibold">{s.name}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <Row k="Sales" v={formatNaira(s.sales)} />
                  <Row k="Expenses" v={formatNaira(s.expenses)} />
                  <Row k="Profit" v={formatNaira(s.profit)} />
                </dl>
              </div>
            ))}
            <div className="rounded-3xl bg-primary p-4 text-primary-fg sm:col-span-2">
              <p className="text-sm font-semibold opacity-80">All shops together</p>
              <dl className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs opacity-70">Sales</p>
                  <p className="money text-lg">
                    {formatNaira(data.shopStats.reduce((a, s) => a + s.sales, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Expenses</p>
                  <p className="money text-lg">
                    {formatNaira(data.shopStats.reduce((a, s) => a + s.expenses, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Profit</p>
                  <p className="money text-lg">
                    {formatNaira(data.shopStats.reduce((a, s) => a + s.profit, 0))}
                  </p>
                </div>
              </dl>
            </div>
          </div>
        </section>
      ) : null}

      {data.recentSales.length > 0 ? (
        <section>
          <h2 className="mb-3 font-display text-xl">Recent sales</h2>
          <ul className="flex flex-col gap-2">
            {data.recentSales.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-2xl bg-surface p-2 pr-4 shadow-[var(--shadow-card)]"
              >
                <ClothPhoto
                  photo={s.photo}
                  className="size-14 rounded-xl"
                  alt={s.item}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.item}</p>
                  <p className="text-sm text-muted">
                    {s.customerName} · {s.shopName}
                  </p>
                </div>
                <p className="money text-lg">{formatNaira(s.sellingPrice)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  danger,
}: {
  label: string;
  value: string;
  hint?: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className={`money mt-1 text-2xl md:text-3xl ${danger ? "text-danger" : "text-ink"}`}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}

function Action({
  to,
  icon: Icon,
  label,
  primary,
}: {
  to: string;
  icon: typeof Shirt;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        primary
          ? "flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl bg-primary px-3 py-4 text-center text-primary-fg"
          : "flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl bg-surface px-3 py-4 text-center shadow-[var(--shadow-card)]"
      }
    >
      <Icon className="size-6" strokeWidth={1.8} />
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="money">{v}</dd>
    </div>
  );
}
