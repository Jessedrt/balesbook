import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PhotoPicker } from "@/components/photo-picker";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { CLOTHING_CATEGORIES, COLORS, SIZES } from "@/lib/constants";
import { createCloth, listBales } from "@/lib/server/inventory";
import { getShops } from "@/lib/server/ledger";
import { useShopFilter } from "@/lib/shop-store";

type Search = { bale?: string };

export const Route = createFileRoute("/clothes/new")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    bale: typeof s.bale === "string" ? s.bale : undefined,
  }),
  component: NewCloth,
});

function NewCloth() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const shopFilter = useShopFilter((s) => s.shopId);
  const shops = useQuery({ queryKey: ["shops"], queryFn: () => getShops() });
  const bales = useQuery({
    queryKey: ["bales", null],
    queryFn: () => listBales({ data: { shopId: null } }),
  });
  const search = Route.useSearch();

  const [photo, setPhoto] = useState<string | null>(null);
  const [category, setCategory] = useState(CLOTHING_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Blue");
  const [price, setPrice] = useState("");
  const [shopId, setShopId] = useState(shopFilter ?? "");
  const [baleId, setBaleId] = useState(search.bale ?? "");

  const selectedBale = bales.data?.find((b) => b.id === baleId);
  const avgCost = selectedBale && selectedBale.pieces > 0
    ? selectedBale.purchasePrice / selectedBale.pieces
    : 0;

  const resolvedShop = useMemo(() => {
    if (selectedBale) return selectedBale.shopId;
    return shopId || shops.data?.shops[0]?.id || "";
  }, [selectedBale, shopId, shops.data]);

  const mut = useMutation({
    mutationFn: () =>
      createCloth({
        data: {
          baleId: baleId || null,
          shopId: resolvedShop,
          category,
          description,
          size,
          color,
          sellingPrice: Number(price) || 0,
          cost: avgCost,
          photo,
        },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries();
      toast.success("Cloth added");
      void navigate({ to: "/clothes" });
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
        <Link to="/clothes" className="grid size-11 place-items-center rounded-full bg-surface">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-display text-2xl">Add clothing</h1>
      </div>

      <PhotoPicker value={photo} onChange={setPhoto} color={color} category={category} />

      <Field label="What is it?">
        <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
          {CLOTHING_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Short description">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Blue women's gown"
          required
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Size">
          <NativeSelect value={size} onChange={(e) => setSize(e.target.value)}>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Colour">
          <NativeSelect value={color} onChange={(e) => setColor(e.target.value)}>
            {COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Field label="Selling price (₦)">
        <Input
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="12000"
          required
        />
      </Field>
      <Field label="From which bale?">
        <NativeSelect value={baleId} onChange={(e) => setBaleId(e.target.value)}>
          <option value="">Not sure</option>
          {bales.data?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} · {b.shopName}
            </option>
          ))}
        </NativeSelect>
      </Field>
      {!selectedBale ? (
        <Field label="Which shop?">
          <NativeSelect value={resolvedShop} onChange={(e) => setShopId(e.target.value)}>
            {shops.data?.shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      ) : (
        <p className="text-sm text-muted">
          Goes to {selectedBale.shopName}. Estimated cost from bale: ₦
          {Math.round(avgCost).toLocaleString("en-NG")}
        </p>
      )}

      <Button type="submit" size="lg" disabled={mut.isPending || !description || !resolvedShop}>
        {mut.isPending ? "Saving…" : "Save clothing"}
      </Button>
    </form>
  );
}
