import { useEffect, useState } from "react";

/**
 * Settle a fast-changing value before it drives a server request.
 *
 * The clothes search box fires a query per keystroke, and on a Nigerian mobile
 * connection that means a round trip per character plus a pile of responses
 * racing back out of order. 300ms is short enough to feel instant.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return settled;
}
