import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Package, Plus } from "lucide-react";
import { Empty } from "@/components/empty";
import { ShopPills } from "@/components/shop-pills";
import { Button } from "@/components/ui/button";
import { listBales } from "@/lib/server/inventory";
import { getShops } from "@/lib/server/ledger";
import { useShopFilter } from "@/lib/shop-store";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/bales/")({ component: BalesPage });

function BalesPage() {
  const shopId = useShopFilter((s) => s.shopId);
  const shops = useQuery({ queryKey: ["shops"], queryFn: () => getShops() });
  const { data, isPending } = useQuery({
    queryKey: ["bales", shopId],
    queryFn: () => listBales({ data: { shopId } }),
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Bales</h1>
          <p className="text-sm text-muted">What you bought, still being sorted.</p>
        </div>
        <Button asChild>
          <Link to="/bales/new">
            <Plus /> New bale
          </Link>
        </Button>
      </div>
      {shops.data ? <ShopPills shops={shops.data.shops} /> : null}

      {isPending ? (
        <div className="h-40 animate-pulse rounded-3xl bg-paper" />
      ) : !data?.length ? (
        <Empty
          icon={<Package className="size-10" strokeWidth={1.4} />}
          title="No bales yet"
          hint="When a new bale arrives, write it down here — price, pieces, which shop."
          action={
            <Button asChild>
              <Link to="/bales/new">Add a bale</Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((b) => {
            const avg = b.pieces > 0 ? b.purchasePrice / b.pieces : 0;
            return (
              <li key={b.id}>
                <Link
                  to="/bales/$id"
                  params={{ id: b.id }}
                  className="block rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl">{b.name}</p>
                      <p className="text-sm text-muted">
                        {b.shopName} · {b.purchasedAt}
                      </p>
                    </div>
                    <p className="money text-lg">{formatNaira(b.purchasePrice)}</p>
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <dt className="text-muted">Pieces</dt>
                      <dd className="font-semibold">{b.pieces}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Recorded</dt>
                      <dd className="font-semibold">
                        {b.recorded}/{b.pieces}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Avg cost</dt>
                      <dd className="font-semibold">{formatNaira(avg)}</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
