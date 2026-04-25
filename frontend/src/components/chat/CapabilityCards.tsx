import { Sparkles, FileText, ShieldCheck } from "lucide-react";

const cards = [
  {
    icon: Sparkles,
    title: "Ask Anything",
    description:
      "Get fast, well-reasoned answers across product, ops, and engineering questions.",
    prompt: "Summarize the key benefits of multi-gate guardrail enforcement.",
  },
  {
    icon: FileText,
    title: "Analyze Content",
    description:
      "Paste a document or transcript to evaluate tone, intent, and compliance signals.",
    prompt: "Analyze this support ticket for sentiment and policy violations.",
  },
  {
    icon: ShieldCheck,
    title: "Test Guardrails",
    description:
      "Run adversarial prompts through the live gate stack and inspect each decision.",
    prompt: "Test the toxicity gate with an obfuscated leetspeak prompt.",
  },
];

export function CapabilityCards({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          How can I help today?
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Pick a starting point or ask anything below.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.title}
              onClick={() => onPick(c.prompt)}
              className="hover-radius group flex flex-col items-start gap-4 border border-border bg-card p-6 text-left hover:border-primary"
            >
              <div className="flex h-9 w-9 items-center justify-center bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-base font-semibold text-foreground">{c.title}</div>
                <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
