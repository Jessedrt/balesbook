import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ClothPhoto } from "@/components/cloth-photo";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { getCustomer, recordPayment } from "@/lib/server/ledger";
import { formatNaira, todayIso } from "@/lib/utils";

export const Route = createFileRoute("/customers/$id")({ component: CustomerDetail });

function CustomerDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer({ data: { id } }),
  });
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(todayIso());
  const mut = useMutation({
    mutationFn: () =>
      recordPayment({
        data: {
          customerId: id,
          amount: Number(amount),
          paidAt,
          notes: "Payment received",
        },
      }),
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: ["customer", id] });
      await qc.invalidateQueries({ queryKey: ["customers"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      await qc.invalidateQueries({ queryKey: ["report"] });
      toast.success(
        res.outstanding > 0
          ? `Payment recorded. ${formatNaira(res.outstanding)} still owing.`
          : "Payment recorded. They are settled.",
      );
      setAmount("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isError) {
    return (
      <ErrorState
        title="Could not open this person"
        message={error instanceof Error ? error.message : null}
        onRetry={() => void refetch()}
      />
    );
  }
  if (isPending) return <div className="h-64 animate-pulse rounded-3xl bg-paper" />;
  if (!data) {
    return (
      <p className="text-muted">
        Person not found. <Link to="/customers">Back</Link>
      </p>
    );
  }
  const c = data.customer;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/customers" className="grid size-11 place-items-center rounded-full bg-surface">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl">{c.name}</h1>
          {c.phone ? <p className="text-sm text-muted">{c.phone}</p> : null}
        </div>
      </div>

      <section className="grid grid-cols-3 gap-3">
        <Mini label="Bought" value={formatNaira(c.purchases)} />
        <Mini label="Paid" value={formatNaira(c.paid)} />
        <Mini label="Owing" value={formatNaira(c.outstanding)} danger={c.outstanding > 0} />
      </section>

      {c.outstanding > 0 ? (
        <form
          className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <p className="font-semibold">Record a payment</p>
          <Field label="Amount (₦)">
            <Input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder={String(c.outstanding)}
              required
            />
          </Field>
          <Field label="Date">
            <Input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
          </Field>
          <Button type="submit" disabled={mut.isPending || !amount}>
            {mut.isPending ? "Saving…" : "Save payment"}
          </Button>
        </form>
      ) : (
        <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm font-medium text-primary">
          This person does not owe anything.
        </p>
      )}

      <section>
        <h2 className="mb-3 font-display text-xl">Purchases</h2>
        <ul className="flex flex-col gap-2">
          {data.sales.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-2xl bg-surface p-2 pr-4 shadow-[var(--shadow-card)]"
            >
              <ClothPhoto photo={s.photo} className="size-14 rounded-xl" alt={s.item} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.item}</p>
                <p className="text-sm text-muted">
                  {s.soldAt} · {s.shopName}
                </p>
              </div>
              <p className="money">{formatNaira(s.sellingPrice)}</p>
            </li>
          ))}
        </ul>
      </section>

      {data.payments.length > 0 ? (
        <section>
          <h2 className="mb-3 font-display text-xl">Payments</h2>
          <ul className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]">
            {data.payments.map((p, i) => (
              <li
                key={p.id}
                className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="text-sm text-muted">{p.paidAt}</span>
                <span className="money text-primary">{formatNaira(p.amount)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Mini({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-3xl bg-surface p-3 shadow-[var(--shadow-card)]">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={`money text-lg ${danger ? "text-danger" : ""}`}>{value}</p>
    </div>
  );
}
