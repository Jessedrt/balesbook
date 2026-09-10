import { WifiOff } from "lucide-react";
import { useUiState } from "@/lib/ui-store";

/**
 * Persistent strip while the phone has no usable connection.
 *
 * Sits under the header rather than replacing content, so a seller mid-sale can
 * still see what they were doing while the network comes back.
 */
export function OfflineBanner() {
  const online = useUiState((s) => s.online);
  if (online) return null;
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-warn-soft px-4 py-2 text-sm font-semibold text-warn"
    >
      <WifiOff className="size-4" strokeWidth={2} aria-hidden="true" />
      No internet — showing the last thing that loaded
    </div>
  );
}
