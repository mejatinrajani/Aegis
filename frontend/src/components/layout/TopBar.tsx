import { useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useUiStore } from "@/store/ui.store";

const titles: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Chat", subtitle: "Conversational interface with guardrail scanning" },
  "/playground": { title: "Playground", subtitle: "Inspect guardrail decisions in real time" },
  "/dashboard": { title: "Dashboard", subtitle: "System metrics at a glance" },
  "/history": { title: "History", subtitle: "Request log across the gateway" },
  "/guardrails": { title: "Guardrails", subtitle: "Configure detection gates" },
  "/api-keys": { title: "API Keys", subtitle: "Generate and manage credentials" },
  "/settings": { title: "Settings", subtitle: "Account, providers, and webhooks" },
  "/monitoring": { title: "Monitoring", subtitle: "Live system health" },
  "/inspector": { title: "Inspector", subtitle: "Drill into individual requests" },
  "/alerts": { title: "Alerts", subtitle: "Operational warnings and incidents" },
  "/users": { title: "Users", subtitle: "Team and tenant management" },
  "/usage": { title: "Usage", subtitle: "Consumption and rate limits" },
};

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);

  const meta =
    titles[pathname] ??
    Object.entries(titles).find(([k]) => k !== "/" && pathname.startsWith(k))?.[1] ??
    { title: "" };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-8">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{meta.title}</h1>
        {meta.subtitle && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta.subtitle}</p>
        )}
      </div>

      <button
        onClick={() => setCommandOpen(true)}
        className="hover-radius group flex items-center gap-3 border border-border bg-background px-3.5 py-2 text-sm text-muted-foreground hover:border-primary"
      >
        <Search className="h-4 w-4" />
        <span>Search or jump to…</span>
        <kbd className="ml-6 hidden items-center gap-1 border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </button>
    </header>
  );
}
