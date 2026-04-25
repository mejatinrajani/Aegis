import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/common/page-elements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-5.2");
  const [webhook, setWebhook] = useState("https://hooks.example.com/aegis/events");

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Settings"
          description="Manage your account, LLM providers, and webhook delivery."
        />

        <Tabs defaultValue="account" className="mt-10">
          <TabsList className="mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="provider">LLM Provider</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="hover-radius border border-border bg-card p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Full name">
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Email">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </Field>
                <Field label="Role">
                  <Input value={user?.role ?? ""} readOnly />
                </Field>
                <Field label="Member since">
                  <Input value={user?.createdAt.slice(0, 10) ?? ""} readOnly />
                </Field>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="provider">
            <div className="hover-radius border border-border bg-card p-8">
              <div className="space-y-6">
                <Field label="Provider">
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="hover-radius w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="google">Google Gemini</option>
                    <option value="local">Self-hosted</option>
                  </select>
                </Field>
                <Field label="Default model">
                  <Input value={model} onChange={(e) => setModel(e.target.value)} />
                </Field>
                <Field label="API key">
                  <Input type="password" placeholder="sk-…" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Stored encrypted. Never exposed to the client.
                  </p>
                </Field>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => toast.success("Provider saved")}>Save</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhooks">
            <div className="hover-radius border border-border bg-card p-8">
              <Field label="Webhook URL">
                <Input value={webhook} onChange={(e) => setWebhook(e.target.value)} />
                <p className="mt-2 text-xs text-muted-foreground">
                  POST receives `decision`, `gates[]`, and full request envelope.
                </p>
              </Field>
              <div className="mt-6">
                <div className="text-sm font-medium text-foreground">Events</div>
                <div className="mt-3 space-y-2">
                  {["request.allowed", "request.flagged", "request.blocked", "system.alert"].map(
                    (ev) => (
                      <label
                        key={ev}
                        className="hover-radius flex items-center gap-3 border border-border bg-background p-3 text-sm"
                      >
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="font-mono text-xs">{ev}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => toast.success("Webhook saved")}>Save</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
