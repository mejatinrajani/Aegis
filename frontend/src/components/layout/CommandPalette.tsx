import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUiStore } from "@/store/ui.store";
import { useChatStore } from "@/store/chat.store";
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
  PlusCircle,
} from "lucide-react";

const routes = [
  { to: "/", label: "Chat", icon: MessageSquare },
  { to: "/playground", label: "Playground", icon: FlaskConical },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/monitoring", label: "Monitoring", icon: Activity },
  { to: "/inspector", label: "Inspector", icon: SearchCode },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/usage", label: "Usage", icon: Receipt },
  { to: "/guardrails", label: "Guardrails", icon: ShieldCheck },
  { to: "/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/users", label: "Users", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function CommandPalette() {
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const navigate = useNavigate();
  const newConversation = useChatStore((s) => s.newConversation);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search routes, actions, logs…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                newConversation();
                navigate({ to: "/" });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New chat
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigate">
            {routes.map((r) => {
              const Icon = r.icon;
              return (
                <CommandItem key={r.to} onSelect={() => go(r.to)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {r.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
    </CommandDialog>
  );
}
