import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { ShopPills } from "@/components/shop-pills";
import { getReport, getShops } from "@/lib/server/ledger";
import { useShopFilter } from "@/lib/shop-store";
import type { ReportPeriod } from "@/lib/types";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  component: () => (
    <AppShell>
      <ReportsPage />
    </AppShell>
  ),
});

function ReportsPage() {
  const shopId = useShopFilter((s) => s.shopId);
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const shops = useQuery({ queryKey: ["shops"], queryFn: () => getShops() });
  const { data, isPending } = useQuery({
    queryKey: ["report", period, shopId],
    queryFn: () => getReport({ data: { period, shopId } }),
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl">Reports</h1>
        <p className="text-sm text-muted">Plain numbers. No accounting talk.</p>
      </div>
      {shops.data ? <ShopPills shops={shops.data.shops} /> : null}
      <div className="flex gap-2">
        {(["daily", "weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={
              period === p
                ? "h-10 rounded-full bg-primary px-4 text-sm font-semibold capitalize text-primary-fg"
                : "h-10 rounded-full bg-surface px-4 text-sm font-semibold capitalize shadow-[var(--shadow-card)]"
            }
          >
            {p === "daily" ? "Today" : p === "weekly" ? "This week" : "This month"}
          </button>
        ))}
      </div>

      {isPending || !data ? (
        <div className="h-48 animate-pulse rounded-3xl bg-paper" />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3">
            <Stat label="Sales" value={formatNaira(data.sales)} />
            <Stat label="Expenses" value={formatNaira(data.expenses)} />
            <Stat label="Profit" value={formatNaira(data.profit)} />
            <Stat label="Items sold" value={String(data.itemsSold)} />
            <Stat label="Money collected" value={formatNaira(data.collected)} />
            <Stat label="Customers owing" value={formatNaira(data.outstanding)} danger={data.outstanding > 0} />
          </section>

          {data.byDay.length > 0 ? (
            <section className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
              <h2 className="mb-3 font-display text-xl">Sales and spending</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.byDay} barGap={4}>
                    <XAxis
                      dataKey="day"
                      tickFormatter={(d) => String(d).slice(8)}
                      tick={{ fill: "#6F675C", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v) => formatNaira(Number(v))}
                      labelFormatter={(l) => String(l)}
                      contentStyle={{
                        background: "#FBF6EC",
                        border: "1px solid #E0D4C2",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="sales" fill="#1E5843" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expenses" fill="#9A3B30" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          ) : null}

          {data.categories.length > 0 ? (
            <section>
              <h2 className="mb-3 font-display text-xl">What sold best</h2>
              <ul className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]">
                {data.categories.map((c, i) => (
                  <li
                    key={c.category}
                    className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}
                  >
                    <div>
                      <p className="font-semibold">{c.category}</p>
                      <p className="text-sm text-muted">
                        {c.count} sold
                      </p>
                    </div>
                    <span className="money">{formatNaira(c.sales)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {shopId === null && data.shopStats.length > 1 ? (
            <section>
              <h2 className="mb-3 font-display text-xl">Shop by shop</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.shopStats.map((s) => (
                  <div key={s.id} className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-2 text-sm text-muted">Sales {formatNaira(s.sales)}</p>
                    <p className="text-sm text-muted">Expenses {formatNaira(s.expenses)}</p>
                    <p className="money mt-1 text-xl">{formatNaira(s.profit)} profit</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
      <p className="text-sm text-muted">{label}</p>
      <p className={`money mt-1 text-2xl ${danger ? "text-danger" : ""}`}>{value}</p>
    </div>
  );
}
