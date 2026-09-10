import { toast } from "sonner";
import { useUiState } from "./ui-store";

/**
 * The Android shell integration.
 *
 * Every plugin is imported lazily *inside* `setupNativeApp()`, so the Capacitor
 * runtime never enters the bundle that browser users download — they get the
 * same app without paying for native code they can't reach.
 */

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
};

function capacitorGlobal(): CapacitorGlobal | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
}

/** True when running inside the BaleBook Android app (not a browser). */
export function isNativeApp(): boolean {
  return capacitorGlobal()?.isNativePlatform?.() === true;
}

/**
 * Wire up the native behaviours. Idempotent — safe to call from the root
 * component under StrictMode / repeated renders.
 *
 * Handles: the hardware back button, splash hand-off, keyboard visibility and
 * network state. The web build skips all of it (`isNativeApp()` is false there,
 * and browser `online`/`offline` events cover the connection banner).
 */
let started = false;
export function setupNativeApp(): void {
  if (started || typeof window === "undefined" || !isNativeApp()) return;
  started = true;
  void run();
}

async function run(): Promise<void> {
  // Remember the backend origin for the native offline page, which runs outside
  // the Capacitor bridge and therefore cannot ask for it (see
  // `mobile/shell/offline.html`, wired up as `server.errorPath`).
  try {
    localStorage.setItem("balebook.origin", window.location.origin);
  } catch {
    /* storage unavailable — the error page falls back to history.back() */
  }

  const [{ App }, { Keyboard }, { SplashScreen }, { Network }] = await Promise.all([
    import("@capacitor/app"),
    import("@capacitor/keyboard"),
    import("@capacitor/splash-screen"),
    import("@capacitor/network"),
  ]);

  // ── Splash ────────────────────────────────────────────────────────────────
  // `launchAutoHide` is off, so the branded splash covers the network round trip
  // instead of revealing a blank page. Hidden here once React has painted; the
  // watchdog covers a first load that never finishes.
  const hideSplash = () => void SplashScreen.hide().catch(() => undefined);
  const watchdog = window.setTimeout(hideSplash, 8000);
  window.requestAnimationFrame(() =>
    window.setTimeout(() => {
      window.clearTimeout(watchdog);
      hideSplash();
    }, 120),
  );

  // ── Hardware back button ──────────────────────────────────────────────────
  // Inside a tab: step back through history. On a root screen: ask before
  // quitting, because an accidental exit loses whatever was being typed.
  let lastBackPress = 0;
  void App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
      return;
    }
    const now = Date.now();
    if (now - lastBackPress < 2000) {
      void App.exitApp();
      return;
    }
    lastBackPress = now;
    toast.info("Press back again to close BaleBook");
  });

  // ── Keyboard ──────────────────────────────────────────────────────────────
  // The bottom nav is pinned to the viewport; leaving it on screen while the
  // keyboard is up wastes a third of a small phone.
  const setKeyboardOpen = useUiState.getState().setKeyboardOpen;
  void Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
  void Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));

  // Close the keyboard when the seller navigates — Android otherwise keeps it up
  // over the next screen.
  window.addEventListener("popstate", () => void Keyboard.hide().catch(() => undefined));

  // ── Network ───────────────────────────────────────────────────────────────
  const setOnline = useUiState.getState().setOnline;
  try {
    const status = await Network.getStatus();
    setOnline(status.connected);
  } catch {
    setOnline(navigator.onLine);
  }
  void Network.addListener("networkStatusChange", (status) => {
    setOnline(status.connected);
    if (!status.connected) toast.error("No internet connection");
  });
}

/**
 * Browser-side connection tracking for the web build. Called unconditionally
 * from the root; on native the plugin listeners above win (they fire for mobile
 * data changes the browser events miss).
 */
export function setupWebConnectionTracking(): void {
  if (typeof window === "undefined") return;
  const setOnline = useUiState.getState().setOnline;
  setOnline(navigator.onLine);
  window.addEventListener("online", () => setOnline(true));
  window.addEventListener("offline", () => setOnline(false));
}
