import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Shirt } from "lucide-react";
import { useState } from "react";
import { ClothPhoto } from "@/components/cloth-photo";
import { Empty } from "@/components/empty";
import { ErrorState } from "@/components/error-state";
import { ShopPills } from "@/components/shop-pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getShops } from "@/lib/server/ledger";
import { listClothes } from "@/lib/server/inventory";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useUiState } from "@/lib/ui-store";
import { useShopFilter } from "@/lib/shop-store";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/clothes/")({ component: ClothesPage });

function ClothesPage() {
  const shopId = useShopFilter((s) => s.shopId);
  const [status, setStatus] = useState<"all" | "available" | "sold">("available");
  const [search, setSearch] = useState("");
  // One request per pause in typing, not one per character.
  const settledSearch = useDebouncedValue(search);
  const shops = useQuery({ queryKey: ["shops"], queryFn: () => getShops() });
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["clothes", shopId, status, settledSearch],
    queryFn: () => listClothes({ data: { shopId, status, search: settledSearch } }),
  });
  const online = useUiState((s) => s.online);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">My clothes</h1>
          <p className="text-sm text-muted">Each piece, one by one.</p>
        </div>
        <Button asChild>
          <Link to="/clothes/new">
            <Plus /> Add
          </Link>
        </Button>
      </div>

      {shops.data ? <ShopPills shops={shops.data.shops} /> : null}

      <Input
        placeholder="Search colour, type, description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2">
        {(["available", "sold", "all"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={
              status === s
                ? "h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg"
                : "h-10 rounded-full bg-surface px-4 text-sm font-semibold text-ink shadow-[var(--shadow-card)]"
            }
          >
            {s === "available" ? "Available" : s === "sold" ? "Sold" : "All"}
          </button>
        ))}
      </div>

      {isError ? (
        <ErrorState
          title="Could not load your clothes"
          message={error instanceof Error ? error.message : null}
          offline={!online}
          onRetry={() => void refetch()}
        />
      ) : isPending ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-paper" />
          ))}
        </div>
      ) : !data?.length ? (
        <Empty
          icon={<Shirt className="size-10" strokeWidth={1.4} />}
          title="No clothes here yet"
          hint="Add a piece with a photo, or open a bale and start sorting."
          action={
            <Button asChild>
              <Link to="/clothes/new">Add clothing</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {data.map((c) => (
            <li key={c.id}>
              <Link
                to="/clothes/$id"
                params={{ id: c.id }}
                className="block overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]"
              >
                <ClothPhoto
                  photo={c.photo}
                  color={c.color}
                  category={c.category}
                  alt={c.description}
                  className="aspect-[3/4] w-full"
                />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug">{c.description}</p>
                    <Badge tone={c.status === "available" ? "good" : "neutral"}>
                      {c.status === "available" ? "In shop" : "Sold"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {c.size ? `Size ${c.size} · ` : ""}
                    {c.shopName}
                  </p>
                  <p className="money mt-1 text-lg">{formatNaira(c.sellingPrice)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
