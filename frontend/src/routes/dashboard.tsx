import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader, StatCard } from "@/components/common/page-elements";
import { Activity, Shield, Zap, MessageSquare } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { mockUsage } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const latencyData = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}:00`,
  p50: 220 + Math.round(Math.sin(i / 3) * 60 + Math.random() * 30),
  p95: 480 + Math.round(Math.cos(i / 4) * 90 + Math.random() * 60),
}));

const blockedData = mockUsage.slice(-7).map((u) => ({
  date: u.date.slice(5),
  blocked: Math.round(u.requests * 0.04 + Math.random() * 30),
}));

function DashboardPage() {
  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="System overview"
          description="Real-time view of guardrail throughput, latency, and decisions."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Tokens processed"
            value="4.81M"
            hint="+12.4% vs last week"
            icon={Zap}
          />
          <StatCard
            label="Messages blocked"
            value="1,283"
            hint="2.7% block rate"
            icon={Shield}
          />
          <StatCard
            label="Avg latency"
            value="412ms"
            hint="p95 · 680ms"
            icon={Activity}
          />
          <StatCard
            label="Requests today"
            value="18,204"
            hint="93% allowed"
            icon={MessageSquare}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="hover-radius border border-border bg-card p-8 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Latency · last 24h</h3>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-foreground" /> p50
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary" /> p95
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={latencyData}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="p50"
                  stroke="var(--color-foreground)"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="p95"
                  stroke="var(--color-primary)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="hover-radius border border-border bg-card p-8">
            <h3 className="mb-6 text-lg font-semibold text-foreground">Blocked · last 7 days</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={blockedData}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="blocked" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
