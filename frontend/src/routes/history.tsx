import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/common/page-elements";
import { mockHistory } from "@/lib/mock-data";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "allowed" | "flagged" | "blocked">("all");

  const rows = useMemo(() => {
    return mockHistory.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (
        query &&
        !r.promptSnippet.toLowerCase().includes(query.toLowerCase()) &&
        !r.userId.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, status]);

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Request history"
          description="Every request that has flowed through the gateway, with full provenance."
        />

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="hover-radius flex flex-1 items-center gap-3 border border-border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts or user IDs…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div className="hover-radius flex items-center gap-2 border border-border bg-card p-1">
            {(["all", "allowed", "flagged", "blocked"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "hover-radius px-3.5 py-1.5 text-xs font-medium capitalize",
                  status === s
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
              >
                {s}
              </button>
            ))}
            <Filter className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        <div className="hover-radius mt-6 border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User ID</th>
                <th className="px-6 py-4 font-medium">Prompt</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Tokens</th>
                <th className="px-6 py-4 font-medium text-right">Latency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="hover-radius border-b border-border last:border-0 hover:bg-secondary/60"
                >
                  <td className="px-6 py-5 text-muted-foreground whitespace-nowrap">
                    {format(new Date(r.timestamp), "MMM d, HH:mm")}
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-foreground">{r.userId}</td>
                  <td className="max-w-md truncate px-6 py-5 text-foreground">
                    {r.promptSnippet}
                  </td>
                  <td className="px-6 py-5">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-6 py-5 text-muted-foreground">{r.tokens.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right text-muted-foreground">{r.latencyMs}ms</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                    No matching requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </AppShell>
  );
}

function StatusPill({ status }: { status: "allowed" | "flagged" | "blocked" }) {
  const styles = {
    allowed: "border-border bg-secondary text-foreground",
    flagged: "border-primary bg-primary/40 text-foreground",
    blocked: "border-foreground bg-foreground text-background",
  } as const;
  return (
    <span
      className={cn(
        "hover-radius inline-flex items-center border px-2.5 py-1 text-xs font-medium capitalize",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
