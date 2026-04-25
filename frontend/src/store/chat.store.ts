import { create } from "zustand";
import { mockConversations } from "@/lib/mock-data";
import type { ChatMessage, Conversation } from "@/types";

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  isStreaming: boolean;
  abortController: AbortController | null;

  setActive: (id: string | null) => void;
  newConversation: () => string;
  deleteConversation: (id: string) => void;
  
  // ADDED: imageUrl parameter and setReaction
  sendMessage: (content: string, imageUrl?: string) => Promise<void>;
  setReaction: (messageId: string, reaction: "like" | "dislike" | null) => void;
  
  regenerateLast: () => Promise<void>;
  stopGeneration: () => void;
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  activeId: null,
  isStreaming: false,
  abortController: null,

  setActive: (id) => set({ activeId: id }),

  newConversation: () => {
    const id = uid("c");
    const convo: Conversation = {
      id,
      title: "New conversation",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    set((s) => ({ conversations: [convo, ...s.conversations], activeId: id }));
    return id;
  },

  deleteConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      activeId: s.activeId === id ? null : s.activeId,
    })),

  // ADDED: Reaction toggle logic
  setReaction: (messageId, reaction) =>
    set((s) => ({
      conversations: s.conversations.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === messageId ? { ...m, reaction } : m
        ),
      })),
    })),

  // FIXED: Added imageUrl to the arguments here
  sendMessage: async (content, imageUrl) => {
    let activeId = get().activeId;
    if (!activeId) activeId = get().newConversation();

    const userMsg: ChatMessage = {
      id: uid("m"),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
      guardrailScanned: true,
      imageUrl: imageUrl, // Now TypeScript knows where this comes from!
    };
    
    const assistantMsg: ChatMessage = {
      id: uid("m"),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      streaming: true,
    };

    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === activeId
          ? {
              ...c,
              title: c.messages.length === 0 ? truncateTitle(content) : c.title,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, userMsg, assistantMsg],
            }
          : c,
      ),
    }));

    await fetchAegisReply(activeId, assistantMsg.id, content, set, get);
  },

  regenerateLast: async () => {
    const { activeId, conversations } = get();
    if (!activeId) return;
    const convo = conversations.find((c) => c.id === activeId);
    if (!convo) return;
    const lastUser = [...convo.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    const trimmed = [...convo.messages];
    while (trimmed.length && trimmed[trimmed.length - 1].role === "assistant") {
      trimmed.pop();
    }
    
    const assistantMsg: ChatMessage = {
      id: uid("m"),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      streaming: true,
    };
    
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === activeId ? { ...c, messages: [...trimmed, assistantMsg] } : c,
      ),
    }));
    
    await fetchAegisReply(activeId, assistantMsg.id, lastUser.content, set, get);
  },

  stopGeneration: () => {
    const ctrl = get().abortController;
    ctrl?.abort();
    set({ isStreaming: false, abortController: null });
  },
}));

function truncateTitle(s: string) {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length > 48 ? t.slice(0, 48) + "…" : t;
}

async function fetchAegisReply(
  conversationId: string,
  assistantId: string,
  prompt: string,
  set: (fn: (s: ChatState) => Partial<ChatState> | ChatState) => void,
  get: () => ChatState,
) {
  const controller = new AbortController();
  set(() => ({ isStreaming: true, abortController: controller }));

  const apiUrl = import.meta.env.VITE_AEGIS_API_URL || "https://mejatinrajani-mhpcd-aegis.hf.space/v1/chat";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error("Aegis Gateway Error");

    const data = await res.json();
    
    const conversations = get().conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantId
                ? { 
                    ...m, 
                    content: data.response, 
                    flagged: data.flagged, 
                    score: data.score,
                    streaming: false, 
                    guardrailScanned: true 
                  }
                : m,
            ),
          }
        : c,
    );
    set(() => ({ conversations }));

  } catch (error: any) {
    if (error.name === "AbortError") return; 
    
    const conversations = get().conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantId
                ? { ...m, content: "⚠️ [SYSTEM OFFLINE] Aegis Proxy is unreachable.", streaming: false }
                : m,
            ),
          }
        : c,
    );
    set(() => ({ conversations }));
  } finally {
    set(() => ({ isStreaming: false, abortController: null }));
  }
}