import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader, StatCard } from "@/components/common/page-elements";
import { Activity, AlertTriangle, Zap, Gauge } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/monitoring")({
  component: MonitoringPage,
});

function MonitoringPage() {
  const [throughput, setThroughput] = useState(() =>
    Array.from({ length: 30 }).map((_, i) => ({ t: i, rps: 60 + Math.round(Math.random() * 30) })),
  );

  // Live updating throughput chart
  useEffect(() => {
    const id = setInterval(() => {
      setThroughput((prev) => {
        const next = [...prev.slice(1), { t: prev[prev.length - 1].t + 1, rps: 60 + Math.round(Math.random() * 50) }];
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Live monitoring"
          description="System health updated in real time. Scroll for distributions and recent triggers."
          action={
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 bg-primary" />
              </span>
              Streaming
            </span>
          }
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Requests / sec" value={`${throughput[throughput.length - 1].rps}`} icon={Zap} hint="Last 1s" />
          <StatCard label="Error rate" value="0.42%" icon={AlertTriangle} hint="5xx responses" />
          <StatCard label="p95 latency" value="618ms" icon={Gauge} hint="Rolling 5m" />
          <StatCard label="Active sessions" value="2,184" icon={Activity} hint="Concurrent" />
        </div>

        <div className="hover-radius mt-8 border border-border bg-card p-8">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Throughput · live</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={throughput}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="rps" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="hover-radius border border-border bg-card p-8">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Guardrail trigger frequency</h3>
            {[
              { gate: "Gate 1 — Blocklist", count: 412, pct: 0.32 },
              { gate: "Gate 2 — Normalization", count: 287, pct: 0.22 },
              { gate: "Gate 3 — Toxicity", count: 584, pct: 0.46 },
            ].map((row) => (
              <div key={row.gate} className="mb-4 last:mb-0">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-foreground">{row.gate}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </div>
                <div className="h-2 w-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${row.pct * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="hover-radius border border-border bg-card p-8">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Latency distribution</h3>
            <div className="space-y-3">
              {[
                { bucket: "< 200ms", pct: 0.48 },
                { bucket: "200–400ms", pct: 0.31 },
                { bucket: "400–800ms", pct: 0.16 },
                { bucket: "800ms+", pct: 0.05 },
              ].map((b) => (
                <div key={b.bucket}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-foreground">{b.bucket}</span>
                    <span className="text-muted-foreground">{(b.pct * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary">
                    <div className="h-full bg-foreground" style={{ width: `${b.pct * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
