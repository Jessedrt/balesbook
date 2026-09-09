import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChartColumn, ChevronRight, Package, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { getShops, updateBusiness } from "@/lib/server/ledger";

export const Route = createFileRoute("/more")({
  component: () => (
    <AppShell>
      <MorePage />
    </AppShell>
  ),
});

function MorePage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["shops"], queryFn: () => getShops() });
  const [biz, setBiz] = useState("");
  const [shopNames, setShopNames] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!data) return;
    setBiz(data.business.name);
    setShopNames(data.shops.map((s) => ({ id: s.id, name: s.name })));
  }, [data]);

  const mut = useMutation({
    mutationFn: () =>
      updateBusiness({
        data: { businessName: biz, shops: shopNames },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries();
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">More</h1>
        <p className="text-sm text-muted">Bales, spending, reports and shop names.</p>
      </div>

      <ul className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]">
        <MoreLink to="/bales" icon={Package} label="Bales" hint="What you bought in bulk" />
        <MoreLink to="/expenses" icon={Wallet} label="Expenses" hint="Transport, rent, packing" />
        <MoreLink to="/reports" icon={ChartColumn} label="Reports" hint="Today, this week, this month" />
      </ul>

      <section className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-xl">Shop names</h2>
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <Field label="Business name">
            <Input value={biz} onChange={(e) => setBiz(e.target.value)} required />
          </Field>
          {shopNames.map((s, i) => (
            <Field key={s.id} label={`Shop ${i + 1}`}>
              <Input
                value={s.name}
                onChange={(e) =>
                  setShopNames((all) =>
                    all.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)),
                  )
                }
                required
              />
            </Field>
          ))}
          <Button type="submit" disabled={mut.isPending}>
            {mut.isPending ? "Saving…" : "Save names"}
          </Button>
        </form>
      </section>
    </div>
  );
}

function MoreLink({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: string;
  icon: typeof Package;
  label: string;
  hint: string;
}) {
  return (
    <li className="border-b border-border last:border-0">
      <Link to={to} className="flex min-h-16 items-center gap-3 px-4 py-3">
        <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">{label}</span>
          <span className="block text-sm text-muted">{hint}</span>
        </span>
        <ChevronRight className="size-5 text-faint" />
      </Link>
    </li>
  );
}
