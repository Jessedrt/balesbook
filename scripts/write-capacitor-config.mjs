#!/usr/bin/env node
/**
 * Write `capacitor.config.json` — the single source of truth for the Android
 * shell's configuration.
 *
 * Why a script and not a checked-in `capacitor.config.ts`: this package is
 * `"type": "module"`, and the Capacitor CLI transpiles a TS config to CommonJS
 * before `require`ing it, which Node rejects in ESM scope
 * ("exports is not defined in ES module scope"). JSON is the format the CLI
 * loads unconditionally.
 *
 * The backend URL is required and never guessed: a build cannot accidentally
 * ship pointing at the wrong server. Everything else is fixed and lives below.
 *
 *   BALEBOOK_SERVER_URL=https://your-balebook.example.com npm run android:sync
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** `process.env` first, then a gitignored `.env` at the project root. */
function readEnv(key) {
  const fromProcess = process.env[key]?.trim();
  if (fromProcess) return fromProcess;
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return undefined;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(`${key}=`) || trimmed.startsWith("#")) continue;
    return trimmed.slice(trimmed.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") || undefined;
  }
  return undefined;
}

const serverUrl = readEnv("BALEBOOK_SERVER_URL");

if (!serverUrl) {
  console.error(`
  BALEBOOK_SERVER_URL is not set.

  The Android app is a native shell that loads the real BaleBook backend from
  this URL — same code, same Postgres database, same sign-in as the website.
  It is deliberately never guessed or hardcoded, so a build can never ship
  pointing at the wrong server.

  Set it to your deployed BaleBook origin (no trailing slash):

    BALEBOOK_SERVER_URL=https://your-balebook.example.com npm run android:sync

  or put BALEBOOK_SERVER_URL=https://… in a .env at the project root
  (.env is gitignored).
`);
  process.exit(1);
}

if (!/^https:\/\/[^\s/]+$/.test(serverUrl)) {
  console.error(
    `  BALEBOOK_SERVER_URL must be a bare https:// origin with no path ` +
      `(got "${serverUrl}").\n  Cleartext http is disabled in the Android build and the ` +
      `session cookie is Secure-only.`,
  );
  process.exit(1);
}

/** BaleBook brand — keep in sync with the `@theme` block in src/styles.css. */
const BRAND_BG = "#F3EBDD";
const BRAND_PRIMARY = "#1E5843";

const config = {
  appId: "com.balebook.app",
  appName: "BaleBook",
  // With `server.url` set, the WebView loads the deployed app; these local
  // assets exist only for the offline/error page.
  webDir: "mobile/shell",

  server: {
    url: serverUrl,
    // https keeps `window.isSecureContext` true inside the WebView, which the
    // camera/file inputs and the Secure session cookie both need.
    androidScheme: "https",
    cleartext: false,
    // Loaded by the native WebViewClient when the backend cannot be reached —
    // better than Chromium's grey error screen on a flaky connection.
    errorPath: "offline.html",
  },

  backgroundColor: BRAND_BG,

  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
    loggingBehavior: "production",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 8000,
      // Hidden by the app once React has painted (src/lib/native.ts); the
      // duration above is only a watchdog for a first load that never finishes.
      launchAutoHide: true,
      launchFadeOutDuration: 200,
      backgroundColor: BRAND_BG,
      androidScaleType: "CENTER_INSIDE",
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
    Keyboard: {
      // Resize the WebView itself so `100dvh` layouts and the pinned tab bar
      // stay correct instead of being covered.
      resize: "native",
      resizeOnFullScreen: true,
    },
    SystemBars: {
      // Dark icons on the cream background. Also injects the
      // `--safe-area-inset-*` CSS variables the app shell reads.
      style: "DARK",
      insetsHandling: "css",
      backgroundColor: BRAND_PRIMARY,
    },
  },
};

const out = join(ROOT, "capacitor.config.json");
writeFileSync(out, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`[capacitor] wrote capacitor.config.json → ${serverUrl}`);
