import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/common/page-elements";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inspector")({
  component: InspectorPage,
});

const requests = [
  { id: "req_8f2c91", time: "14:32:08", status: "blocked", prompt: "Walk me through how to bypass…" },
  { id: "req_8f2c8a", time: "14:31:54", status: "allowed", prompt: "Summarize the Q3 revenue report" },
  { id: "req_8f2c83", time: "14:31:41", status: "flagged", prompt: "Translate ${user_input} to French" },
  { id: "req_8f2c7e", time: "14:31:22", status: "allowed", prompt: "Generate a SQL query for churned…" },
];

const sample = {
  request: {
    id: "req_8f2c91",
    user_id: "usr_a91x",
    prompt: "Walk me through how to bypass content filters on a chatbot.",
    metadata: { ip: "203.0.113.18", model: "gpt-5.2", session_id: "ses_19f3" },
  },
  gates: {
    gate1_blocklist: { status: "passed", matches: [], duration_ms: 4 },
    gate2_normalization: {
      status: "flagged",
      transformations: ["unicode_normalize", "leetspeak_resolve"],
      duration_ms: 11,
    },
    gate3_toxicity: {
      status: "blocked",
      score: 0.78,
      threshold: 0.42,
      model: "guardrail-llm-v2.4",
      duration_ms: 287,
    },
  },
  decision: { final: "blocked", reason: "Gate 3 score 0.78 > threshold 0.42" },
  response: null,
};

function InspectorPage() {
  const [selected, setSelected] = useState(requests[0]);

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Request inspector"
          description="Drill into individual requests to see every gate's input, transformation, and decision."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="hover-radius border border-border bg-card">
            <div className="border-b border-border p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent requests
            </div>
            <ul>
              {requests.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setSelected(r)}
                    className={cn(
                      "hover-radius w-full border-b border-border p-4 text-left text-sm last:border-0",
                      selected.id === r.id ? "bg-secondary" : "hover:bg-secondary/60",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-foreground">{r.id}</span>
                      <span className="text-[11px] text-muted-foreground">{r.time}</span>
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{r.prompt}</div>
                    <div
                      className={cn(
                        "mt-2 inline-block border px-1.5 py-0.5 text-[10px] uppercase tracking-wider",
                        r.status === "allowed" && "border-border bg-secondary",
                        r.status === "flagged" && "border-primary bg-primary/40",
                        r.status === "blocked" && "border-foreground bg-foreground text-background",
                      )}
                    >
                      {r.status}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <Section title="Request" defaultOpen>
              <pre className="overflow-x-auto bg-background p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(sample.request, null, 2)}
              </pre>
            </Section>
            <Section title="Gate 1 — Blocklist">
              <pre className="overflow-x-auto bg-background p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(sample.gates.gate1_blocklist, null, 2)}
              </pre>
            </Section>
            <Section title="Gate 2 — Normalization">
              <pre className="overflow-x-auto bg-background p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(sample.gates.gate2_normalization, null, 2)}
              </pre>
            </Section>
            <Section title="Gate 3 — Toxicity" defaultOpen>
              <pre className="overflow-x-auto bg-background p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(sample.gates.gate3_toxicity, null, 2)}
              </pre>
            </Section>
            <Section title="Final decision" defaultOpen>
              <pre className="overflow-x-auto bg-background p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(sample.decision, null, 2)}
              </pre>
            </Section>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="hover-radius border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="hover-radius flex w-full items-center justify-between p-5 text-left text-sm font-medium hover:bg-secondary/60"
      >
        <span>{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="border-t border-border p-5">{children}</div>}
    </div>
  );
}
