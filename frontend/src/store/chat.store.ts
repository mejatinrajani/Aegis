import { create } from "zustand";
import type { ChatMessage, Conversation } from "@/types";

// Extract base URL from your existing env var
const API_BASE = (import.meta.env.VITE_AEGIS_API_URL || "https://mejatinrajani-mhpcd-aegis.hf.space/v1/chat").replace('/v1/chat', '');

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  isStreaming: boolean;
  abortController: AbortController | null;

  initData: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  setActive: (id: string | null) => void;
  newConversation: () => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, newTitle: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  setReaction: (messageId: string, reaction: "like" | "dislike" | null) => Promise<void>;
  sendMessage: (content: string, imageUrl?: string) => Promise<void>;
  regenerateLast: () => Promise<void>;
  stopGeneration: () => void;
}

// Fallback ID generator for optimistic UI updates
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [], // Start empty, fetch from DB
  activeId: null,
  isStreaming: false,
  abortController: null,

  // --- 1. INITIALIZE DATABASE ---
  initData: async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations`);
      if (!res.ok) return;
      const data = await res.json();
      
      const parsedConversations: Conversation[] = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        updatedAt: d.updated_at,
        pinned: d.is_pinned,
        messages: [], // Messages load lazily when clicked
      }));

      set({ conversations: parsedConversations });
      
      // Auto-load messages for the most recent chat if it exists
      if (parsedConversations.length > 0) {
        get().setActive(parsedConversations[0].id);
      }
    } catch (error) {
      console.error("Failed to init DB:", error);
    }
  },

  // --- 2. LAZY LOAD MESSAGES ---
  loadMessages: async (conversationId: string) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
      if (!res.ok) return;
      const data = await res.json();

      const messages: ChatMessage[] = data.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        imageUrl: m.image_url,
        flagged: m.flagged,
        score: m.score,
        reaction: m.reaction,
        createdAt: m.created_at,
        guardrailScanned: true,
      }));

      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages } : c
        ),
      }));
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  },

  setActive: (id) => {
    set({ activeId: id });
    const convo = get().conversations.find((c) => c.id === id);
    // If we haven't loaded this chat's messages yet, fetch them!
    if (id && convo && convo.messages.length === 0) {
      get().loadMessages(id);
    }
  },

  // --- 3. CRUD OPERATIONS (Optimistic UI + DB Fetch) ---
  newConversation: async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      const dbConvo = await res.json();

      const convo: Conversation = {
        id: dbConvo.id,
        title: dbConvo.title,
        updatedAt: dbConvo.updated_at,
        pinned: dbConvo.is_pinned,
        messages: [],
      };

      set((s) => ({ conversations: [convo, ...s.conversations], activeId: convo.id }));
      return convo.id;
    } catch (error) {
      console.error("Failed to create chat:", error);
      return uid("c");
    }
  },

  deleteConversation: async (id) => {
    // Optimistic UI Update
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      activeId: s.activeId === id ? null : s.activeId,
    }));
    // Background DB Update
    fetch(`${API_BASE}/conversations/${id}`, { method: "DELETE" }).catch(console.error);
  },

  renameConversation: async (id, newTitle) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c
      ),
    }));
    fetch(`${API_BASE}/conversations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    }).catch(console.error);
  },

  togglePin: async (id) => {
    const convo = get().conversations.find((c) => c.id === id);
    if (!convo) return;
    const newPinStatus = !convo.pinned;

    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === id ? { ...c, pinned: newPinStatus } : c
      ),
    }));
    fetch(`${API_BASE}/conversations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_pinned: newPinStatus }),
    }).catch(console.error);
  },

  setReaction: async (messageId, reaction) => {
    set((s) => ({
      conversations: s.conversations.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === messageId ? { ...m, reaction } : m
        ),
      })),
    }));
    fetch(`${API_BASE}/messages/${messageId}/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction }),
    }).catch(console.error);
  },

  // --- 4. THE CORE MESSAGE LOOP ---
  sendMessage: async (content, imageUrl) => {
    let activeId = get().activeId;
    if (!activeId) activeId = await get().newConversation(); // Wait for DB to create it

    const userMsg: ChatMessage = {
      id: uid("m"),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
      guardrailScanned: true,
      imageUrl: imageUrl, 
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

    // If it's a new chat, auto-rename it in the DB to match the first prompt
    if (get().conversations.find(c => c.id === activeId)?.messages.length === 2) {
       get().renameConversation(activeId, truncateTitle(content));
    }

    await fetchAegisReply(activeId, assistantMsg.id, content, imageUrl, set, get);
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
    
    await fetchAegisReply(activeId, assistantMsg.id, lastUser.content, lastUser.imageUrl, set, get);
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

// --- THE CLOUD INTEGRATION FUNCTION ---
async function fetchAegisReply(
  conversationId: string,
  assistantId: string,
  prompt: string,
  imageUrl: string | undefined,
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
      body: JSON.stringify({ 
        conversation_id: conversationId, 
        message: prompt,
        imageUrl: imageUrl // Pass the base64 image string to FastAPI
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error("Aegis Gateway Error");

    const data = await res.json();
    
    // Inject response into UI and remove "streaming" state
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