import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ClothPhoto } from "@/components/cloth-photo";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { listClothes } from "@/lib/server/inventory";
import { listCustomers, recordSale } from "@/lib/server/ledger";
import { useShopFilter } from "@/lib/shop-store";
import { formatNaira, todayIso } from "@/lib/utils";

type Search = { cloth?: string };

export const Route = createFileRoute("/sales/new")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cloth: typeof s.cloth === "string" ? s.cloth : undefined,
  }),
  component: RecordSale,
});

function RecordSale() {
  const { cloth: preselect } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const shopId = useShopFilter((s) => s.shopId);
  const clothes = useQuery({
    queryKey: ["clothes", shopId, "available", ""],
    queryFn: () => listClothes({ data: { shopId, status: "available", search: "" } }),
  });
  const customers = useQuery({
    queryKey: ["customers", false],
    queryFn: () => listCustomers({ data: { owingOnly: false } }),
  });
  // Nothing on this screen can be filled in without the wardrobe list, so a
  // failed fetch gets a retry rather than an empty dropdown that looks like the
  // seller has no stock.
  const clothesFailed = clothes.isError;

  const [clothingId, setClothingId] = useState(preselect ?? "");
  const item = useMemo(
    () => clothes.data?.find((c) => c.id === clothingId) ?? null,
    [clothes.data, clothingId],
  );
  const [customerId, setCustomerId] = useState("");
  const [newName, setNewName] = useState("");
  const [price, setPrice] = useState("");
  const [paid, setPaid] = useState("");
  const [soldAt, setSoldAt] = useState(todayIso());

  const selling = Number(price) || item?.sellingPrice || 0;
  const paidN = paid === "" ? selling : Number(paid) || 0;
  const outstanding = Math.max(0, selling - paidN);

  const mut = useMutation({
    mutationFn: () =>
      recordSale({
        data: {
          clothingId,
          customerId: customerId || null,
          newCustomerName: customerId ? null : newName,
          sellingPrice: selling,
          paid: paidN,
          soldAt,
          notes: "",
        },
      }),
    onSuccess: async (res) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["clothes"] }),
        qc.invalidateQueries({ queryKey: ["customers"] }),
        qc.invalidateQueries({ queryKey: ["dashboard"] }),
        qc.invalidateQueries({ queryKey: ["report"] }),
        qc.invalidateQueries({ queryKey: ["bales"] }),
      ]);
      if (res.outstanding > 0) {
        toast.success(`Sold. ${formatNaira(res.outstanding)} still owing.`);
      } else {
        toast.success("Sold, fully paid.");
      }
      void navigate({ to: "/" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      className="mx-auto flex max-w-lg flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <div className="flex items-center gap-3">
        <Link to="/" className="grid size-11 place-items-center rounded-full bg-surface">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-display text-2xl">Record sale</h1>
      </div>

      {clothesFailed ? (
        <ErrorState
          title="Could not load your clothes"
          message={clothes.error instanceof Error ? clothes.error.message : null}
          onRetry={() => void clothes.refetch()}
        />
      ) : null}

      <Field label="Which cloth?">
        <NativeSelect
          value={clothingId}
          onChange={(e) => {
            setClothingId(e.target.value);
            const next = clothes.data?.find((c) => c.id === e.target.value);
            if (next) {
              setPrice(String(next.sellingPrice));
              setPaid(String(next.sellingPrice));
            }
          }}
          required
        >
          <option value="">Choose a piece…</option>
          {clothes.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.description} · {c.shopName} · {formatNaira(c.sellingPrice)}
            </option>
          ))}
        </NativeSelect>
      </Field>

      {item ? (
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-2 shadow-[var(--shadow-card)]">
          <ClothPhoto
            photo={item.photo}
            color={item.color}
            className="size-20 rounded-xl"
            alt={item.description}
          />
          <div>
            <p className="font-semibold">{item.description}</p>
            <p className="text-sm text-muted">
              {item.shopName}
              {item.size ? ` · Size ${item.size}` : ""}
            </p>
          </div>
        </div>
      ) : null}

      {!item && clothes.data && clothes.data.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2">
          {clothes.data.slice(0, 6).map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setClothingId(c.id);
                  setPrice(String(c.sellingPrice));
                  setPaid(String(c.sellingPrice));
                }}
                className="w-full overflow-hidden rounded-2xl bg-surface text-left shadow-[var(--shadow-card)]"
              >
                <ClothPhoto photo={c.photo} color={c.color} className="aspect-[3/4] w-full" alt={c.description} />
                <p className="truncate px-2 py-1.5 text-xs font-semibold">{c.description}</p>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <Field label="Customer">
        <NativeSelect value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Someone new…</option>
          {customers.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.outstanding > 0 ? ` (owes ${formatNaira(c.outstanding)})` : ""}
            </option>
          ))}
        </NativeSelect>
      </Field>
      {!customerId ? (
        <Field label="New customer name">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Aisha"
            required={!customerId}
          />
        </Field>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Selling price (₦)">
          <Input
            inputMode="numeric"
            value={price || (item ? String(item.sellingPrice) : "")}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
            required
          />
        </Field>
        <Field label="Amount paid (₦)">
          <Input
            inputMode="numeric"
            value={paid}
            onChange={(e) => setPaid(e.target.value.replace(/[^\d]/g, ""))}
            placeholder={String(selling || "")}
          />
        </Field>
      </div>
      <Field label="Date">
        <Input type="date" value={soldAt} onChange={(e) => setSoldAt(e.target.value)} />
      </Field>

      <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
        <Row k="Total" v={formatNaira(selling)} />
        <Row k="Paid" v={formatNaira(paidN)} />
        <Row k="Outstanding" v={formatNaira(outstanding)} danger={outstanding > 0} />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={
          mut.isPending || clothesFailed || !clothingId || (!customerId && !newName.trim())
        }
      >
        {mut.isPending ? "Saving…" : "Save sale"}
      </Button>
    </form>
  );
}

function Row({ k, v, danger }: { k: string; v: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted">{k}</span>
      <span className={`money text-lg ${danger ? "text-danger" : ""}`}>{v}</span>
    </div>
  );
}
