import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader, StatCard } from "@/components/common/page-elements";
import { mockUsage } from "@/lib/mock-data";
import { Zap, Receipt, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/usage")({
  component: UsagePage,
});

function UsagePage() {
  const data = mockUsage.map((u) => ({ ...u, date: u.date.slice(5) }));
  const totalTokens = mockUsage.reduce((acc, u) => acc + u.tokens, 0);
  const totalRequests = mockUsage.reduce((acc, u) => acc + u.requests, 0);

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Usage"
          description="Consumption and rate limits across the current billing period."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StatCard label="Tokens (14d)" value={`${(totalTokens / 1_000_000).toFixed(2)}M`} icon={Zap} />
          <StatCard label="Requests (14d)" value={totalRequests.toLocaleString()} icon={TrendingUp} />
          <StatCard label="Estimated bill" value="$184.20" hint="Renews Apr 30" icon={Receipt} />
        </div>

        <div className="hover-radius mt-8 border border-border bg-card p-8">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Tokens · last 14 days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="tokenFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={48} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="tokens" stroke="var(--color-primary)" strokeWidth={1.5} fill="url(#tokenFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="hover-radius mt-6 border border-border bg-card p-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Rate limits</h3>
          {[
            { name: "Production key", used: 412, limit: 600 },
            { name: "Staging key", used: 38, limit: 120 },
          ].map((r) => (
            <div key={r.name} className="mb-5 last:mb-0">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">{r.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {r.used} / {r.limit} req/min
                </span>
              </div>
              <div className="h-2 w-full bg-secondary">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(r.used / r.limit) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </AppShell>
  );
}
