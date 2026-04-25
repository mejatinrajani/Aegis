import { delay } from "./client";
import { mockConversations } from "@/lib/mock-data";
import type { ChatMessage, Conversation } from "@/types";

export const chatService = {
  listConversations: () => delay<Conversation[]>(mockConversations),

  /**
   * Streaming completion. Yields response chunks so the chat UI can render
   * tokens progressively. Honors AbortSignal for the "stop generating" action.
   */
  async *streamReply(
    prompt: string,
    signal?: AbortSignal,
  ): AsyncGenerator<string, void, unknown> {
    const reply = craftMockReply(prompt);
    const tokens = reply.split(/(\s+)/);

    for (const token of tokens) {
      if (signal?.aborted) return;
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 30));
      yield token;
    }
  },
};

function craftMockReply(prompt: string): string {
  const trimmed = prompt.trim().toLowerCase();
  if (trimmed.includes("guardrail") || trimmed.includes("toxicity")) {
    return "Aegis Guard runs three sequential gates. Gate 1 enforces a deterministic blocklist, Gate 2 normalizes inputs (regex + leetspeak), and Gate 3 scores the request through a calibrated toxicity model. Each gate is logged independently so you can audit decisions per request.";
  }
  if (trimmed.includes("hello") || trimmed.includes("hi")) {
    return "Hi — I'm the Aegis assistant. Ask me about guardrail configuration, request inspection, or system health and I'll walk you through it.";
  }
  return "Here's how I'd approach that: first, isolate the constraint, then verify it against the guardrail decision log, and finally adjust the relevant gate's threshold. Let me know if you want a concrete example for any of those steps.";
}

export type { ChatMessage };
