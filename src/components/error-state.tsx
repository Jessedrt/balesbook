import { TriangleAlert, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Something went wrong — with a way out.
 *
 * Every screen in this app is a network call away from its data, and the
 * connection this app lives on drops regularly. Without this, a failed fetch
 * leaves the skeleton shimmering forever and the seller has no idea whether
 * their sale was saved.
 */
export function ErrorState({
  title = "Could not load this",
  message,
  onRetry,
  offline,
  className,
}: {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  offline?: boolean;
  className?: string;
}) {
  const Icon = offline ? WifiOff : TriangleAlert;
  return (
    <div
      role="alert"
      className={
        "flex flex-col items-center justify-center rounded-3xl bg-surface px-6 py-10 text-center shadow-[var(--shadow-card)] " +
        (className ?? "")
      }
    >
      <span className={offline ? "text-warn" : "text-danger"} aria-hidden="true">
        <Icon className="size-9" strokeWidth={1.6} />
      </span>
      <p className="mt-3 font-display text-xl text-ink">
        {offline ? "You are offline" : title}
      </p>
      <p className="mt-1 max-w-xs text-sm text-muted">
        {offline
          ? "BaleBook needs a connection to reach your book. Your data is safe — try again when you have signal."
          : (message ?? "Check your connection and try again.")}
      </p>
      {onRetry ? (
        <Button className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
