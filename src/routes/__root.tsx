import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider } from "@/lib/auth/provider";
import { AppErrorComponent } from "@/lib/error-component";
import { setupNativeApp, setupWebConnectionTracking } from "@/lib/native";
import appCss from "../styles.css?url";

const APP_NAME = "BaleBook";

/**
 * Webfonts are declared here rather than `@import`ed from CSS: an `@import`
 * inside the stylesheet is only discovered after the CSS has been parsed, which
 * on a slow connection delays first paint by a whole extra round trip. The
 * preconnect + stylesheet link lets the preload scanner start immediately, and
 * `display=swap` keeps the text readable in the fallback face meanwhile.
 */
const FONT_ORIGIN = "https://fonts.googleapis.com";
const FONT_CDN = "https://fonts.gstatic.com";
const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // viewport-fit=cover is required for safe-area insets to resolve (notch,
      // Android gesture bar) — Capacitor's SystemBars plugin checks for it too.
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "description", content: "Your thrift business, organized." },
      // Matches --color-bg so the browser/Android status bar area never flashes
      // a different colour while the page paints.
      { name: "theme-color", content: "#F3EBDD" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: FONT_ORIGIN },
      { rel: "preconnect", href: FONT_CDN, crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONT_CSS },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
  errorComponent: AppErrorComponent,
});

function RootDocument() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            // One retry, then show the error state with a button — an endless
            // skeleton on a bad connection is worse than an honest failure.
            retry: 1,
            refetchOnWindowFocus: false,
            // Refetch the moment the connection comes back, which is the moment
            // a seller on a flaky network actually wants fresh numbers.
            refetchOnReconnect: true,
          },
          mutations: { retry: 0 },
        },
      }),
  );

  useEffect(() => {
    setupWebConnectionTracking();
    setupNativeApp();
  }, []);

  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-ink">
        <PreviewHostBridge />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Outlet />
            <Toaster
              position="top-center"
              toastOptions={{
                className: "!bg-surface !text-ink !border-border !shadow-[var(--shadow-card)]",
              }}
            />
          </AuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
