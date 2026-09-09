import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { createBale } from "@/lib/server/inventory";
import { getShops } from "@/lib/server/ledger";
import { useShopFilter } from "@/lib/shop-store";
import { todayIso } from "@/lib/utils";

export const Route = createFileRoute("/bales/new")({ component: NewBale });

function NewBale() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const shops = useQuery({ queryKey: ["shops"], queryFn: () => getShops() });
  const shopFilter = useShopFilter((s) => s.shopId);
  const [name, setName] = useState("");
  const [shopId, setShopId] = useState(shopFilter ?? "");
  const [purchasedAt, setPurchasedAt] = useState(todayIso());
  const [price, setPrice] = useState("");
  const [pieces, setPieces] = useState("");
  const [notes, setNotes] = useState("");

  const resolvedShop = shopId || shops.data?.shops[0]?.id || "";
  const avg =
    Number(price) > 0 && Number(pieces) > 0 ? Number(price) / Number(pieces) : 0;

  const mut = useMutation({
    mutationFn: () =>
      createBale({
        data: {
          shopId: resolvedShop,
          name: name.trim(),
          purchasedAt,
          purchasePrice: Number(price),
          pieces: Number(pieces),
          notes,
        },
      }),
    onSuccess: async (res) => {
      await qc.invalidateQueries();
      toast.success("Bale saved");
      void navigate({ to: "/bales/$id", params: { id: res.id } });
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
        <Link to="/bales" className="grid size-11 place-items-center rounded-full bg-surface">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-display text-2xl">New bale</h1>
      </div>
      <Field label="Bale name / number">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bale #003"
          required
        />
      </Field>
      <Field label="Which shop?">
        <NativeSelect value={resolvedShop} onChange={(e) => setShopId(e.target.value)}>
          {shops.data?.shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Date purchased">
        <Input type="date" value={purchasedAt} onChange={(e) => setPurchasedAt(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Purchase price (₦)">
          <Input
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="250000"
            required
          />
        </Field>
        <Field label="Number of pieces">
          <Input
            inputMode="numeric"
            value={pieces}
            onChange={(e) => setPieces(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="80"
            required
          />
        </Field>
      </div>
      {avg > 0 ? (
        <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
          Average cost per piece: <span className="font-semibold">₦{Math.round(avg).toLocaleString("en-NG")}</span>
        </p>
      ) : null}
      <Field label="Notes">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Where it came from, quality…"
        />
      </Field>
      <Button type="submit" size="lg" disabled={mut.isPending || !name || !price || !pieces}>
        {mut.isPending ? "Saving…" : "Save bale"}
      </Button>
    </form>
  );
}
