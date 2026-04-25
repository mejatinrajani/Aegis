import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/common/page-elements";
import { mockAlerts } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  component: AlertsPage,
});

const iconFor = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

function AlertsPage() {
  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Alerts"
          description="Operational warnings and incidents across the gateway."
        />

        <div className="hover-radius mt-10 border border-border bg-card">
          <ul>
            {mockAlerts.map((a) => {
              const Icon = iconFor[a.level];
              return (
                <li
                  key={a.id}
                  className="hover-radius flex items-start gap-5 border-b border-border p-6 last:border-0 hover:bg-secondary/40"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center",
                      a.level === "critical" && "bg-foreground text-background",
                      a.level === "warning" && "bg-primary text-primary-foreground",
                      a.level === "info" && "bg-secondary text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium text-foreground">{a.title}</span>
                      {a.resolved && (
                        <span className="inline-flex items-center gap-1 border border-border bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <Check className="h-3 w-3" />
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </PageContainer>
    </AppShell>
  );
}
