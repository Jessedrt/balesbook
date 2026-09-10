import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { BaleMark } from "@/components/mark";
import { Button } from "@/components/ui/button";

const FALLBACK_MESSAGE = "Something went wrong. Your data is safe.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

/**
 * Last-resort screen when a route throws.
 *
 * Styled with the rest of BaleBook and offering a way back in — the previous
 * version showed a generic grey page with no action, which on a phone reads as
 * "the app is broken" with nothing to do about it.
 */
export function AppErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <main className="selvage flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-ink">
      <BaleMark className="size-11" />
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-9" strokeWidth={1.6} />
      </span>
      <h1 className="font-display text-2xl">Something went wrong</h1>
      <p className="max-w-sm text-sm break-words text-muted">{errorMessage(error)}</p>
      <div className="mt-2 flex flex-col gap-2">
        {reset ? (
          <Button size="lg" onClick={() => reset()}>
            Try again
          </Button>
        ) : null}
        <Button variant="secondary" size="lg" onClick={() => (window.location.href = "/")}>
          Go to my dashboard
        </Button>
      </div>
    </main>
  );
}
