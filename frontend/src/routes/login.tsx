import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("alex.morgan@aegisguard.io");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/" });
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left visual */}
      <div className="hidden flex-1 flex-col justify-between border-r border-border bg-secondary p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.25} />
          </div>
          <span className="text-base font-semibold tracking-tight">Aegis Guard</span>
        </div>

        <blockquote className="max-w-md">
          <p className="text-2xl font-semibold leading-snug tracking-tight text-foreground">
            "Aegis cut our hallucination escalations by 84% in the first week. The
            inspector alone replaced an entire dashboard we were building."
          </p>
          <footer className="mt-6 text-sm text-muted-foreground">
            — Mira Chen, Head of Trust & Safety, Northwind AI
          </footer>
        </blockquote>

        <div className="text-xs text-muted-foreground">
          © Aegis Guard · SOC 2 Type II · ISO 27001
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back. Enter your details to continue.
            </p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/" className="text-foreground underline-offset-4 hover:underline">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
