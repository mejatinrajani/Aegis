import { useState, useRef, useEffect } from "react";
import { MessageSquare, MoreVertical, Edit2, Trash2, Pin, PinOff, Plus } from "lucide-react";
import { useChatStore } from "@/store/chat.store";

export function ConversationsPanel() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const setActive = useChatStore((s) => s.setActive);
  const newConversation = useChatStore((s) => s.newConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const renameConversation = useChatStore((s) => s.renameConversation);
  const togglePin = useChatStore((s) => s.togglePin);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleStartEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setMenuOpenId(null);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") handleSaveEdit(id);
    if (e.key === "Escape") setEditingId(null);
  };

  // Sort conversations: Pinned first, then by date
  const pinnedChats = conversations.filter((c) => c.pinned);
  const recentChats = conversations.filter((c) => !c.pinned).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const renderChatItem = (c: any) => {
    const isActive = activeId === c.id;
    const isEditing = editingId === c.id;

    return (
      <div
        key={c.id}
        className={`group relative flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors ${
          isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => !isEditing && setActive(c.id)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <MessageSquare size={16} className="shrink-0 opacity-70" />
          
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => handleSaveEdit(c.id)}
              onKeyDown={(e) => handleKeyDown(e, c.id)}
              className="flex-1 bg-transparent outline-none border-b border-primary/50 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate text-sm">{c.title}</span>
          )}
        </div>

        {/* 3-Dot Menu Button (Visible on Hover or if Menu is Open) */}
        {!isEditing && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(menuOpenId === c.id ? null : c.id);
              }}
              className={`p-1 rounded-md transition-colors ${
                menuOpenId === c.id ? "bg-muted text-foreground opacity-100" : "opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <MoreVertical size={14} />
            </button>

            {/* Dropdown Menu */}
            {menuOpenId === c.id && (
              <div 
                className="absolute right-0 top-full mt-1 w-36 py-1 bg-background border rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-top-2 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => { togglePin(c.id); setMenuOpenId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left"
                >
                  {c.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                  {c.pinned ? "Unpin" : "Pin Chat"}
                </button>
                <button
                  onClick={() => handleStartEdit(c.id, c.title)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left"
                >
                  <Edit2 size={14} /> Rename
                </button>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => { deleteConversation(c.id); setMenuOpenId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 dark:hover:bg-red-950/50 text-left"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-full flex flex-col border-r bg-background/50">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={() => setActive(newConversation())}
          className="w-full flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-lg transition-colors font-medium text-sm"
        >
          <Plus size={16} /> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {/* Pinned Section */}
        {pinnedChats.length > 0 && (
          <div className="mb-4">
            <h3 className="px-5 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pinned</h3>
            <div className="space-y-0.5">
              {pinnedChats.map(renderChatItem)}
            </div>
          </div>
        )}

        {/* Recent Section */}
        {recentChats.length > 0 && (
          <div>
            <h3 className="px-5 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</h3>
            <div className="space-y-0.5">
              {recentChats.map(renderChatItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}