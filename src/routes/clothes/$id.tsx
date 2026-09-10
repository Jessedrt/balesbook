import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ClothPhoto } from "@/components/cloth-photo";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ErrorState } from "@/components/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteCloth, getCloth } from "@/lib/server/inventory";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/clothes/$id")({ component: ClothDetail });

function ClothDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["cloth", id],
    queryFn: () => getCloth({ data: { id } }),
  });
  const del = useMutation({
    mutationFn: () => deleteCloth({ data: { id } }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["clothes"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Removed");
      void navigate({ to: "/clothes" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isError) {
    return (
      <ErrorState
        title="Could not open this cloth"
        message={error instanceof Error ? error.message : null}
        onRetry={() => void refetch()}
      />
    );
  }
  if (isPending) return <div className="h-80 animate-pulse rounded-3xl bg-paper" />;
  if (!data) {
    return (
      <p className="text-muted">
        This cloth is gone. <Link to="/clothes">Back to clothes</Link>
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link to="/clothes" className="grid size-11 place-items-center rounded-full bg-surface">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="flex-1 font-display text-2xl leading-tight">{data.description}</h1>
      </div>
      <ClothPhoto
        photo={data.photo}
        color={data.color}
        category={data.category}
        alt={data.description}
        className="aspect-[3/4] w-full rounded-3xl"
      />
      <div className="flex flex-wrap gap-2">
        <Badge tone={data.status === "available" ? "good" : "neutral"}>
          {data.status === "available" ? "Available" : "Sold"}
        </Badge>
        <Badge>{data.shopName}</Badge>
        {data.size ? <Badge>Size {data.size}</Badge> : null}
        {data.color ? <Badge>{data.color}</Badge> : null}
      </div>
      <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm text-muted">Selling price</p>
        <p className="money text-3xl">{formatNaira(data.sellingPrice)}</p>
        {data.cost > 0 ? (
          <p className="mt-1 text-sm text-muted">
            About {formatNaira(data.cost)} from the bale
            {data.baleName ? ` (${data.baleName})` : ""}
          </p>
        ) : null}
      </div>
      {data.status === "available" ? (
        <div className="flex flex-col gap-2">
          <Button asChild size="lg">
            <Link to="/sales/new" search={{ cloth: data.id }}>
              <ShoppingBag /> Sell this
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-danger"
            onClick={() => setConfirming(true)}
          >
            <Trash2 /> Remove
          </Button>
          <ConfirmDialog
            open={confirming}
            onOpenChange={setConfirming}
            title="Remove this cloth?"
            description={`${data.description} will be deleted from your shop. This cannot be undone.`}
            confirmLabel="Yes, remove it"
            busy={del.isPending}
            onConfirm={() => {
              setConfirming(false);
              del.mutate();
            }}
          />
        </div>
      ) : (
        <p className="text-sm text-muted">
          Sold{data.soldAt ? ` on ${data.soldAt}` : ""}.
        </p>
      )}
    </div>
  );
}
