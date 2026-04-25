import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="max-w-md text-center">
        <div className="text-[80px] font-semibold tracking-tight text-foreground">404</div>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="hover-radius inline-flex h-10 items-center justify-center bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/85"
          >
            Back to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aegis Guard — AI Chatbot & Guardrail Middleware" },
      {
        name: "description",
        content:
          "Enterprise administration console for AI chatbots and guardrail middleware. Inspect, configure, and monitor LLM safety in real time.",
      },
      { name: "author", content: "Aegis Guard" },
      { property: "og:title", content: "Aegis Guard — Guardrail Middleware Console" },
      {
        property: "og:description",
        content:
          "Configure deterministic, normalization, and toxicity gates for any LLM. Inspect every request.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster position="bottom-right" />
    </>
  );
}
