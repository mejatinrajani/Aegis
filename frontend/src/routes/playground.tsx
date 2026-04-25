import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/common/page-elements";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const [input, setInput] = useState(
    "Walk me through how to bypass content filters on a chatbot.",
  );
  const [output, setOutput] = useState<null | {
    decision: string;
    toxicity: number;
    flaggedTokens: string[];
    gates: { gate: string; status: string; reason?: string }[];
  }>(null);

  const run = () => {
    setOutput({
      decision: "blocked",
      toxicity: 0.78,
      flaggedTokens: ["bypass", "filters"],
      gates: [
        { gate: "Gate 1 — Blocklist", status: "passed" },
        { gate: "Gate 2 — Normalization", status: "flagged", reason: "Intent obfuscation detected" },
        { gate: "Gate 3 — Toxicity", status: "blocked", reason: "Score 0.78 > threshold 0.42" },
      ],
    });
  };

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Playground"
          description="Send a prompt through the live guardrail stack and inspect every gate decision."
          action={
            <Button onClick={run}>
              <Play className="h-4 w-4" />
              Run scan
            </Button>
          }
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="hover-radius border border-border bg-card p-8">
            <label className="text-sm font-medium text-foreground">Prompt</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={10}
              className="mt-3 w-full resize-none border border-border bg-background p-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
            />

            <div className="hover-radius mt-6 flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-secondary/40 p-10 text-center text-sm text-muted-foreground hover:border-primary">
              <Upload className="h-5 w-5" />
              Drop an image to scan, or click to browse
            </div>
          </div>

          <div className="hover-radius border border-border bg-card p-8">
            <label className="text-sm font-medium text-foreground">Result</label>
            {!output ? (
              <div className="mt-3 flex h-[412px] items-center justify-center text-sm text-muted-foreground">
                Run a scan to see structured guardrail output.
              </div>
            ) : (
              <div className="mt-4 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Decision
                  </div>
                  <div className="mt-1 text-2xl font-semibold capitalize text-foreground">
                    {output.decision}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                    <span>Toxicity score</span>
                    <span className="text-foreground">{output.toxicity.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${output.toxicity * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Flagged tokens
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {output.flaggedTokens.map((t) => (
                      <span
                        key={t}
                        className="hover-radius border border-border bg-secondary px-2.5 py-1 font-mono text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    JSON
                  </div>
                  <pre className="overflow-x-auto border border-border bg-background p-4 font-mono text-xs text-foreground">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
