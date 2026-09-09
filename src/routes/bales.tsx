import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/bales")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
