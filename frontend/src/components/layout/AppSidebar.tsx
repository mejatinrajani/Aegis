import { Link, useRouterState } from "@tanstack/react-router";
import { useUiStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  FlaskConical,
  LayoutDashboard,
  History,
  ShieldCheck,
  KeyRound,
  Settings,
  Activity,
  SearchCode,
  Bell,
  Users,
  Receipt,
  PanelLeft,
  Shield,
} from "lucide-react";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Workspace",
    items: [
      { to: "/", label: "Chat", icon: MessageSquare },
      { to: "/playground", label: "Playground", icon: FlaskConical },
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/history", label: "History", icon: History },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/monitoring", label: "Monitoring", icon: Activity },
      { to: "/inspector", label: "Inspector", icon: SearchCode },
      { to: "/alerts", label: "Alerts", icon: Bell },
      { to: "/usage", label: "Usage", icon: Receipt },
    ],
  },
  {
    label: "Configuration",
    items: [
      { to: "/guardrails", label: "Guardrails", icon: ShieldCheck },
      { to: "/api-keys", label: "API Keys", icon: KeyRound },
      { to: "/users", label: "Users", icon: Users },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-border px-4",
          collapsed ? "h-16 justify-center" : "h-16 justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.25} />
            </div>
            <span className="text-base font-semibold tracking-tight">Aegis Guard</span>
          </div>
        )}
        <button
          onClick={toggle}
          className="hover-radius flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {groups.map((group) => (
          <div key={group.label} className="mb-7">
            {!collapsed && (
              <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active =
                  item.to === "/"
                    ? pathname === "/"
                    : pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "hover-radius flex items-center gap-3 px-3 py-2.5 text-sm",
                        active
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                      {!collapsed && active && (
                        <span className="ml-auto h-1.5 w-1.5 bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {user && (
        <div
          className={cn(
            "border-t border-border px-3 py-4",
            collapsed && "flex justify-center",
          )}
        >
          <div className={cn("hover-radius flex items-center gap-3 p-2", collapsed && "p-0")}>
            <div className="flex h-9 w-9 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
              {user.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{user.name}</div>
                <div className="truncate text-xs capitalize text-muted-foreground">{user.role}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
