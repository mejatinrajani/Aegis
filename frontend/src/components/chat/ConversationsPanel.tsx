import { useChatStore } from "@/store/chat.store";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ConversationsPanel() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const setActive = useChatStore((s) => s.setActive);
  const newConversation = useChatStore((s) => s.newConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  return (
    <div className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-background">
      <div className="p-4">
        <button
          onClick={() => {
            setActive(null);
            newConversation();
          }}
          className="hover-radius flex w-full items-center justify-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <div className="px-4 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Recent
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 && (
          <div className="px-4 py-6 text-xs text-muted-foreground">No conversations yet.</div>
        )}
        <ul className="flex flex-col gap-0.5">
          {conversations.map((c) => {
            const active = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  onClick={() => setActive(c.id)}
                  className={cn(
                    "hover-radius group flex w-full items-start gap-3 px-3 py-2.5 text-left text-sm",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{c.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true })}
                    </div>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(c.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteConversation(c.id);
                      }
                    }}
                    className="hover-radius opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background p-1 -m-1"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
