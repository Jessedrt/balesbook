import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * "Are you sure?" for destructive actions.
 *
 * Replaces `window.confirm()`: in the Android app that shows a system dialog
 * styled for a browser, and on the web it blocks the thread. This one matches
 * the rest of BaleBook and keeps its buttons inside the thumb's reach.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Yes, remove it",
  cancelLabel = "Keep it",
  tone = "danger",
  busy = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <AlertDialog.Content
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2 sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
          // Safe area keeps the buttons clear of the Android gesture bar.
          style={{
            paddingBottom:
              "max(1.25rem, calc(1.25rem + env(safe-area-inset-bottom, 0px)))",
          }}
        >
          <AlertDialog.Title className="font-display text-xl text-ink">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted">
            {description}
          </AlertDialog.Description>
          <div className="mt-5 flex flex-col-reverse gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={busy}>
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant={tone === "danger" ? "danger" : "default"}
                disabled={busy}
                onClick={onConfirm}
              >
                {busy ? "Working…" : confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
