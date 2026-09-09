import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/sales")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
