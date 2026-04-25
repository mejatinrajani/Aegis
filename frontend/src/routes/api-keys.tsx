import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader, EmptyState } from "@/components/common/page-elements";
import { Button } from "@/components/ui/button";
import { mockApiKeys } from "@/lib/mock-data";
import type { ApiKey } from "@/types";
import { Copy, Plus, Trash2, KeyRound, Check } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/api-keys")({
  component: ApiKeysPage,
});

function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const generate = () => {
    const k: ApiKey = {
      id: `k_${Math.random().toString(36).slice(2, 8)}`,
      label: "New key",
      prefix: `ag_live_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      rateLimit: 120,
    };
    setKeys((prev) => [k, ...prev]);
    toast.success("API key generated");
  };

  const copy = async (k: ApiKey) => {
    await navigator.clipboard.writeText(`${k.prefix}…••••••••••••••••`);
    setCopiedId(k.id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const revoke = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revoked: true } : k)));
    setConfirmId(null);
    toast.success("Key revoked");
  };

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="API Keys"
          description="Generate scoped credentials for clients calling the guardrail middleware."
          action={
            <Button onClick={generate}>
              <Plus className="h-4 w-4" />
              Generate key
            </Button>
          }
        />

        <div className="hover-radius mt-10 border border-border bg-card">
          {keys.length === 0 ? (
            <EmptyState
              icon={KeyRound}
              title="No API keys yet"
              description="Generate your first key to start sending requests through the gateway."
              action={<Button onClick={generate}>Generate key</Button>}
            />
          ) : (
            <ul>
              {keys.map((k) => (
                <li
                  key={k.id}
                  className="hover-radius flex flex-col gap-4 border-b border-border p-6 last:border-0 hover:bg-secondary/40 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center bg-secondary">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-medium text-foreground">{k.label}</span>
                        {k.revoked && (
                          <span className="border border-border bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                            Revoked
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-mono text-xs text-muted-foreground">
                        {k.prefix}…••••••••••••
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-xs text-muted-foreground">
                    <div>
                      <div className="text-foreground">{k.rateLimit}</div>
                      <div>req/min</div>
                    </div>
                    <div>
                      <div className="text-foreground">{format(new Date(k.createdAt), "MMM d, yyyy")}</div>
                      <div>created</div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-foreground">
                        {k.lastUsedAt ? format(new Date(k.lastUsedAt), "MMM d, HH:mm") : "—"}
                      </div>
                      <div>last used</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => copy(k)}>
                        {copiedId === k.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      {!k.revoked &&
                        (confirmId === k.id ? (
                          <Button variant="destructive" size="sm" onClick={() => revoke(k.id)}>
                            Confirm revoke
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => setConfirmId(k.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}
