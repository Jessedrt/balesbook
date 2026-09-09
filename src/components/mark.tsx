import { cn } from "@/lib/utils";

export function BaleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      <rect x="4" y="18" width="24" height="8" rx="2" fill="currentColor" opacity="0.35" />
      <rect x="6" y="12" width="20" height="8" rx="2" fill="currentColor" opacity="0.65" />
      <rect x="8" y="6" width="16" height="8" rx="2" fill="currentColor" />
    </svg>
  );
}
