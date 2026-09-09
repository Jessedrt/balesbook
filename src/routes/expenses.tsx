import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ShopPills } from "@/components/shop-pills";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { createExpense, deleteExpense, getShops, listExpenses } from "@/lib/server/ledger";
import { useShopFilter } from "@/lib/shop-store";
import { formatNaira, todayIso } from "@/lib/utils";

export const Route = createFileRoute("/expenses")({
  component: () => (
    <AppShell>
      <ExpensesPage />
    </AppShell>
  ),
});

function ExpensesPage() {
  const shopId = useShopFilter((s) => s.shopId);
  const qc = useQueryClient();
  const shops = useQuery({ queryKey: ["shops"], queryFn: () => getShops() });
  const { data, isPending } = useQuery({
    queryKey: ["expenses", shopId],
    queryFn: () => listExpenses({ data: { shopId } }),
  });
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [spentAt, setSpentAt] = useState(todayIso());
  const [notes, setNotes] = useState("");
  const [expShop, setExpShop] = useState(shopId ?? "");

  const mut = useMutation({
    mutationFn: () =>
      createExpense({
        data: {
          shopId: expShop || shopId || shops.data?.shops[0]?.id || null,
          category,
          amount: Number(amount),
          spentAt,
          notes,
        },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries();
      toast.success("Expense saved");
      setAmount("");
      setNotes("");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteExpense({ data: { id } }),
    onSuccess: () => qc.invalidateQueries(),
  });

  const total = (data ?? []).reduce((a, e) => a + e.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Expenses</h1>
          <p className="text-sm text-muted">Transport, rent, packing, staff…</p>
        </div>
        <Button onClick={() => setOpen((v) => !v)}>Add</Button>
      </div>
      {shops.data ? <ShopPills shops={shops.data.shops} /> : null}

      <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm text-muted">Shown total</p>
        <p className="money text-3xl">{formatNaira(total)}</p>
      </div>

      {open ? (
        <form
          className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <Field label="What kind?">
            <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Amount (₦)">
            <Input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              required
            />
          </Field>
          <Field label="Shop">
            <NativeSelect value={expShop || shops.data?.shops[0]?.id || ""} onChange={(e) => setExpShop(e.target.value)}>
              {shops.data?.shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Date">
            <Input type="date" value={spentAt} onChange={(e) => setSpentAt(e.target.value)} />
          </Field>
          <Field label="Note">
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </Field>
          <Button type="submit" disabled={mut.isPending || !amount}>
            {mut.isPending ? "Saving…" : "Save expense"}
          </Button>
        </form>
      ) : null}

      {isPending ? (
        <div className="h-40 animate-pulse rounded-3xl bg-paper" />
      ) : !data?.length ? (
        <Empty
          icon={<Wallet className="size-10" strokeWidth={1.4} />}
          title="No expenses yet"
          hint="Write down transport, rent and the little costs so profit is true."
        />
      ) : (
        <ul className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]">
          {data.map((e, i) => (
            <li
              key={e.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div>
                <p className="font-semibold">{e.category}</p>
                <p className="text-sm text-muted">
                  {e.spentAt}
                  {e.shopName ? ` · ${e.shopName}` : ""}
                  {e.notes ? ` · ${e.notes}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="money text-lg">{formatNaira(e.amount)}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-muted"
                  onClick={() => del.mutate(e.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
