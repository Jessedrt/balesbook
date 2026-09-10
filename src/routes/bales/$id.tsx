import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Plus, Shirt } from "lucide-react";
import { ClothPhoto } from "@/components/cloth-photo";
import { ErrorState } from "@/components/error-state";
import { Empty } from "@/components/empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBale } from "@/lib/server/inventory";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/bales/$id")({ component: BaleDetail });

function BaleDetail() {
  const { id } = Route.useParams();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["bale", id],
    queryFn: () => getBale({ data: { id } }),
  });

  if (isError) {
    return (
      <ErrorState
        title="Could not open this bale"
        message={error instanceof Error ? error.message : null}
        onRetry={() => void refetch()}
      />
    );
  }
  if (isPending) return <div className="h-64 animate-pulse rounded-3xl bg-paper" />;
  const bale = data?.bale;
  if (!bale) {
    return (
      <p className="text-muted">
        Bale not found. <Link to="/bales">Back</Link>
      </p>
    );
  }
  const avg = bale.pieces > 0 ? bale.purchasePrice / bale.pieces : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/bales" className="grid size-11 place-items-center rounded-full bg-surface">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl">{bale.name}</h1>
          <p className="text-sm text-muted">
            {bale.shopName} · {bale.purchasedAt}
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm text-muted">Purchase cost</p>
          <p className="money text-2xl">{formatNaira(bale.purchasePrice)}</p>
        </div>
        <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm text-muted">Avg per piece</p>
          <p className="money text-2xl">{formatNaira(avg)}</p>
        </div>
      </section>

      <p className="text-sm text-muted">
        You have recorded <span className="font-semibold text-ink">{bale.recorded}</span> of{" "}
        <span className="font-semibold text-ink">{bale.pieces}</span> pieces.
        {bale.sold ? ` ${bale.sold} already sold.` : ""}
      </p>
      {bale.notes ? (
        <p className="rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted">{bale.notes}</p>
      ) : null}

      <Button asChild size="lg">
        <Link to="/clothes/new" search={{ bale: bale.id }}>
          <Plus /> Add a piece from this bale
        </Link>
      </Button>

      {!data.clothes.length ? (
        <Empty
          icon={<Shirt className="size-10" strokeWidth={1.4} />}
          title="Nothing sorted yet"
          hint="Open the bale and add each cloth with a photo and a price."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {data.clothes.map((c) => (
            <li key={c.id}>
              <Link
                to="/clothes/$id"
                params={{ id: c.id }}
                className="block overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)]"
              >
                <ClothPhoto
                  photo={c.photo}
                  color={c.color}
                  className="aspect-[3/4] w-full"
                  alt={c.description}
                />
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold">{c.description}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge tone={c.status === "available" ? "good" : "neutral"}>
                      {c.status === "available" ? "In shop" : "Sold"}
                    </Badge>
                    <span className="money">{formatNaira(c.sellingPrice)}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
