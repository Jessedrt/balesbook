import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Empty } from "@/components/empty";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { listCustomers, upsertCustomer } from "@/lib/server/ledger";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/customers/")({ component: CustomersPage });

function CustomersPage() {
  const qc = useQueryClient();
  const [owingOnly, setOwingOnly] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["customers", owingOnly],
    queryFn: () => listCustomers({ data: { owingOnly } }),
  });
  const mut = useMutation({
    mutationFn: () =>
      upsertCustomer({ data: { id: null, name, phone, notes: "" } }),
    onSuccess: async () => {
      await qc.invalidateQueries();
      toast.success("Customer saved");
      setName("");
      setPhone("");
      setAdding(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const totalOwing = (data ?? []).reduce((a, c) => a + c.outstanding, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">People</h1>
          <p className="text-sm text-muted">Who bought, who still owes.</p>
        </div>
        <Button onClick={() => setAdding((v) => !v)}>
          <Plus /> New
        </Button>
      </div>

      {adding ? (
        <form
          className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </Field>
          <Button type="submit" disabled={mut.isPending}>
            {mut.isPending ? "Saving…" : "Save person"}
          </Button>
        </form>
      ) : null}

      <div className="flex items-center justify-between rounded-3xl bg-danger-soft px-4 py-3">
        <div>
          <p className="text-sm font-medium text-danger">Total outstanding</p>
          <p className="money text-2xl text-danger">{formatNaira(owingOnly ? totalOwing : totalOwing)}</p>
        </div>
        <button
          type="button"
          onClick={() => setOwingOnly((v) => !v)}
          className="h-10 rounded-full bg-surface px-4 text-sm font-semibold"
        >
          {owingOnly ? "Show all" : "Owing only"}
        </button>
      </div>

      {isPending ? (
        <div className="h-40 animate-pulse rounded-3xl bg-paper" />
      ) : !data?.length ? (
        <Empty
          icon={<Users className="size-10" strokeWidth={1.4} />}
          title="No customers yet"
          hint="Add a name when you make a sale, or save them here first."
        />
      ) : (
        <ul className="overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]">
          {data.map((c, i) => (
            <li key={c.id} className={i > 0 ? "border-t border-border" : ""}>
              <Link
                to="/customers/$id"
                params={{ id: c.id }}
                className="flex min-h-16 items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted">
                    Bought {formatNaira(c.purchases)} · Paid {formatNaira(c.paid)}
                  </p>
                </div>
                {c.outstanding > 0 ? (
                  <span className="money text-lg text-danger">{formatNaira(c.outstanding)}</span>
                ) : (
                  <span className="text-sm font-semibold text-primary">Settled</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
