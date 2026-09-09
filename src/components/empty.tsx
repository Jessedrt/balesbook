import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Empty({
  icon,
  title,
  hint,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl bg-surface px-6 py-12 text-center shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="mb-3 text-primary">{icon}</div>
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{hint}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
