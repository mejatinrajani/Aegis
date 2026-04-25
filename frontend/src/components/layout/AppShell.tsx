import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
  /** Set to false for routes that manage their own scroll (e.g. chat). */
  scrollable?: boolean;
}

export function AppShell({ children, scrollable = true }: AppShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main
          className={
            scrollable
              ? "flex-1 overflow-y-auto"
              : "flex min-h-0 flex-1 flex-col overflow-hidden"
          }
        >
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

/** Convenience wrapper for content pages — applies the standard padding system. */
export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl p-8 md:p-10">{children}</div>;
}
