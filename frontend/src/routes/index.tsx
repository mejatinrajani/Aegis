import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ConversationsPanel } from "@/components/chat/ConversationsPanel";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useChatStore } from "@/store/chat.store";

export const Route = createFileRoute("/")({
  component: ChatPage,
});

function ChatPage() {
  return (
    <AppShell scrollable={false}>
      <div className="flex min-h-0 flex-1">
        <ConversationsPanel />
        <ChatThread />
      </div>
    </AppShell>
  );
}

function ChatThread() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const stopGeneration = useChatStore((s) => s.stopGeneration);
  const regenerateLast = useChatStore((s) => s.regenerateLast);

  const active = conversations.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  const empty = messages.length === 0;
  const lastAssistantStreaming =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].streaming;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              How can Aegis help today?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md">
              Secure multimodal analysis initialized. Send a text prompt or attach an image to evaluate content through the deterministic sieve and deep semantic PyTorch engine.
            </p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-8 pb-8">
            {messages.map((m, i) => (
              <ChatMessage
                key={m.id}
                message={m}
                isLast={i === messages.length - 1}
                onRegenerate={regenerateLast}
              />
            ))}
            {lastAssistantStreaming && messages[messages.length - 1].content === "" && (
              <div className="flex items-center gap-1.5 px-13 py-2">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </div>
        )}
      </div>
      <ChatComposer
        onSend={(content, imageUrl) => sendMessage(content, imageUrl)}
        onStop={stopGeneration}
        isStreaming={isStreaming}
      />
    </div>
  );
}