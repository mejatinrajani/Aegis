import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/common/page-elements";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/guardrails")({
  component: GuardrailsPage,
});

function GuardrailsPage() {
  const [gate1Enabled, setGate1Enabled] = useState(true);
  const [words, setWords] = useState("forbidden_term_1\nforbidden_term_2\ncompetitor_name");
  const [regex, setRegex] = useState(true);
  const [leetspeak, setLeetspeak] = useState(true);
  const [threshold, setThreshold] = useState([0.42]);
  const [model, setModel] = useState("guardrail-llm-v2.4");

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Guardrails configuration"
          description="Three sequential gates evaluate every request. Tune each independently."
          action={<Button onClick={() => toast.success("Configuration saved")}>Save changes</Button>}
        />

        <div className="mt-10 space-y-6">
          {/* Gate 1 */}
          <GateCard
            number={1}
            title="Deterministic blocklist"
            description="Hard rules. Any matching token aborts the request immediately."
            toggle={
              <Switch checked={gate1Enabled} onCheckedChange={setGate1Enabled} />
            }
          >
            <label className="text-sm font-medium text-foreground">Word list (one per line)</label>
            <textarea
              value={words}
              onChange={(e) => setWords(e.target.value)}
              rows={8}
              disabled={!gate1Enabled}
              className="mt-3 w-full resize-none border border-border bg-background p-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {words.split("\n").filter((l) => l.trim()).length} terms · case-insensitive
            </p>
          </GateCard>

          {/* Gate 2 */}
          <GateCard
            number={2}
            title="Normalization"
            description="Detect intent obfuscation through encoding and substitution patterns."
          >
            <div className="space-y-4">
              <ToggleRow
                title="Regex normalization"
                description="Strip zero-width chars, normalize Unicode lookalikes."
                checked={regex}
                onChange={setRegex}
              />
              <ToggleRow
                title="Leetspeak detection"
                description="Map character substitutions (e.g. 4→a, 0→o) before scoring."
                checked={leetspeak}
                onChange={setLeetspeak}
              />
            </div>
          </GateCard>

          {/* Gate 3 */}
          <GateCard
            number={3}
            title="Toxicity model"
            description="Calibrated classifier producing a 0–1 score per request."
          >
            <div className="space-y-8">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Threshold</label>
                  <span className="font-mono text-sm text-foreground">
                    {threshold[0].toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={threshold}
                  onValueChange={setThreshold}
                  min={0}
                  max={1}
                  step={0.01}
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Permissive (0.0)</span>
                  <span>Strict (1.0)</span>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-foreground">
                  Model version
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="hover-radius w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option>guardrail-llm-v2.4</option>
                  <option>guardrail-llm-v2.3</option>
                  <option>guardrail-llm-v2.2</option>
                </select>
              </div>
            </div>
          </GateCard>
        </div>
      </PageContainer>
    </AppShell>
  );
}

function GateCard({
  number,
  title,
  description,
  toggle,
  children,
}: {
  number: number;
  title: string;
  description: string;
  toggle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="hover-radius border border-border bg-card p-8 hover:border-primary">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="flex h-9 w-9 items-center justify-center bg-secondary font-mono text-sm">
            {number}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {toggle}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <div className="hover-radius flex items-center justify-between gap-6 border border-border bg-background p-4">
      <div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
