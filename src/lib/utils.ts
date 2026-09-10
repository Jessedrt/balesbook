import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nid(): string {
  return crypto.randomUUID();
}

export function num(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/**
 * Every date in BaleBook is a Nigerian business day.
 *
 * Servers (Vercel, most clouds) run in UTC. Computing "today" with the host's
 * clock means a sale recorded at 00:30 in Lagos lands on *yesterday's* report,
 * and the whole month rolls over an hour early. Pinning the calendar to
 * `Africa/Lagos` makes the app agree with the seller's wall clock no matter
 * where it is deployed. WAT has no daylight saving, so plain 24h arithmetic is
 * safe for day offsets.
 */
export const APP_TIMEZONE = "Africa/Lagos";

/** `YYYY-MM-DD` for `date` as seen in `tz`. */
export function isoDateInZone(tz: string, date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: "year" | "month" | "day") =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Today's date in the app timezone, as `YYYY-MM-DD`. */
export function todayIso(): string {
  return isoDateInZone(APP_TIMEZONE);
}

/** The date `days` days from today (negative = past), in the app timezone. */
export function isoOffset(days: number): string {
  return isoDateInZone(APP_TIMEZONE, new Date(Date.now() + days * 86_400_000));
}

/** First day of the current month in the app timezone, as `YYYY-MM-DD`. */
export function monthStartIso(): string {
  return `${todayIso().slice(0, 7)}-01`;
}

/** True when `value` is a plain `YYYY-MM-DD` date, safe to send to the server. */
export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * "12 Sep" / "Today" / "Yesterday" — dates in this app are always shown to a
 * person reading a phone, never as a raw ISO string.
 */
export function formatDay(iso: string | null | undefined): string {
  if (!iso) return "";
  if (!isIsoDate(iso)) return iso;
  if (iso === todayIso()) return "Today";
  if (iso === isoOffset(-1)) return "Yesterday";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: y === new Date().getUTCFullYear() ? undefined : "numeric",
  }).format(date);
}

export function formatNaira(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}₦${Math.abs(rounded).toLocaleString("en-NG")}`;
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** The hour in the app timezone — so the greeting matches the seller's day. */
export function appHour(now: Date = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "numeric",
    hourCycle: "h23",
  }).format(now);
  const n = Number(hour);
  return Number.isFinite(n) ? n : now.getHours();
}

export function firstName(name: string | null | undefined): string {
  if (!name) return "";
  return name.trim().split(/\s+/)[0] ?? "";
}
